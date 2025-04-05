'use client'

require("@solana/wallet-adapter-react-ui/styles.css");
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base'
import { clusterApiUrl, Connection } from '@solana/web3.js';
import {PhantomWalletAdapter, SolflareWalletAdapter} from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react';
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react'
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui'

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const network = WalletAdapterNetwork.Devnet
    const endpoint = useMemo(()=> clusterApiUrl(network), [network])

    const wallets = useMemo(()=>[
        new PhantomWalletAdapter(), new SolflareWalletAdapter()
    ], [network])

    
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}
