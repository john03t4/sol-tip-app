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

// Type augmentation to fix React 18 + Next.js 14 compatibility with wallet adapters
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "connection-provider": any;
      "wallet-provider": any;
      "wallet-modal-provider": any;
    }
  }
}

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

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
