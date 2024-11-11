'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useThemeContext } from '@/components/context/themeProvider';
import setGlobalColorTheme from '@/lib/themeColors';

type BackgroundWrapperProps = {
  children: React.ReactNode;
};

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  const { theme } = useTheme();
  const { themeColor } = useThemeContext();

  useEffect(() => {
    setGlobalColorTheme(theme as 'light' | 'dark', themeColor);
  }, [theme, themeColor]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Blurred Gradient Backgrounds */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full",
          "before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-['']",
          "after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3",
          "after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-['']",
          "before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-primary before:dark:opacity-10",
          "after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40",
          "sm:before:w-[480px] sm:after:w-[240px]",
          "before:lg:h-[360px]"
        )}
      >
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
