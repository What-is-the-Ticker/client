'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeColorToggle } from '@/components/themeToggle/ThemeColorToggle';
import { ThemeModeToggle } from '@/components/themeToggle/ThemeModeToggle';
import { navItems } from '@/lib/navItems';

type HeaderProps = {
  logo?: string;
  actions?: React.ReactNode;
};

export const Header = React.memo(function Header({ logo, actions }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 px-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {logo && <Image src={logo} alt="Logo" width={32} height={32} />}
          <span className="hidden font-bold sm:inline-block">MyApp</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.href ? 'text-primary font-semibold' : 'text-foreground/60'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-2">
            {actions}
            <ThemeColorToggle />
            <ThemeModeToggle />
          </div>
          <Button variant="ghost" className="md:hidden" size="sm" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col space-y-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 transition-colors hover:text-foreground/80',
                  pathname === item.href ? 'text-primary font-semibold' : 'text-foreground/60'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
});