import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://backlit.vercel.app"),
  title: "backlit: your screen glows with the song",
  description:
    "Play a song and the edges of your screen glow in the album's colours while the lyrics land line by line. Works with Spotify, Apple Music, YouTube or a song file. Free and open source, in your browser on Mac, Windows and Linux.",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#050506", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
