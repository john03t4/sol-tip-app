import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolTipProviders } from "./providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SolTip | Crypto Tipping Made Simple",
  description: "Send SOL or USDC tips to creators without sharing wallet addresses. Built on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SolTipProviders>
          <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
              <a href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SolTip
              </a>
              <nav className="flex gap-4 text-sm font-medium text-slate-600">
                <a href="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</a>
              </nav>
            </div>
          </header>
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
            {children}
          </main>
          <footer className="border-t py-6 text-center text-sm text-slate-500">
            Built for the 100xDevs Frontier Hackathon • Powered by Solana
          </footer>
        </SolTipProviders>
      </body>
    </html>
  );
}
