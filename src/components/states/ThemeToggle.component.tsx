"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleTheme } from "@/store/slices";
import { selectTheme } from "@/store/selectors";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="h-9 w-9 relative text-primary border-primary cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-4 w-4 rotate-0 scale-100 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
