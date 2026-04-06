"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"; // ✅ Correct import
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolTipProviders({ children }: { children: React.ReactNode }) {
  // Defaults to devnet for safe testing. Switch to mainnet-beta before final submission.
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;
  const endpoint = process.env.NEXT_PUBLIC_QUICKNODE_RPC_URL || "https://api.devnet.solana.com";

  const wallets = useMemo(() => [new SolflareWalletAdapter({ network })], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
