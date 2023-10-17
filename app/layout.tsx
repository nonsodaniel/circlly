import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Circlly",
  description: "A robust Social media platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
