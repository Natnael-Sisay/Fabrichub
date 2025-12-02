"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, LogIn, LogOut, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/states";
import { ProductForm } from "@/components/pages/product";
import { ProductFormMode, ProductFormValues } from "@/types";
import { useAppDispatch } from "@/store/store";
import { createNewProduct } from "@/store/slices";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
export function Navbar() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const handleSubmit = async (values: ProductFormValues) => {
    try {
      await dispatch(createNewProduct(values)).unwrap();
      toast.success("Product created successfully!");
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to create product");
    }
  };

  return (
    <>
      <nav
        className="shadow-sm dark:shadow-primary/20 bg-background sticky top-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 cursor-pointer"
              aria-label="FabricHub Home"
            >
              <span className="text-2xl font-bold text-primary">FabricHub</span>
            </Link>

            <div className="flex items-center space-x-2">
              <Link href="/favorites" aria-label="View favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-primary border-primary cursor-pointer"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </Link>
              <ThemeToggle />
              {isAuthenticated && (
                <Button
                  variant="default"
                  size="default"
                  className="cursor-pointer"
                  onClick={() => setIsFormOpen(true)}
                  aria-label="Create new product"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add product</span>
                </Button>
              )}
              {!isAuthenticated ? (
                <Link href="/login" aria-label="Login">
                  <Button
                    variant="outline"
                    size="default"
                    className="cursor-pointer text-primary border-primary"
                    aria-label="Login"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="default"
                  className="cursor-pointer text-primary border-primary"
                  aria-label="Logout"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={ProductFormMode.CREATE}
        onSubmit={handleSubmit}
      />
    </>
  );
}
