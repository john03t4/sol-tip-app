"use client";

import { useMemo, ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolTipProviders({ children }: { children: ReactNode }) {
  const network =
    (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) ||
    WalletAdapterNetwork.Devnet;

  const endpoint =
    process.env.NEXT_PUBLIC_QUICKNODE_RPC_URL ||
    "https://api.devnet.solana.com";

  const wallets = useMemo(
    () => [new SolflareWalletAdapter({ network })],
    [network]
  );

  // @ts-ignore - Wallet adapter types conflict with Next.js 14 + React 18
  return (
    // @ts-ignore
    <ConnectionProvider endpoint={endpoint}>
      {/* @ts-ignore */}
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
