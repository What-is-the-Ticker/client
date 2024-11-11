'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useThemeContext } from '@/components/context/themeProvider';
import { availableThemeColors } from '@/lib/themeColors';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  expanded: boolean;
};

export function ThemeToggle({ expanded }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const { themeColor, setThemeColor } = useThemeContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'w-8 h-8 p-0',
            expanded && 'w-full justify-start px-3 py-2'
          )}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {expanded && <span className="ml-2">Theme</span>}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Theme Mode</h4>
            <div className="flex items-center space-x-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                Dark
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Theme Color</h4>
            <div className="grid grid-cols-5 gap-2">
              {availableThemeColors.map(({ name, light, dark }) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "p-0 h-8 w-8",
                    themeColor === name && "border-2 border-primary"
                  )}
                  onClick={() => setThemeColor(name as ThemeColors || "Blue")}
                >
                  <div
                    className={`rounded-sm w-full h-full ${theme === 'light' ? light : dark}`}
                  />
                  <span className="sr-only">{name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}