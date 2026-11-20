"use client";
// The still pictures of the landing page, drawn from backlit's own picker (components/Backlit.tsx, components/Follow.tsx):
// the search with a result, the song file, the helper's command. Real marks for the players it works with.
import { useEffect, useState } from "react";
import { Cover } from "./Live";

const Ic = ({ id, alt, w = 24, h = 24 }: { id: string; alt: string; w?: number; h?: number }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className="ic" src={`/assets/icons/${id}.svg`} alt={alt} width={w} height={h} />
);
const Tile = ({ id, name, w, h }: { id: string; name: string; w?: number; h?: number }) => <span className="ic-tile lp-tile"><Ic id={id} alt={name} w={w} h={h} /></span>;

const SEARCH = <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="9" cy="9" r="5.5" /><path d="M13.2 13.2 17 17" /></svg>;
const NOTE = <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 15V4.5l8-1.5V13" /><circle cx="5.8" cy="15" r="2.2" /><circle cx="13.8" cy="13" r="2.2" /></svg>;

/** Way 1: search the song and it plays right here (or hit Start with your own player). */
export function SearchFragment() {
  return (
    <div className="ui ui-backlit lp-frag" role="img" aria-label="backlit's song search: Night drive found with word-by-word lyrics, a Play it here button and the players it works with: YouTube, Spotify and Apple Music.">
      <div className="lp-field" aria-hidden="true">{SEARCH}<span>night drive</span></div>
      <div className="lp-result" aria-hidden="true"><Cover className="lp-cover--row" /><span className="lp-result__words"><b>Night drive</b><span>backlit</span></span><em className="lp-tag lp-tag--words">Word by word</em><span className="lp-dur">0:40</span></div>
      <div className="lp-start" aria-hidden="true"><span className="lp-btn">Play it here</span><span className="lp-hint">or hit Start in your own player</span></div>
      <div className="lp-players" aria-hidden="true"><Tile id="spotify" name="Spotify" /><Tile id="applemusic" name="Apple Music" /><Tile id="youtube" name="YouTube" w={24} h={17} /></div>
    </div>
  );
}

/** Way 2: a song file from the computer, its light moving with the bass. */
export function FileFragment() {
  return (
    <div className="ui ui-backlit lp-frag" role="img" aria-label="backlit's file drop: a FLAC file of Night drive playing from the computer, with the level the light follows.">
      <div className="lp-drop" aria-hidden="true">{NOTE}<span><b>Play a song file</b><span>MP3, M4A, FLAC, WAV, OGG</span></span></div>
      <div className="lp-result" aria-hidden="true"><Cover className="lp-cover--row" /><span className="lp-result__words"><b>night-drive.flac</b><span>From your computer</span></span><em className="lp-tag">Exact timing</em></div>
      <div className="lp-meter" aria-hidden="true">{[0.34, 0.62, 0.9, 0.7, 0.48, 0.8, 0.56, 0.4, 0.66, 0.3, 0.52, 0.74].map((v, i) => <i key={i} style={{ transform: `scaleY(${v})` }} />)}</div>
    </div>
  );
}

/** Way 3: the helper's one command (the real one the app prints, for this site). */
export function FollowFragment() {
  const [origin, setOrigin] = useState("https://backlit.vercel.app");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  return (
    <div className="ui ui-backlit lp-frag" role="img" aria-label="backlit's helper: one Terminal command for a Mac, and backlit following Spotify.">
      <div className="lp-seg2" aria-hidden="true"><span className="on">Mac</span><span>Windows</span></div>
      <span className="lp-frag__note" aria-hidden="true">Open Terminal, paste this, press Return.</span>
      <div className="lp-cmd" aria-hidden="true"><code>curl -fsSL {origin.replace(/^https?:\/\//, "")}/link/mac.sh | bash</code><span>Copy</span></div>
      <div className="lp-live" aria-hidden="true"><Tile id="spotify" name="Spotify" /><span>Following Spotify</span></div>
    </div>
  );
}

/** The platform marks in the comparison table. */
export function Platforms({ ids }: { ids: ("apple" | "windows" | "linux-tux" | "chrome")[] }) {
  const name = { apple: "macOS", windows: "Windows", "linux-tux": "Linux", chrome: "ChromeOS" } as const;
  const size = { apple: [17, 20], windows: [20, 20], "linux-tux": [17, 20], chrome: [20, 20] } as const;
  return <span className="lp-platforms">{ids.map((id) => <span key={id} className="ic-tile lp-tile lp-tile--sm"><Ic id={id} alt={name[id]} w={size[id][0]} h={size[id][1]} /></span>)}</span>;
}

/** The first screen of /app: backlit's sign-in with publik (components/PublikGate.tsx, its words from lib/publik.ts). */
export function GateFragment() {
  return (
    <div className="lp-gate" role="img" aria-label="backlit's first screen: Sign in with publik, with the button that opens publik in your browser.">
      <div className="lp-gate__card" aria-hidden="true">
        <span className="lp-gate__app">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" width="22" height="22" />backlit
        </span>
        <b className="lp-gate__title">Sign in with publik</b>
        <span className="lp-gate__body">This app uses your publik account. Click Sign in with publik, then sign in in your browser.</span>
        <span className="lp-gate__btn">Sign in with publik</span>
      </div>
    </div>
  );
}
