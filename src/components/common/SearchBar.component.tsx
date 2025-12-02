"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search products or brands...",
  disabled = false,
}: SearchBarProps) {
  const handleClear = () => {
    onChange("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 w-full"
        aria-label="Search products"
        disabled={disabled}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </form>
  );
}