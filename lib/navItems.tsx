import React from 'react';
import { Home, Settings, HelpCircle } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
  { label: 'Help', href: '/help', icon: <HelpCircle className="h-5 w-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
];