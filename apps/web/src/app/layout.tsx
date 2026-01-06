import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CombatID - Commission & Promotion Dashboard",
  description: "Digital identity and compliance platform for combat sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
