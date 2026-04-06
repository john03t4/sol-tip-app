"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Wallet } from "lucide-react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const router = useRouter();

  const createLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) return;
    
    // Basic validation: Solana addresses are base58, 32-44 chars
    const clean = walletAddress.trim();
    if (clean.length < 32 || clean.length > 44) {
      alert("Please enter a valid Solana wallet address (32-44 characters)");
      return;
    }
    
    router.push(`/pay/${clean}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="mb-6 p-3 bg-indigo-50 rounded-full">
        <Sparkles className="w-6 h-6 text-indigo-600" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Tip creators in <span className="text-indigo-600">crypto</span>,<br />
        without the friction.
      </h1>
      <p className="text-lg text-slate-600 max-w-xl mb-8">
        Share a simple link. Fans connect their wallet, pick an amount, and send SOL or USDC instantly. No raw addresses. No copy-paste errors.
      </p>

      <form onSubmit={createLink} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter Solana wallet address (e.g. 9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin)"
          className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          Create Link <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-4 text-sm text-slate-500 flex items-center gap-2">
        <Wallet className="w-4 h-4" />
        <span>Don't have an address? <a href="https://solflare.com" target="_blank" rel="noopener" className="text-indigo-600 hover:underline">Get Solflare</a></span>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl w-full">
        {[
          { title: "One-Click Payments", desc: "Fans pay directly from their Solflare wallet. No seed phrases shared." },
          { title: "SOL & USDC Support", desc: "Send native SOL or stablecoins. Perfect for global tipping." },
          { title: "Real-Time Dashboard", desc: "Track every tip, transaction signature, and sender in one place." },
        ].map((feature, i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-slate-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
