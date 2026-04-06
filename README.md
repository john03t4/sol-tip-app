# SolTip 💸
> Clean, frictionless crypto tipping for creators on Solana.

**Live Demo**: [Your Vercel Link]  
**Track**: 100xDevs Frontier Hackathon

## 🎯 Problem
Creators hate sharing raw wallet addresses. Fans want a simple, trusted way to tip without copy-paste errors or scam risks.

## ✨ Solution
SolTip turns any X handle into a clean tipping page:
1. Creator shares: `soltip.vercel.app/pay/ezzy03t4`
2. Fan connects Solflare → picks amount → sends tip
3. Fan gets receipt + "Share on X" button
4. Creator views tips in real-time dashboard

## 🛠 Tech Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Solana Wallet Adapter (Solflare)
- QuickNode RPC
- Supabase (off-chain tip tracking)
- Vercel (hosting)

## 🚀 Quick Start
```bash
# 1. Clone repo
git clone https://github.com/yourname/soltip.git
cd soltip

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Add your QuickNode + Supabase keys

# 4. Run locally
npm run dev
# Open http://localhost:3000
