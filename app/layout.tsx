import type { Metadata } from "next";
import { AR_One_Sans } from "next/font/google";
import "./globals.css";

const arOneSans = AR_One_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tic-Tac-Toe",
  description: "Tic-Tac-Toe Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={arOneSans.className}>{children}</body>
    </html>
  );
}
