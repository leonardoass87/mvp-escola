import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import PWAInstaller from "@/components/PWAInstaller";

// Patch de compatibilidade do Ant Design para React 19
import "@ant-design/v5-patch-for-react-19";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MVP Escola - Sistema de Check-in",
  description: "Sistema simples de check-in para alunos",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          {children}
          <PWAInstaller />
        </AppProvider>
      </body>
    </html>
  );
}
