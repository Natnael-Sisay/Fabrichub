import { ReactNode } from "react";
import { cn } from "@/lib";

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: "container" | "full" | "sm" | "md" | "lg" | "xl" | "2xl" | "6xl";
  className?: string;
}

const maxWidthClasses = {
  container: "container",
  full: "max-w-full",
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "6xl": "max-w-6xl",
};

export function PageLayout({
  children,
  maxWidth = "container",
  className,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main
        className={cn(
          "flex-1 mx-auto px-4 py-10 w-full",
          maxWidthClasses[maxWidth],
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
