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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const persisted = localStorage.getItem('persist:root');
                  if (persisted) {
                    const parsed = JSON.parse(persisted);
                    const theme = parsed.theme ? JSON.parse(parsed.theme) : null;
                    const mode = theme?.mode || 'light';
                    if (mode === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  }
                } catch (e) {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
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
