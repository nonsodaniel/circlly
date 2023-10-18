import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import TopSection from "../components/shared/TopSection";
import LeftSideSection from "../components/shared/LeftSideSection";
import BottomSection from "../components/shared/BottomSection";
import RightSideSection from "../components/shared/RightSideSection";

export const metadata: Metadata = {
  title: "Circlly",
  description: "A robust Social media platform",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <TopSection />

          <main className="flex flex-row">
            <LeftSideSection />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            {/* @ts-ignore */}
            <RightSideSection />
          </main>

          <BottomSection />
        </body>
      </html>
    </ClerkProvider>
  );
}
