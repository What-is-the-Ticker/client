'use client';

import Image from "next/image";
import { useState } from "react";
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import TokenCreator from "@/components/TokenCreator";

export default function Home() {
  const [isMinting, setIsMinting] = useState(false);
  const [message, setMessage] = useState('');

  const handleMint = async () => {
    setIsMinting(true);
    setMessage('Minting coin...');

    const name = "test0"; //test
    const symbol = "TST";
    const description = "This is a dynamically generated meme coin.";

    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, symbol, description }),
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
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
          loading="eager"
        />
      </div>

      <WalletMultiButton />
      <WalletDisconnectButton />

      {/* <TokenCreator /> */}

      <div>
        <h1>Mint Your Meme Coin</h1>
        <button onClick={handleMint} disabled={isMinting}>
          {isMinting ? 'Minting...' : 'Mint Coin'}
        </button>
        <p>{message}</p>
      </div>
    </main>
  );
}