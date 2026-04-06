# SolTip 💸
> Tip creators with SOL or USDC on Solana — no raw wallet addresses needed.

**Live Demo**: https://soltip.vercel.app  
**Track**: 100xDevs Frontier Hackathon

## 🎯 Problem
Creators hate sharing raw wallet addresses. Fans want a simple, trusted way to tip.

## ✨ Solution
SolTip turns any X handle into a clean tipping page:
1. Creator shares: `soltip.vercel.app/pay/ezzy03t4`
2. Fan connects Solflare → picks amount → sends tip
3. Fan gets receipt + "Share on X" button
4. Creator views tips in dashboard

## 🛠 Tech Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Solana Wallet Adapter (Solflare)
- QuickNode RPC
- Supabase (tips database)
- Vercel (hosting)

## 🚀 Quick Start
```bash
# 1. Clone
git clone https://github.com/yourname/soltip.git
cd soltip

# 2. Install
npm install

# 3. Setup env
cp .env.example .env.local
# Add your QuickNode + Supabase keys

# 4. Run dev
npm run dev
# Open http://localhost:3000
