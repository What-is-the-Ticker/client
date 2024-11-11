import React from 'react';
import { Home, Users, Settings, HelpCircle, Store } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
  { label: 'Forms', href: '/forms', icon: <Users className="h-5 w-5" /> },
  { label: 'Listings', href: '/listings', icon: <Store className="h-5 w-5" /> },
  { label: 'Help', href: '/help', icon: <HelpCircle className="h-5 w-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
];