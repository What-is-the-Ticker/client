'use client';

import { useState } from "react";
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { mintCoin } from "@/lib/solana/mint";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Aggregator from "@/components/WalletAggregator";

export default function Home() {
  const [isMinting, setIsMinting] = useState(false);
  const [message, setMessage] = useState('');
  const { publicKey, wallet } = useWallet();

  // Hardcoded for now
  const tokenMetadata = {
    name: 'Maaaaaaaaaaama',
    symbol: 'MEMR',
    description: 'MAMEM',
  }

  const handleMint = async () => {
    if (!publicKey || !wallet) {
      setMessage('Please connect your wallet');
      return;
    }

    setIsMinting(true);
    setMessage('Uploading metadata...');

    try {
      // Upload metadata via server
      const response = await fetch('/api/upload-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tokenMetadata.name,
          symbol: tokenMetadata.symbol,
          description: tokenMetadata.description,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setMessage(`Failed to upload metadata: ${result.error}`);
        return;
      }

      const metadataUri = result.metadataUri;

      // Prepare token metadata with the URI
      const fullTokenMetadata = {
        ...tokenMetadata,
        uri: metadataUri,
      };

      // Mint the coin using the auxiliary function
      const mintAddress = await mintCoin({
        walletAdapter: wallet.adapter,
        publicKey,
        tokenMetadata: fullTokenMetadata,
        amount: 1000000_00000000,
      });

      setMessage(`Coin minted successfully! Mint Address: ${mintAddress}`);
    } catch (error) {
      console.error('Minting failed:', error);
      setMessage('Failed to mint the coin.');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <main className="flex h-[90vh] flex-col items-center justify-between p-24">
      <div
        className="relative z-[-1] flex place-items-center before:absolute before:h-[300px]
          before:w-full before:-translate-x-1/2 before:rounded-full
          before:bg-gradient-radial before:from-white before:to-transparent
          before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px]
          after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200
          after:via-blue-200 after:blur-2xl after:content-['']
          before:dark:bg-gradient-to-br before:dark:from-transparent
          before:dark:to-primary before:dark:opacity-10 after:dark:from-sky-900
          after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px]
          sm:after:w-[240px] before:lg:h-[360px]"
      >
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
          loading="eager"
        />
      </div>

      
      <Aggregator />

      <div>
        <h1>Mint Your Meme Coin</h1>
        <button onClick={handleMint} disabled={isMinting || !publicKey}>
          {isMinting ? 'Minting...' : 'Mint Coin'}
        </button>
        <p>{message}</p>
      </div>
    </main>
  );
}