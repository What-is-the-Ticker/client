import React from 'react';
import { Home, Settings, HelpCircle } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const navItems: NavItem[] = [
  { label: 'Docs', href: '/', icon: <Home className="h-5 w-5" /> },
];