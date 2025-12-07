"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "custom";

interface ThemeContextType {
  theme: Theme;
  accentColor: string;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [accentColor, setAccentColorState] = useState<string>("#3b82f6");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedAccentColor = localStorage.getItem("accentColor");

    if (savedTheme) {
      setThemeState(savedTheme);
    }
    if (savedAccentColor) {
      setAccentColorState(savedAccentColor);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("light", "dark");
    root.removeAttribute("data-theme");

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "custom") {
      root.setAttribute("data-theme", "custom");
      // Set CSS variable for accent color
      root.style.setProperty("--accent-color", hexToOklch(accentColor));
    }

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted, accentColor]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("accentColor", accentColor);

    if (theme === "custom") {
      document.documentElement.style.setProperty(
        "--accent-color",
        hexToOklch(accentColor)
      );
    }
  }, [accentColor, mounted, theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{ theme, accentColor, setTheme, setAccentColor }}
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
