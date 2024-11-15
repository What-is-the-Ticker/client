'use client';

import Image from "next/image";
import { useState } from "react";
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const [isMinting, setIsMinting] = useState(false);
  const [message, setMessage] = useState('');
  const { publicKey, sendTransaction } = useWallet();

  // Hardcoded for now
  const tokenMetadata = {
    name: 'Mama',
    symbol: 'MEM',
    description: 'MAMEM',
  }

  const handleMint = async () => {
    if (!publicKey) {
      setMessage('Please connect your wallet');
      return;
    }

    setIsMinting(true);
    setMessage('Minting coin...');

    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tokenMetadata.name,
          symbol: tokenMetadata.symbol,
          description: tokenMetadata.description,
          recipient: publicKey.toBase58()
        }),
      });
      const result = await response.json();

      if (result.success) {
        setMessage(`Coin minted successfully! Mint Address: ${result.mintAddress}`);
      } else {
        setMessage(`Failed to mint the coin: ${result.error}`);
      }
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
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
          src="https://img.randme.me/"
          alt="Next.js Logo"
          width={720}
          height={148}
          priority
          no-cache
          loading="eager"
        />
      </div>
      <div>
        <button className='rounded-full px-5 py-2 bg-[#00FF51]/80 text-white text-2xl font-bold' onClick={handleMint} disabled={isMinting || !publicKey}>
          {isMinting ? 'Generating...' : 'Generate'}
        </button>
        <p>{message}</p>
      </div>
    </main>
  );
}