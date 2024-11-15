'use client';

import '@rainbow-me/rainbowkit/styles.css';

import React from 'react';
import { RainbowKitProvider, lightTheme, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient, } from "@tanstack/react-query";
import { wagmiConfig } from '@/lib/wagmi';
import { useTheme } from 'next-themes';
import { useThemeContext } from '@/components/context/themeProvider';

const queryClient = new QueryClient();

const colorTheme = (themeColor: ThemeColors) => {
  switch (themeColor) {
    case 'Blue':
      return {
        ...darkTheme.accentColors.blue,
      };
    case 'Green':
      return {
        ...darkTheme.accentColors.green,
      };
    case 'Rose':
      return {
        ...darkTheme.accentColors.red,
      };
    case 'Purple':
      return {
        ...darkTheme.accentColors.purple,
      };
    case 'Pink':
      return {
        ...darkTheme.accentColors.pink,
      };
    case 'Orange':
      return {
        ...darkTheme.accentColors.orange,
      };
    default:
      return {};
  }
};

export function WalletProviders({ children }: { children: React.ReactNode }) {
  const { themeColor } = useThemeContext();
  const { theme } = useTheme();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={theme === 'light' ? darkTheme(colorTheme(themeColor))
            :
            lightTheme(colorTheme(themeColor))
          }
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}