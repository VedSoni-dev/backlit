"use client";
// The look: light around the edges of the screen, and the lyrics landing one line at a time.
import type { CSSProperties } from "react";
import type { Line } from "@/lib/lrc";

export type LyricStyle = "bubbles" | "big" | "off";

/** Screen-edge light. Three layers of the same moving gradient: a wide bloom, the glow, a crisp bright edge.
 *  `--lvl` (0..1, set every frame by the player) makes it breathe with the bass. */
export function Glow({ colors, size, power }: { colors: string[]; size: number; power: number }) {
  const c = colors.length ? colors : ["#ff2fb3", "#8f3dff", "#ff5a7a"];
  const stops = [...c, c[0]].join(", ");
  const style = { "--th": `${size}px`, "--pow": power, "--grad": `conic-gradient(from var(--spin), ${stops})` } as CSSProperties;
  return (
    <div className="glow" style={style} aria-hidden="true">
      <div className="glow-layer bloom"><div className="ring" /></div>
      <div className="glow-layer soft"><div className="ring" /></div>
      <div className="glow-layer edge"><div className="ring" /></div>
    </div>
  );
}

/** Lyrics as a stack of bubbles (newest at the bottom, older ones fade up and away), or one big line. */
export function Lyrics({ lines, index, sung = Infinity, style, meta, align = "left" }: { lines: Line[]; index: number; sung?: number; style: LyricStyle; meta?: string; align?: "left" | "center" }) {
  if (style === "off" || !lines.length) return null;
  if (style === "big") {
    const cur = index >= 0 ? lines[index] : null, next = lines[index + 1];
    return (
      <div className={`big ${align}`} aria-live="polite">
        {meta && <div className="chip">{meta}</div>}
        <p key={`c${index}`} className="big-line">
          {!cur ? <span className="soon">{lines.find((l) => l.text)?.text}</span>
            : !cur.text ? <Dots />
            : cur.words?.length ? cur.words.map((w, j) => <span key={j} className={j < sung ? "bw sung" : "bw"}>{w.text}</span>)
            : cur.text}
        </p>
        {cur && next?.text && <p key={`n${index}`} className="big-next">{next.text}</p>}
      </div>
    );
  }
  // the last few lines up to the one being sung; a past instrumental gap leaves no empty bubble behind
  const shown: { l: Line; i: number }[] = [];
  for (let i = index; i >= 0 && shown.length < 6; i--) if (lines[i].text || i === index) shown.unshift({ l: lines[i], i });
  return (
    <div className={`stack ${align}`} aria-live="polite">
      {meta && <div className="chip">{meta}</div>}
      <div className="bubbles">
        {index < 0 && lines[0] && <div className="b-wrap"><div className="bubble waiting"><span>{lines.find((l) => l.text)?.text}</span></div></div>}
        {shown.map(({ l, i }, k) => {
          const age = shown.length - 1 - k;
          return (
            <div key={i} className="b-wrap" data-age={age}>
              <div className={`bubble${age === 0 ? " now" : ""}${i % 4 < 2 ? "" : " alt"}`}>
                {!l.text ? <Dots /> : age === 0 && l.words?.length ? <Words words={l.words} n={sung} /> : <span>{l.text}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The line being sung: words appear as they're sung, the newest one big for a moment. */
function Words({ words, n }: { words: { text: string }[]; n: number }) {
  const k = Math.max(1, Math.min(words.length, n));
  return <span className="words">{words.slice(0, k).map((w, j) => <span key={j} className={j === k - 1 ? "w new" : "w"}>{w.text}</span>)}</span>;
}

function Dots() {
  return <span className="dots" aria-label="instrumental"><i /><i /><i /></span>;
}
