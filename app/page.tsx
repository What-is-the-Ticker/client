'use client';

import { useState, useEffect } from "react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CoolMode } from "@/components/ui/cool-mode";
import { Button } from "@/components/ui/button";
import OrbitingCircles from "@/components/ui/orbiting-circles";
import SparklesText from "@/components/ui/sparkles-text";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mintCoin } from "@/lib/solana/mint";
import Image from "next/image";
import { Wallet, ExternalLink } from 'lucide-react';
import { useAccount, usePublicClient } from 'wagmi';
import { toast } from 'react-toastify';
// import contractAbi from ''; // Import the contract ABI here

// Hardcoded for now
const contractAbi:any = [
  // Contract ABI
];

export default function Home() {
  const [message, setMessage] = useState('');
  const [aiResponse, setAiResponse] = useState<{ name: string; ticker: string } | null>(null);
  const { publicKey, wallet: solanaAddress, connected: solanaConnected } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const publicClient = usePublicClient();
  const { address: ethereumAddress, isConnected: ethereumConnected } = useAccount();

  // Hardcoded for now
  const tokenMetadata = {
    name: 'Maaaaaaaaaaama',
    symbol: 'MEMR',
    description: 'MAMEM',
  }

  // Backend computation trigger (eigen + layer)
  const triggerComputation = async () => {
    toast.info('Requesting computation from backend...');
    try {
      const response = await fetch('/api/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Include any data your backend needs
          words: ['crypto', 'venture', 'space'], // Example data that I used for my generate-ticker api
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        toast.success('Backend computation initiated successfully!');
        // Optionally, you can set some state here if needed
      } else {
        toast.error(`Backend computation failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error requesting computation:', error);
      toast.error('Failed to request computation from backend.');
    }
  };
  
  const handleMint = async (name:string, ticker:string) => {
    if (!publicKey || !solanaAddress) {
      toast.error('Please connect your Solana wallet.');
      return;
    }
  
    setIsMinting(true);
    const toastId = toast.loading('Uploading metadata...');
  
    try {
      // Upload metadata via server
      const response = await fetch('/api/upload-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          symbol: ticker,
          description: 'Generated token',
        }),
      });
  
      const result = await response.json();
  
      if (!result.success) {
        toast.update(toastId, {
          render: `Failed to upload metadata: ${result.error}`,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
        return;
      }
  
      const metadataUri = result.metadataUri;
  
      // Prepare token metadata with the URI
      const fullTokenMetadata = {
        name,
        symbol: ticker,
        uri: metadataUri,
      };
  
      // Mint the coin using the auxiliary function
      const mintAddress = await mintCoin({
        walletAdapter: solanaAddress.adapter,
        publicKey,
        tokenMetadata: fullTokenMetadata,
        amount: 1000000_00000000,
      });
  
      toast.update(toastId, {
        render: `Coin minted successfully! Mint Address: ${mintAddress}`,
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
      console.error('Minting failed:', error);
      toast.update(toastId, {
        render: 'Failed to mint the coin.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsMinting(false);
    }
  }; 

  // openai api call
  const fetchTicker = async () => {
    setMessage("Calling AI to generate ticker...");
    try {
      const response = await fetch('/api/generate-ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: ['crypto', 'venture', 'space'],
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

  // Watch for contract events
  useEffect(() => {
    if (!ethereumAddress || !publicClient) return;

    const unwatch = publicClient.watchContractEvent({
      address: '0x',
      abi: contractAbi,
      eventName: 'functionName',
      onLogs: (logs) => {
        console.log('Contract Response!', logs);
        toast.success('Contract computation completed!');

        const { name, ticker } = (logs[0] as any).args; // Assuming the event has name and ticker, if not, carteation is necessary

        handleMint(name, ticker);
      },
    });

    return () => {
      unwatch();
    };
  }, [ethereumAddress, publicClient]);

  return (
    <main className="flex h-[90vh] flex-col items-center justify-between p-24">
      <div className="fixed top-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full w-12 h-12">
              <Wallet className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Tabs defaultValue="ethereum" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                <TabsTrigger value="solana">Solana</TabsTrigger>
              </TabsList>
              <TabsContent value="ethereum" className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ethereum Wallet</CardTitle>
                    <CardDescription>Connect your Ethereum wallet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ConnectButton />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="solana" className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Solana Wallet</CardTitle>
                    <CardDescription>Connect your Solana wallet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WalletMultiButton className="!bg-primary hover:!bg-primary/90 text-primary-foreground w-full justify-center" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-transparent">
        <SparklesText sparklesCount={8} className="pointer-events-none whitespace-pre-wrap text-center text-8xl font-semibold leading-none" text="What Is The Ticker ?" />

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

        <OrbitingCircles
          className="size-[50px] border-none bg-transparent"
          radius={190}
          duration={18}
          reverse
        >
          <Image className='rounded-full' src="/coins/PNUT.jpg" alt="PNUT Logo" width={50} height={50} />
        </OrbitingCircles>
        <OrbitingCircles
          className="size-[50px] border-none bg-transparent"
          radius={190}
          duration={18}
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
            <RainbowButton onClick={triggerComputation}>
              Test
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