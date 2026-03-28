"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// TODOS:
// 1. Create Theme Provider
// 2. Create useTheme hook
// 3. Use the provider in your layout

export function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) {
  //default theme is light
   const [theme, setTheme] = useState<Theme>(initialTheme);

   //set theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.cookie = `theme=${theme}; path=/; max-age=31536000; samesite=lax`;
  }, [theme]);


  //toggle theme handler
  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [theme]
  );

  //provide
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  //provide context
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("use Theme must be used within a ThemeProvider");
  }
  return context;
}
