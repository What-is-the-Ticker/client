'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Sidebar, SidebarClose } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/themeToggle/ThemeToggle';
import { navItems } from '@/lib/navItems';

type SideBarProps = {
  logo?: string;
  actions?: React.ReactNode;
};

export const SideBar = React.memo(function SideBar({ logo, actions }: SideBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const SidebarContent = () => (
    <div className="flex h-full flex-col border-r bg-background">
      {/* Header Section with Toggle Button */}
      <div className="flex items-center justify-between h-14 px-4 border-b">
        <Link href="/" className="flex items-center space-x-2">
          {(isExpanded || isMobileOpen) && <span className="font-bold w-36">MyApp</span>}
        </Link>
        {/* Toggle Button (hidden on mobile) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpand}
          className="hidden md:flex w-8 h-8"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? <SidebarClose className="h-6 w-6" /> : <Sidebar className="h-6 w-6" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 py-4 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-2 rounded-md py-2 px-3 text-sm font-medium',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {item.icon && React.isValidElement(item.icon) && React.cloneElement(item.icon)}
            </div>
            {(isExpanded || isMobileOpen) && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="border-t p-4 flex flex-col space-y-2">
        {/* Theme Toggle */}
        <div className={cn('flex flex-col space-y-2', (isExpanded || isMobileOpen) ? 'items-start' : 'items-center')}>
          <ThemeToggle expanded={isExpanded || isMobileOpen} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden md:flex transform transition-all duration-300 ease-in-out',
          isExpanded ? 'w-64' : 'w-16'
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden w-6 h-6"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
});