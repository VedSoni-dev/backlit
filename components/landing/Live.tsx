"use client";
// The landing page's live pictures: backlit's own stage (Glow and Lyrics from components/Stage.tsx) driven the way
// components/Backlit.tsx drives it (a frame clock, lineAt / wordsAt, --lvl on an ancestor for the light's breathing),
// running our own example words ("Night drive" by backlit) over our own generated cover. Each live piece keeps its
// own state, so the static page around it never redraws under the kit's scripts.
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { Glow, Lyrics, type LyricStyle } from "@/components/Stage";
import { clock, lineAt, parseLrc, withWords, wordsAt, type Line } from "@/lib/lrc";
import { PRESETS, hex, paletteFrom } from "@/lib/palette";

// The app's own example (components/Backlit.tsx, EXAMPLE_LRC): our words, no music.
const NIGHT_DRIVE = `[00:01.00]lights down, volume up
[00:04.20]the room goes quiet but the edges don't
[00:08.00]every line lands right on time
[00:11.60]like it heard the song before you did
[00:15.20]
[00:18.00]no app to buy, no trial to end
[00:21.60]just a tab, a track and the glow
[00:25.40]put it full screen
[00:28.60]turn the big light off
[00:32.00]and let the song paint the walls
[00:36.50]`;
export const LINES: Line[] = withWords(parseLrc(NIGHT_DRIVE));
const LOOP = 38.4; // the example is 40 s long; the loop starts again just before the first line
const LOOP_FROM = 0.4;
const SONG_LEN = 40;
const LEAD = 0.12;

// ---------------------------------------------------------------- the cover: our own art, drawn from three lights
// (tail lights, a street lamp, the dashboard) on a night-blue ground. The CSS draws it; the same spec is rasterised
// here at 28 x 28 and handed to the app's own palette code (lib/palette.ts paletteFrom), exactly as the app reads a
// real cover, so the glow is the cover's colours.
const BASE = "#0d1024";
const BLOBS: [x: number, y: number, r: number, col: string][] = [
  [80, 215, 200, "#ff3b6b"],
  [228, 78, 170, "#ffab3d"],
  [250, 250, 130, "#1ccfbe"],
];
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function rasterCover(n: number): Uint8ClampedArray {
  const px = new Uint8ClampedArray(n * n * 4);
  const base = rgb(BASE);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const X = ((x + 0.5) / n) * 300, Y = ((y + 0.5) / n) * 300;
    let c = [...base];
    for (const [bx, by, r, col] of BLOBS) {
      const a = Math.max(0, 1 - Math.hypot(X - bx, Y - by) / r);
      const s = rgb(col);
      c = c.map((v, k) => s[k] * a + v * (1 - a));
    }
    const o = (y * n + x) * 4;
    px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255;
  }
  return px;
}
export const COVER_COLORS = paletteFrom(rasterCover(28), 4).map(hex);
export const COVER_BG = [...BLOBS].reverse().map(([x, y, r, col]) => `radial-gradient(${(r / 3).toFixed(1)}% ${(r / 3).toFixed(1)}% at ${(x / 3).toFixed(1)}% ${(y / 3).toFixed(1)}%, ${col}, transparent)`).join(", ") + `, ${BASE}`;
export function Cover({ className = "" }: { className?: string }) {
  return <span className={`lp-cover ${className}`} style={{ background: COVER_BG }} aria-hidden="true" />;
}

// ---------------------------------------------------------------- the clock
type Frame = { idx: number; sung: number };
const frameAt = (t: number): Frame => {
  const idx = lineAt(LINES, t + LEAD);
  return { idx, sung: idx >= 0 ? Math.min(999, wordsAt(LINES[idx], t + LEAD)) : 0 };
};
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The song's place in seconds, from load, looping; paused by the button, still under reduced motion.
 *  Every frame: the line and the words sung so far (state), the light's level on `root` (--lvl) and, when
 *  given, the progress bar and the time (refs, like the app's dock). Off screen it skips the drawing but keeps
 *  the clock it started on load. */
function useSong(rest: number, root: RefObject<HTMLElement | null>, dock?: { bar: RefObject<HTMLElement | null>; time: RefObject<HTMLElement | null> }) {
  const [frame, setFrame] = useState<Frame>(() => frameAt(rest));
  const [running, setRunning] = useState(true);
  const [still, setStill] = useState(false);
  const clk = useRef({ base: rest, anchor: 0 });
  const seen = useRef(true);
  const last = useRef(frame);

  useEffect(() => { if (reduced()) { setStill(true); setRunning(false); } }, []);
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver !== "function") return;
    const io = new IntersectionObserver(([e]) => { seen.current = e.isIntersecting; }, { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, [root]);

  useEffect(() => {
    const draw = (t: number, now: number, lvl: number) => {
      root.current?.style.setProperty("--lvl", lvl.toFixed(3));
      if (dock?.bar.current) dock.bar.current.style.transform = `scaleX(${Math.min(1, t / SONG_LEN).toFixed(4)})`;
      if (dock?.time.current) dock.time.current.textContent = `${clock(t)} / ${clock(SONG_LEN)}`;
      void now;
    };
    if (!running) {
      const t = clk.current.base;
      draw(t, 0, 0.32);
      return;
    }
    clk.current.anchor = performance.now();
    let raf = 0, pulse = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      let t = clk.current.base + (now - clk.current.anchor) / 1000;
      if (t >= LOOP) { clk.current = { base: LOOP_FROM, anchor: now }; t = LOOP_FROM; }
      if (!seen.current) return;
      const f = frameAt(t);
      if (f.idx !== last.current.idx || f.sung !== last.current.sung) {
        if (f.idx > last.current.idx && f.idx >= 0) pulse = 1;
        else if (f.sung > last.current.sung) pulse = Math.max(pulse, 0.55);
        last.current = f;
        setFrame(f);
      }
      pulse *= 0.93;
      draw(t, now, Math.min(1, (0.36 + 0.14 * Math.sin(now / 760)) * 0.82 + pulse * 0.32));
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clk.current = { base: clk.current.base + (performance.now() - clk.current.anchor) / 1000, anchor: 0 };
    };
  }, [running, root, dock]);

  return { ...frame, running, still, toggle: () => setRunning((r) => !r) };
}

const PAUSE_SVG = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="3" height="10" rx="1" fill="currentColor" /><rect x="9" y="3" width="3" height="10" rx="1" fill="currentColor" /></svg>;
const PLAY_SVG = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>;
function PauseButton({ running, still, onToggle, className = "" }: { running: boolean; still: boolean; onToggle: () => void; className?: string }) {
  if (still) return null;
  return (
    <button type="button" className={`ui-pause loop-pause ${className}${running ? "" : " is-paused"}`} aria-label={running ? "Pause animation" : "Play animation"} title={running ? "Pause animation" : "Play animation"} onClick={onToggle}>
      {running ? PAUSE_SVG : PLAY_SVG}
    </button>
  );
}

function NowPlaying() {
  return <div className="chip lp-np"><Cover className="lp-cover--chip" /><span>Night drive · backlit</span></div>;
}

const tint = (c: string[]) => ({ ["--tint" as string]: c[1] ?? c[0] }) as CSSProperties;

// ---------------------------------------------------------------- the hero: the stage, lyrics as bubbles
export function HeroScreen() {
  const root = useRef<HTMLDivElement>(null);
  const s = useSong(11.2, root);
  return (
    <div className="ly-piece lp-hero-screen" data-ui-pause-host>
      <div ref={root} className={`bl-screen lp-stage${s.running ? "" : " is-paused"}`} style={tint(COVER_COLORS)} role="img" aria-label="backlit playing Night drive: the edges of the screen glow rose, amber and teal, the colours of its cover, while each lyric line lands word by word as a chat bubble.">
        <Glow colors={COVER_COLORS} size={14} power={1} />
        <div className="lp-scene" aria-hidden="true">
          <NowPlaying />
          <Lyrics lines={LINES} index={s.idx} sung={s.sung} style="bubbles" />
        </div>
      </div>
      <PauseButton running={s.running} still={s.still} onToggle={s.toggle} className="lp-pause" />
    </div>
  );
}

// ---------------------------------------------------------------- #app: the Lines list beside the stage and its dock
const ICONS: Record<string, string> = {
  lines: "M4 6h12M4 10h12M4 14h8",
  float: "M3 5h10v7H3zM9 9h8v6H9z",
  full: "M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4",
  dial: "M10 3v3M10 14v3M3 10h3M14 10h3M10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
};
const Glyph = ({ d }: { d: string }) => <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

export function AppWindow() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const dock = useRef({ bar, time }).current;
  const s = useSong(24.6, root, dock);
  return (
    <div className="ui app fill lp-app" data-ui-pause-host>
      <div className="app__pane app__pane--list lp-lines" aria-hidden="true">
        <div className="lp-lines__track"><Cover className="lp-cover--row" /><span><b>Night drive</b><span>backlit · 0:40</span></span><em className="lp-tag">Synced lyrics</em></div>
        <p className="lp-lines__head">Tap a line to jump there</p>
        <ol>
          {LINES.map((l, i) => l.text ? <li key={i} className={i === s.idx ? "on" : ""}><span>{clock(l.t)}</span>{l.text}</li> : null)}
        </ol>
      </div>
      <div ref={root} className={`app__pane app__pane--open bl-screen lp-open${s.running ? "" : " is-paused"}`} style={tint(COVER_COLORS)} role="img" aria-label="backlit's window: the lines of Night drive in a list on the left with the current line marked, and on the right the stage glowing in the cover's colours with the line being sung set large, over the player dock with the cover, the time and the sync control.">
        <Glow colors={COVER_COLORS} size={12} power={1} />
        <div className="lp-open__scene" aria-hidden="true">
          <Lyrics lines={LINES} index={s.idx} sung={s.sung} style="big" meta="♪ Night drive · backlit" />
        </div>
        <div className="lp-dock" aria-hidden="true">
          <div className="lp-dock__track"><Cover className="lp-cover--dock" /><span><b>Night drive</b><span>backlit</span></span></div>
          <div className="lp-dock__mid">
            <span className="lp-dock__row"><span className="lp-dock__play">{s.running ? PAUSE_SVG : PLAY_SVG}</span><span ref={time} className="lp-dock__time">{clock(24.6)} / {clock(SONG_LEN)}</span><span className="lp-dock__note">Synced lyrics</span></span>
            <span className="lp-dock__bar"><span ref={bar} className="lp-dock__fill" style={{ transform: `scaleX(${(24.6 / SONG_LEN).toFixed(4)})` }} /></span>
          </div>
          <div className="lp-dock__tools">
            <span className="lp-sync"><i>−</i><span>sync</span><i>+</i></span>
            {Object.values(ICONS).map((d) => <span key={d} className="lp-dock__icon"><Glyph d={d} /></span>)}
          </div>
        </div>
      </div>
      <PauseButton running={s.running} still={s.still} onToggle={s.toggle} className="lp-pause" />
    </div>
  );
}

// ---------------------------------------------------------------- #looks: the Settings sheet over a stage, live swatches
const SWATCHES: [id: string, label: string, colors: string[]][] = [
  ["art", "Album art", COVER_COLORS],
  ["ember", "Ember", PRESETS.ember],
  ["ocean", "Ocean", PRESETS.ocean],
  ["lime", "Lime", PRESETS.lime],
  ["white", "White", PRESETS.white],
];
const SIZES: [label: string, px: number][] = [["Thin", 8], ["Medium", 14], ["Thick", 24]];
const STYLES: [label: string, s: LyricStyle][] = [["Bubbles", "bubbles"], ["One big line", "big"]];
const LOOKS_AT = frameAt(27.2);

export function LooksDemo() {
  const [pal, setPal] = useState("art");
  const [size, setSize] = useState(14);
  const [style, setStyle] = useState<LyricStyle>("bubbles");
  const colors = SWATCHES.find(([id]) => id === pal)?.[2] ?? COVER_COLORS;
  const name = SWATCHES.find(([id]) => id === pal)?.[1] ?? "Album art";
  return (
    <div className="lp-looks">
      <div className="bl-screen lp-stage lp-looks__stage is-still" style={tint(colors)} role="img" aria-label={`backlit's stage with the ${name.toLowerCase()} colours, a ${SIZES.find(([, v]) => v === size)?.[0].toLowerCase()} glow and the lyrics as ${style === "big" ? "one big line" : "bubbles"}.`}>
        <Glow colors={colors} size={size} power={1} />
        <div className="lp-scene" aria-hidden="true">
          <Lyrics lines={LINES} index={LOOKS_AT.idx} sung={Infinity} style={style} meta={style === "big" ? "♪ Night drive · backlit" : undefined} />
        </div>
      </div>
      <div className="lp-sheet" role="group" aria-label="Light and lyrics settings">
        <p className="lp-sheet__title">Light and lyrics</p>
        <p className="lp-sheet__label">Colours</p>
        <div className="lp-swatches">
          {SWATCHES.map(([id, label, c]) => (
            <button key={id} type="button" aria-pressed={pal === id} onClick={() => setPal(id)}>
              <i style={{ background: id === "art" ? COVER_BG : `linear-gradient(135deg, ${c.join(", ")})` }} />{label}
            </button>
          ))}
        </div>
        <p className="lp-sheet__label">Glow size</p>
        <div className="lp-seg">{SIZES.map(([label, v]) => <button key={label} type="button" aria-pressed={size === v} onClick={() => setSize(v)}>{label}</button>)}</div>
        <p className="lp-sheet__label">Lyrics</p>
        <div className="lp-seg">{STYLES.map(([label, v]) => <button key={label} type="button" aria-pressed={style === v} onClick={() => setStyle(v)}>{label}</button>)}</div>
      </div>
    </div>
  );
}
