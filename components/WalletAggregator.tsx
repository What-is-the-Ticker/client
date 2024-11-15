'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Replace with your button component if necessary
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Aggregator = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isEthereumConnected, setIsEthereumConnected] = useState(false);
  const [isSolanaConnected, setIsSolanaConnected] = useState(false);
  const [isConnected, setIsConnected] = useState(false)
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const openOverlay = () => setIsOverlayOpen(true);
  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setIsEthereumConnected(false);
    setIsSolanaConnected(false);
  };

  return (
    <div>
      {isConnected ?
      <div></div> 
      :
      <Button onClick={openOverlay} className="bg-green-500 text-white font-bold px-4 py-2 rounded-md">
         {"Connect Wallets"}
      </Button>
      }
      {/* Overlay */}
      {isOverlayOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Step 1: Connect Ethereum Wallet */}
          {!isEthereumConnected && (
            <div ref={overlayRef} className="bg-white rounded-lg p-6 shadow-lg w-80">
              <h2 className="text-lg text-black font-semibold">Connect ETH Wallet</h2>
              <p className="text-sm text-gray-700/80 font-light mb-4">
                You must connect both an Ethereum and a Solana wallet.
              </p>
              <div className="space-y-4">
                <ConnectButton accountStatus="avatar" chainStatus="icon" />
                <button
                  onClick={() => setIsEthereumConnected(true)}
                  className="mt-4 text-sm text-gray-500 hover:underline"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Connect Solana Wallet */}
          {isEthereumConnected && !isSolanaConnected && (
            <div ref={overlayRef} className="bg-white rounded-lg p-6 shadow-lg w-80">
              <h2 className="text-lg text-black font-semibold">Connect SOL Wallet</h2>
              <p className="text-sm text-gray-700/80 font-light mb-4">
                You must connect both an Ethereum and a Solana wallet.
              </p>
              <div className="space-y-4">
                <WalletMultiButton />
                <div></div>
                <button
                  onClick={() => setIsSolanaConnected(true)}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Final Step: Proceed to Mint */}
          {isEthereumConnected && isSolanaConnected && (
            <div ref={overlayRef} className="bg-white rounded-lg p-6 shadow-lg w-80">
              <h2 className="text-lg text-black font-semibold">LFG! 🔥</h2>
              <p className="text-sm text-gray-700/80 font-light mb-4">
                Mint your unique meme coin! The ticker is yours. 🫴
              </p>
              <div className="mt-4">
              <Button
  onClick={() => {
    closeOverlay(); 
    setIsConnected(true);
  }}
  className="w-full bg-green-500 text-white py-2 font-bold rounded-md"
>
  Let the fun begin! 🎰
</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Aggregator;
