"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Loader2, Twitter } from "lucide-react";

// USDC Mainnet mint. Switch to devnet mint if testing on devnet: Gho1n1tH1s1s4fAk3M1ntF0rT3st1ng1nG
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

export default function PayPage() {
  const { creator } = useParams<{ creator: string }>();
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();

  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<"SOL" | "USDC">("SOL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ sig: string; amount: string; token: string } | null>(null);

  const handleTip = async () => {
    if (!connected || !publicKey || !amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    setError(null);

    try {
      const creatorPk = new PublicKey(creator);
      const tx = new Transaction();
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      if (token === "SOL") {
        const lamports = parseFloat(amount) * 1_000_000_000;
        tx.add(SystemProgram.transfer({ fromPubkey: publicKey, toPubkey: creatorPk, lamports }));
      } else {
        const fromAta = await getAssociatedTokenAddress(USDC_MINT, publicKey);
        const toAta = await getAssociatedTokenAddress(USDC_MINT, creatorPk);
        const rawAmount = Math.floor(parseFloat(amount) * 10 ** 6); // USDC decimals
        tx.add(createTransferInstruction(fromAta, toAta, publicKey, rawAmount, [], TOKEN_PROGRAM_ID));
      }

      if (!signTransaction) throw new Error("Wallet signing not ready");
      const signedTx = await signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

      await supabase.from("tips").insert({
        creator,
        amount: parseFloat(amount),
        token,
        sender: publicKey.toBase58(),
        signature,
        status: "completed",
      });

      setSuccess({ sig: signature, amount, token });
    } catch (err: any) {
      console.error("Tip failed:", err);
      setError(err.message || "Transaction failed. Check wallet balance & try again.");
    } finally {
      setLoading(false);
    }
  };

  const shareOnX = () => {
    const text = encodeURIComponent(`Just tipped @${creator} ${success?.amount} ${success?.token} on SolTip! Support creators directly with crypto. 🐐✨`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tip Sent Successfully!</h2>
        <p className="text-slate-600 mb-6">{success.amount} {success.token} sent to @{creator}</p>
        <div className="bg-slate-50 rounded-lg p-3 mb-6 text-xs font-mono text-slate-500 break-all">Tx: {success.sig}</div>
        <button onClick={shareOnX} className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 mb-3">
          <Twitter className="w-4 h-4" /> Share on X
        </button>
        <button onClick={() => { setSuccess(null); setAmount(""); }} className="w-full text-indigo-600 py-2 font-medium hover:underline">Send another tip</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
        <p className="text-sm opacity-80 mb-1">Supporting</p>
        <h1 className="text-2xl font-bold">@{creator}</h1>
      </div>
      <div className="p-6 space-y-4">
        {!connected ? (
          <div className="text-center py-4">
            <p className="text-slate-600 mb-4">Connect your wallet to send a tip</p>
            <WalletMultiButton className="!bg-indigo-600 !hover:bg-indigo-700 !rounded-lg" />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <div className="flex gap-2">
                <input type="number" step="0.000001" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                <select value={token} onChange={(e) => setToken(e.target.value as "SOL" | "USDC")} className="px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="SOL">SOL</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}
            <button onClick={handleTip} disabled={loading || !amount} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Send ${amount || "0"} ${token} Tip`}
            </button>
            <p className="text-xs text-center text-slate-500 mt-2">Network fees apply. Transactions are irreversible.</p>
          </>
        )}
      </div>
    </div>
  );
}
