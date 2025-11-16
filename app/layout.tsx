import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "react-hot-toast";

// تعريف الخطوط
const geist = Geist({ subsets: ["latin"], weight: "400" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Guevara Admin Dashboard",
  description: "Cosmetics management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* إضافة الخط على body */}
      <body className={`${geist.className} font-sans antialiased`}>
        <QueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
