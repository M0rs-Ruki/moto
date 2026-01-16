"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Detect system preference
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme) {
      // If user has explicitly selected a theme, use it
      setThemeState(savedTheme);
    } else {
      // Otherwise, use system preference (but don't save it yet)
      const systemTheme = getSystemTheme();
      setThemeState(systemTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("light", "dark");

    if (theme === "dark") {
      // Explicit dark mode
      root.classList.add("dark");
    } else {
      // Light mode (explicit or system default)
      root.classList.remove("dark");
    }
  }, [theme, mounted]);

  // Listen to system theme changes (only if user hasn't explicitly set a theme)
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no explicit theme is saved in localStorage
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        // No explicit theme, follow system preference
        setThemeState(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted]);


  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // Save to localStorage when user explicitly sets a theme
    localStorage.setItem("theme", newTheme);
  };

  // Always provide context, even during SSR
  // This prevents the "useTheme must be used within a ThemeProvider" error
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
