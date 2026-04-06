"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { supabase } from "@/lib/supabase";
import { truncateAddress, formatDate, formatAmount } from "@/lib/utils";
import { ExternalLink, Loader2, Wallet } from "lucide-react";

interface Tip {
  id: string; creator: string; amount: number; token: string;
  sender: string; signature: string; status: string; created_at: string;
}

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (connected && publicKey) fetchTips(); }, [connected, publicKey]);

  const fetchTips = async () => {
    setLoading(true); setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("tips")
        .select("*")
        .eq("creator", publicKey!.toBase58())
        .order("created_at", { ascending: false });
      if (dbError) throw dbError;
      setTips(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load tips");
    } finally { setLoading(false); }
  };

  if (!connected) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <Wallet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Connect to View Dashboard</h2>
        <p className="text-slate-600 mb-6">Link your creator wallet to see incoming tips and transaction history.</p>
        <WalletMultiButton className="!bg-indigo-600 !rounded-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Creator Dashboard</h1>
          <p className="text-sm text-slate-500">Wallet: {truncateAddress(publicKey!.toBase58())}</p>
        </div>
        <button onClick={fetchTips} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">Refresh</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>
      ) : tips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-lg">No tips received yet 🌱</p>
          <p className="text-sm text-slate-400 mt-2">Share your tip link to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">From</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 font-medium">Explorer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tips.map((tip) => (
                  <tr key={tip.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{formatAmount(tip.amount, tip.token)}</td>
                    <td className="px-6 py-4 text-slate-600 hidden sm:table-cell font-mono text-sm">{truncateAddress(tip.sender)}</td>
                    <td className="px-6 py-4 text-slate-500 hidden md:table-cell text-sm">{formatDate(tip.created_at)}</td>
                    <td className="px-6 py-4">
                      <a href={`https://solscan.io/tx/${tip.signature}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm">View <ExternalLink className="w-3 h-3" /></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
