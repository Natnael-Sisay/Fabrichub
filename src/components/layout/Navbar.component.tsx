import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Search } from "lucide-react";
import { ThemeToggle } from "@/components/states/ThemeToggle.component";
import { SearchBar } from "@/components/common";

export function Navbar() {
  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">FabricHub</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />

            <Link href="/create">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Heart className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
