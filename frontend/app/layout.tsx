import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InsightStream | AI Search",
  description: "Perplexity-style AI search with interactive citations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Background gradient overlay for extra depth */}
        <div className="fixed inset-0 z-[-1] bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
        {children}
      </body>
    </html>
  );
}