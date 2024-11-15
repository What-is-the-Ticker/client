'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/navItems';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import localFont from 'next/font/local';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const alice = localFont({
  src: "../public/Alice-Regular.ttf",
  variable: "--font-alice",
  weight: "100 900",
  display: "swap",
})

type HeaderProps = {
  logo?: string;
  actions?: React.ReactNode;
};

export const Header = React.memo(function Header({ logo, actions }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 px-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {logo && <Image src={logo} alt="Logo" width={32} height={32} />}
          <span className={`hidden font-bold ${alice.variable} sm:inline-block text-3xl text-[#00FF51]`}>What is the Ticker</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80 text-lg mr-10',
                  pathname === item.href ? 'text-primary font-semibold' : 'text-foreground/60'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <WalletMultiButton />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
});
