import Backlit from "@/components/Backlit";
import { PublikGate } from "@/components/PublikGate";
import "./app.css";

// The software lives here, behind Sign in with publik. The landing page at / is public.
export const metadata = { title: "backlit · your screen glows with the song" };

export default function AppPage() {
  return (
    <PublikGate appName="backlit" tagline="Play a song: the edges of your screen glow in the album's colours and the lyrics land line by line." preview="/gate-preview.mp4">
      <Backlit />
    </PublikGate>
  );
}
