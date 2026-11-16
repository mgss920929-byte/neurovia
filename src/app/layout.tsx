import type { Metadata } from "next";
import "./globals.css";
import { SpaceWarpBackground } from "@/components/SpaceWarpBackground";

export const metadata: Metadata = {
  title: "Neurovia | Cognitive Benchmarking Suite",
  description: "Measure your mind's true potential and compete globally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#080D1A] text-[#F4F7FF] antialiased selection:bg-[#3988EF]/30 relative overflow-x-hidden">
        <SpaceWarpBackground />
        {children}
      </body>
    </html>
  );
}