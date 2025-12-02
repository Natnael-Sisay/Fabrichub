import type { Metadata } from "next";
import "../styles/globals.css";
import { Navbar } from "@/components/layout/navbar";
import ClientProviders from "@/providers/ClientProviders";
import { Toaster } from "sonner";
import { SessionLayout } from "@/components/layout/session-layout";

export const metadata: Metadata = {
  title: "FabricHub - Modern eCommerce",
  description: "Discover amazing products with FabricHub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className="font-sans antialiased">
        <SessionLayout>
          <ClientProviders>
            <Navbar />
            {children}
            <Toaster duration={2000} position="top-right" richColors />
          </ClientProviders>
        </SessionLayout>
      </body>
    </html>
  );
}
