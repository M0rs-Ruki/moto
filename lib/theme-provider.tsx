"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "custom";

interface ThemeContextType {
  theme: Theme;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setTertiaryColor: (color: string) => void;
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
  const [primaryColor, setPrimaryColorState] = useState<string>("#3b82f6");
  const [secondaryColor, setSecondaryColorState] = useState<string>("#8b5cf6");
  const [tertiaryColor, setTertiaryColorState] = useState<string>("#ec4899");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedPrimaryColor = localStorage.getItem("primaryColor");
    const savedSecondaryColor = localStorage.getItem("secondaryColor");
    const savedTertiaryColor = localStorage.getItem("tertiaryColor");

    if (savedTheme) {
      // If user has explicitly selected a theme, use it
      setThemeState(savedTheme);
    } else {
      // Otherwise, use system preference (but don't save it yet)
      const systemTheme = getSystemTheme();
      setThemeState(systemTheme);
    }

    if (savedPrimaryColor) {
      setPrimaryColorState(savedPrimaryColor);
    }
    if (savedSecondaryColor) {
      setSecondaryColorState(savedSecondaryColor);
    }
    if (savedTertiaryColor) {
      setTertiaryColorState(savedTertiaryColor);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("light", "dark");
    root.removeAttribute("data-theme");

    if (theme === "custom") {
      // Custom theme - apply custom colors (ignore system preference)
      root.setAttribute("data-theme", "custom");
      root.style.setProperty("--primary-color", hexToOklch(primaryColor));
      root.style.setProperty("--secondary-color", hexToOklch(secondaryColor));
      root.style.setProperty("--tertiary-color", hexToOklch(tertiaryColor));
    } else if (theme === "dark") {
      // Explicit dark mode
      root.classList.add("dark");
    } else {
      // Light mode (explicit or system default)
      root.classList.remove("dark");
    }
  }, [theme, mounted, primaryColor, secondaryColor, tertiaryColor]);

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

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("secondaryColor", secondaryColor);
    localStorage.setItem("tertiaryColor", tertiaryColor);

    if (theme === "custom") {
      document.documentElement.style.setProperty("--primary-color", hexToOklch(primaryColor));
      document.documentElement.style.setProperty("--secondary-color", hexToOklch(secondaryColor));
      document.documentElement.style.setProperty("--tertiary-color", hexToOklch(tertiaryColor));
    }
  }, [primaryColor, secondaryColor, tertiaryColor, mounted, theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // Save to localStorage when user explicitly sets a theme
    localStorage.setItem("theme", newTheme);
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
  };

  const setSecondaryColor = (color: string) => {
    setSecondaryColorState(color);
  };

  const setTertiaryColor = (color: string) => {
    setTertiaryColorState(color);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        primaryColor,
        secondaryColor,
        tertiaryColor,
        setTheme,
        setPrimaryColor,
        setSecondaryColor,
        setTertiaryColor,
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

// Helper function to convert hex to oklch (simplified version)
function hexToOklch(hex: string): string {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Simple conversion to oklch (this is approximate)
  // For production, use a proper color conversion library
  const lightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const chroma = Math.sqrt((r - g) ** 2 + (g - b) ** 2 + (b - r) ** 2) * 0.5;

  // Calculate hue
  let hue = 0;
  if (chroma !== 0) {
    const delta = Math.max(r, g, b) - Math.min(r, g, b);
    if (delta !== 0) {
      if (Math.max(r, g, b) === r) {
        hue = ((g - b) / delta) % 6;
      } else if (Math.max(r, g, b) === g) {
        hue = (b - r) / delta + 2;
      } else {
        hue = (r - g) / delta + 4;
      }
      hue = (hue * 60 + 360) % 360;
    }
  }

  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(
    2
  )})`;
}
