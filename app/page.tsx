'use client';

import { useState } from "react";
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { mintCoin } from "@/lib/solana/mint";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CoolMode } from "@/components/ui/cool-mode";
import { Button } from "@/components/ui/button";
import OrbitingCircles from "@/components/ui/orbiting-circles";
import SparklesText from "@/components/ui/sparkles-text";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import Image from "next/image";

export default function Home() {
  const [isMinting, setIsMinting] = useState(false);
  const [message, setMessage] = useState('');
  const [aiResponse, setAiResponse] = useState<{ name: string; ticker: string } | null>(null); // State to store AI response
  const { publicKey, wallet } = useWallet();

  const tokenMetadata = {
    name: 'Maaaaaaaaaaama',
    symbol: 'MEMR',
    description: 'MAMEM',
  };

  const fetchTicker = async () => {
    setMessage("Calling AI to generate ticker...");
    try {
      const response = await fetch('/api/generate-ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: ['crypto', 'venture', 'space'], // Example input for now
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResponse(data.data);
        setMessage("AI response received!");
      } else {
        console.error("AI API Error:", data.error);
        setMessage("AI failed to generate a response.");
      }
    } catch (error) {
      console.error("Error fetching ticker:", error);
      setMessage("An error occurred while fetching the ticker.");
    }
  };


  const handleMint = async () => {
    if (!publicKey || !wallet) {
      setMessage('Please connect your wallet');
      return;
    }

    setIsMinting(true);
    setMessage('Uploading metadata...');

    try {
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

      const fullTokenMetadata = {
        ...tokenMetadata,
        uri: metadataUri,
      };

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
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-transparent">
        <SparklesText sparklesCount={8} className="pointer-events-none whitespace-pre-wrap text-center text-8xl font-semibold leading-none" text="What Is The Ticker ?" />

        {/* Inner Circles */}
        <OrbitingCircles
          className="size-[30px] border-none bg-transparent"
          duration={20}
          delay={20}
          radius={80}
        >
          <Image className='rounded-full' src="/coins/BONK.jpg" alt="BONK Logo" width={30} height={30} />
        </OrbitingCircles>
        <OrbitingCircles
          className="size-[30px] border-none bg-transparent"
          duration={20}
          delay={10}
          radius={80}
        >
          <Image className='rounded-full' src="/coins/PEPE.jpg" alt="PEPE Logo" width={30} height={30} />
        </OrbitingCircles>

        {/* Outer Circles (reverse) */}
        <OrbitingCircles
          className="size-[50px] border-none bg-transparent"
          radius={190}
          duration={20}
          reverse
        >
          <Image className='rounded-full' src="/coins/PNUT.jpg" alt="PNUT Logo" width={50} height={50} />
        </OrbitingCircles>
        <OrbitingCircles
          className="size-[50px] border-none bg-transparent"
          radius={190}
          duration={20}
          delay={20}
          reverse
        >
          <Image className='rounded-full' src="/coins/WIF.jpg" alt="WIF Logo" width={50} height={50} />
        </OrbitingCircles>

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <CoolMode
            options={{
              particle: "🦆",
              size: 60,
            }}
          >
            <RainbowButton onClick={fetchTicker}>
              Test AI
            </RainbowButton>
          </CoolMode>
          <p>{message}</p>
          {aiResponse && (
            <div className="mt-4 text-center">
              <p><strong>Name:</strong> {aiResponse.name}</p>
              <p><strong>Ticker:</strong> {aiResponse.ticker}</p>
            </div>
          )}
        </div>
        <div className="fixed bottom-8 right-8">
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}
