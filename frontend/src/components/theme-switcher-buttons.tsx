"use client";

import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcherButtons() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex w-full gap-2">
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        className="flex-1 h-10 justify-center gap-2"
        onClick={() => setTheme("light")}
      >
        <Sun className="h-4 w-4" style={{ color: "#1976B8" }} />
        <span className="text-sm font-medium">Light</span>
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        className="flex-1 h-10 justify-center gap-2"
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-4 w-4" style={{ color: "#1976B8" }} />
        <span className="text-sm font-medium">Dark</span>
      </Button>
    </div>
  );
}
