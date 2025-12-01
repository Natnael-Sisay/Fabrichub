import type { Metadata } from "next";
import "../styles/globals.css";
import { Navbar } from "@/components/layout";

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
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
