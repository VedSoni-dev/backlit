import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";

const DESCRIPTION =
  "Play a song and the edges of your screen glow in its cover's colours while the lyrics land word by word as chat bubbles. Free and open source, in a browser on Mac, Windows, Linux and Chromebook.";

export const metadata: Metadata = {
  title: "backlit: synced lyrics and screen glow, free in your browser",
  description: DESCRIPTION,
  openGraph: { title: "backlit: your screen glows with the song", description: DESCRIPTION, type: "website", images: ["/assets/share.jpg"] },
  twitter: { card: "summary_large_image" },
  // the page type the taste kit reads (page-type, site-kind; <html data-type> is set by Landing's first script)
  other: { "page-type": "software", "site-kind": "software" },
};

export default function Home() {
  return <Landing />;
}
