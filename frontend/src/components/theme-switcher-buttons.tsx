"use client";

import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcherButtons() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex w-full gap-1.5">
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        className="flex-1 h-9 justify-center gap-1.5"
        onClick={() => setTheme("light")}
      >
        <Sun className="h-3.5 w-3.5" style={{ color: "#1976B8" }} />
        <span className="text-xs font-medium">Light</span>
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        className="flex-1 h-9 justify-center gap-1.5"
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-3.5 w-3.5" style={{ color: "#1976B8" }} />
        <span className="text-xs font-medium">Dark</span>
      </Button>
    </div>
  );
}
