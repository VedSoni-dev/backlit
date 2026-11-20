"use client";
// The public front door at /. Built with the taste skill's kit (public/assets, loaded only here) and the client's own
// colours and faces; the plan is .taste-skill/plan.md.
// type: software (site-kind software)
// deal: hero centred, nav nav-centre (dealt nav-cards needs photographs backlit does not have; re-dealt nav-split|nav-centre),
//       close close-type, footer footer-statement, rhythm dark-band (#looks on .ground-inverse), buttons pill,
//       backlit's own mark (public/icon.svg), lit ground sand, radius round (a consumer app),
//       palette: the app's own colours (start.mjs brand: #050506 / #f3efe9), type geist (the app's Geist + Geist Mono),
//       no effect (the product's own glow is the one moving light)
// moments: line-carries-colour in #looks
// This component holds no state, so React never redraws the static markup the kit's scripts work on.
// The live parts (components/landing/Live.tsx) keep their own state.
import { useEffect } from "react";
import { PublikPitch } from "@/components/PublikGate";
import { AppWindow, HeroScreen, LooksDemo } from "./Live";
import { FileFragment, FollowFragment, GateFragment, Platforms, SearchFragment } from "./Pieces";

const REPO = "https://github.com/VedSoni-dev/backlit";
const SIGN_IN = "Sign in free with publik";
const KIT_CSS = ["system.css", "ui/cards.css", "ui/base.css", "motion/motion.css", "layout/layout.css", "icons/icon.css", "diagrams/diagram.css"];
const KIT_JS = ["system.js", "motion/motion.js", "layout/layout.js", "diagrams/mount.js"];
const HTML_ATTRS = `(function(){var d=document.documentElement;d.setAttribute('data-type','software');d.setAttribute('data-radius','round');d.setAttribute('data-ground','sand');d.setAttribute('data-buttons','pill');d.setAttribute('data-motion','');d.classList.add('m-enter','mo-js');setTimeout(function(){d.classList.add('m-enter-done')},700);setTimeout(function(){d.classList.add('mo-safe')},2500)})();`;

const DIAGRAM = JSON.stringify({
  layout: "lanes",
  alt: "A song goes into backlit in your browser, which takes its lyrics from LRCLIB, its colours from the cover and its timing from your file, your player or your tap, and lights the screen.",
  curve: "curve",
  input: { label: "Your song", icon: "ui:music" },
  core: { label: "backlit", icon: "ui:monitor" },
  lanes: [
    { label: "LRCLIB lyrics", icon: "ui:captions" },
    { label: "Cover colours", icon: "ui:palette" },
    { label: "Your timing", icon: "ui:timer" },
  ],
  output: { label: "Glow and lyrics", icon: "ui:sparkles", done: true },
  motion: { pulse: "none" },
  size: [560, 440],
});

const ARROW = (
  <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path className="m-arrow__stem" d="M1 6h8" /><path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" /></svg>
);
// eslint-disable-next-line @next/next/no-img-element
const Mark = () => <img className="lp-mark" src="/icon.svg" alt="" width="26" height="26" />;

export function Landing() {
  useEffect(() => {
    for (const f of KIT_JS) {
      const src = `/assets/${f}`;
      if (document.querySelector(`script[src="${src}"]`)) continue;
      const s = document.createElement("script");
      s.type = "module";
      s.src = src;
      document.body.append(s);
    }
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: HTML_ATTRS }} />
      {KIT_CSS.map((f) => (
        <link key={f} rel="stylesheet" href={`/assets/${f}`} precedence="taste-kit" />
      ))}
      <link rel="stylesheet" href="/assets/landing.css" precedence="taste-page" />

      <header className="nav nav--centre">
        <div className="wrap nav__bar">
          <a className="skip-link" href="#top">Skip to content</a>
          <a className="nav__logo" href="#top"><Mark />backlit</a>
          <nav className="nav__links" aria-label="Main">
            <div className="nav__item"><a className="nav__link" href="#app">Setup</a></div>
            <div className="nav__item"><a className="nav__link" href="#ways">Sync</a></div>
            <div className="nav__item"><a className="nav__link" href="#compare">Price</a></div>
            <div className="nav__item"><a className="nav__link" href="#questions">Questions</a></div>
          </nav>
          <div className="nav__actions">
            <a className="btn btn--primary" href="/app">{SIGN_IN}</a>
          </div>
          <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </header>

      <main id="top">
        {/* HERO: centred. The pill, the h1, the lead and the two buttons; backlit's stage rising out of the lit sand frame. */}
        <section className="hero hero--centred" data-enter aria-labelledby="hero-h">
          <div className="wrap"><div className="hero-text">
            <div className="hero__c">
              <a className="pill" href="#compare"><span>Free and open source</span><span className="muted">Verci + Lumn cost $22.98</span></a>
              <h1 id="hero-h">Synced lyrics and screen-edge glow</h1>
              <p className="hero__lead">Play a song and your screen&apos;s edges glow in its cover&apos;s colours as the lyrics land word by word.</p>
              <div className="btn-row">
                <a className="btn btn--primary" href="/app">{SIGN_IN}{ARROW}</a>
              </div>
            </div>
            <div className="hero__window">
              <HeroScreen />
            </div>
          </div></div>
        </section>

        {/* APP: app-frame. The Lines list beside the open stage, one window across the wrap. */}
        <section className="section" id="app" aria-labelledby="app-h">
          <div className="wrap">
            <div className="grid grid--top">
              <h2 id="app-h" className="span-5">The lyrics and the glow in one browser tab</h2>
              <p className="span-6 start-7 muted lp-app__p">Press F for full screen and switch the lamp off. Every line sits in the list with its time, and the dock keeps the song&apos;s place. <a className="link" href="#ways">See the three ways to sync</a></p>
            </div>
            <AppWindow />
          </div>
        </section>

        {/* WAYS: three cards, one per way backlit knows the song; backlit's own picker on each lit panel. */}
        <section className="section" id="ways" aria-labelledby="ways-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="ways-h">Three ways the lyrics stay in sync</h2>
            </div>
            <div className="grid lp-ways">
              <article className="card card--row span-4 m-nolift">
                <h3>Search the song, then hit Start</h3>
                <p>Press Start when the song starts in Spotify, Apple Music or YouTube, or tap the line you hear.</p>
                <div className="panel"><div className="stage"><div className="at-rise fit lp-fit"><SearchFragment /></div></div></div>
              </article>
              <article className="card card--row span-4 m-nolift">
                <h3>Play a song file from your computer</h3>
                <p>MP3, M4A, FLAC, WAV or OGG, timed exactly. The light moves with the bass, and nothing is uploaded.</p>
                <div className="panel"><div className="stage"><div className="at-rise fit lp-fit"><FileFragment /></div></div></div>
              </article>
              <article className="card card--row span-4 m-nolift">
                <h3>Follow Spotify or Apple Music</h3>
                <p>One command on a Mac or Windows PC starts a helper that answers only on localhost.</p>
                <div className="panel"><div className="stage"><div className="at-rise fit lp-fit"><FollowFragment /></div></div></div>
              </article>
            </div>
          </div>
        </section>

        {/* COMPARE: comparison-table. The paid pair against backlit, row by row. */}
        <section className="section" id="compare" aria-labelledby="compare-h">
          <div className="wrap">
            <div className="grid grid--top">
              <h2 id="compare-h" className="span-5">The $22.98 setup, free in your browser</h2>
              <p className="span-6 start-7 t-lead muted">The dark-room setup from the reel takes two paid apps. backlit does both jobs in one tab.</p>
            </div>
            <div className="lp-table" role="table" aria-label="Verci, Lumn and backlit compared">
              <div className="grid lp-table__row lp-table__head" role="row">
                <span className="span-6 lp-table__name" role="columnheader">The apps</span>
                <span className="span-2" role="columnheader">Verci</span>
                <span className="span-2" role="columnheader">Lumn</span>
                <span className="span-2 lp-us" role="columnheader"><Mark />backlit</span>
              </div>
              <div className="grid lp-table__row" role="row">
                <span className="span-6 lp-table__name" role="rowheader">What it does</span>
                <span className="span-2" role="cell">Word-by-word lyric bubbles</span>
                <span className="span-2" role="cell">Light around the screen&apos;s edges</span>
                <span className="span-2" role="cell">Both, in one browser tab</span>
              </div>
              <div className="grid lp-table__row" role="row">
                <span className="span-6 lp-table__name" role="rowheader">Runs on</span>
                <span className="span-2" role="cell"><Platforms ids={["apple"]} />Mac, macOS 15 or later</span>
                <span className="span-2" role="cell"><Platforms ids={["apple", "windows"]} />Mac with Apple silicon, Windows</span>
                <span className="span-2" role="cell"><Platforms ids={["apple", "windows", "linux-tux", "chrome"]} />Mac, Windows, Linux, Chromebook</span>
              </div>
              <div className="grid lp-table__row" role="row">
                <span className="span-6 lp-table__name" role="rowheader">Price</span>
                <span className="span-2 lp-price" role="cell">$12.99</span>
                <span className="span-2 lp-price" role="cell">$9.99</span>
                <span className="span-2 lp-price" role="cell">Free</span>
              </div>
              <div className="grid lp-table__row" role="row">
                <span className="span-6 lp-table__name" role="rowheader">The whole setup</span>
                <span className="span-4 lp-price" role="cell">$22.98 for the two apps</span>
                <span className="span-2 lp-price" role="cell">Free, MIT licence</span>
              </div>
            </div>
          </div>
        </section>

        {/* LOOKS: the dark-band (.ground-inverse) with line-carries-colour (references/moments.md). The extras left,
            backlit's Settings sheet over a stage right; its swatches swap the glow on a click. */}
        <section className="section ground-inverse" id="looks" data-moment="line-carries-colour" data-moment-opts='{"from": "base"}' aria-labelledby="looks-h">
          <div className="wrap">
            <div className="grid grid--top">
              <div className="span-5 stack-5">
                <h2 id="looks-h">Settings for the light and the lyrics</h2>
                <p className="t-lead">Take the cover&apos;s colours or a fixed set, a thin edge or a thick one, bubbles or one big line.</p>
                <ul className="rows">
                  <li><span className="rows__name">Full screen</span><p>Press F. The controls hide while the song plays.</p></li>
                  <li><span className="rows__name">Floating lyrics</span><p>A small lyrics window over your other apps, in Chrome or Edge.</p></li>
                  <li><span className="rows__name">Screen awake</span><p>The screen stays on while a song plays.</p></li>
                  <li><span className="rows__name">Sync nudge</span><p>Lyrics early or late? Shift them, and backlit remembers it per song.</p></li>
                </ul>
              </div>
              <div className="frame lp-looks-frame span-6 start-7"><LooksDemo /></div>
            </div>
          </div>
        </section>

        {/* STATUS: what works and what doesn't yet, said plainly; where the song's parts come from as a lanes diagram */}
        <section className="section g2m" id="status" aria-labelledby="status-h">
          <div className="wrap">
            <div className="grid grid--top">
              <div className="span-5 stack-5">
                <h2 id="status-h">Features that work today</h2>
                <div>
                  <p className="t-label lp-list__label">Works</p>
                  <ul className="rows">
                    <li><span className="rows__name">Any player</span><p>Press Start with the song, or tap the line you hear.</p></li>
                    <li><span className="rows__name">Song files</span><p>Timed to the exact moment, the light on the bass.</p></li>
                    <li><span className="rows__name">The helper</span><p>Follows Spotify or Apple Music on a Mac.</p></li>
                  </ul>
                </div>
                <div>
                  <p className="t-label lp-list__label">Not yet</p>
                  <ul className="rows">
                    <li><span className="rows__name">Phones</span><p>The glow stays inside the browser tab.</p></li>
                    <li><span className="rows__name">Windows helper</span><p>Written, but we haven&apos;t tested it ourselves yet.</p></li>
                    <li><span className="rows__name">Editing lyrics</span><p>Not in backlit yet.</p></li>
                  </ul>
                </div>
              </div>
              <div className="panel lp-diagram span-6 start-7">
                <div className="dg" data-diagram><script type="application/json" dangerouslySetInnerHTML={{ __html: DIAGRAM }} /></div>
              </div>
            </div>
          </div>
        </section>

        {/* QUESTIONS: every answer open; the publik pitch beside them */}
        <section className="section g2m" id="questions" aria-labelledby="questions-h">
          <div className="wrap">
            <div className="grid grid--top">
              <div className="span-5 stack-5">
                <h2 id="questions-h">Questions</h2>
                <PublikPitch appName="backlit" className="lp-pitch" />
                <GateFragment />
              </div>
              <div className="faq span-6 start-7">
                <div className="faq__item">
                  <h3>Is backlit made by Verci or Lumn?</h3>
                  <p>No. It&apos;s an independent, open-source app with its own design that does the same job, free, in a browser.</p>
                </div>
                <div className="faq__item">
                  <h3>Does backlit play the music?</h3>
                  <p>Only song files you drop in. With Spotify, Apple Music or YouTube, your player plays and backlit keeps time beside it.</p>
                </div>
                <div className="faq__item">
                  <h3>Where do the lyrics and covers come from?</h3>
                  <p>Lyrics from LRCLIB, a free and open lyrics library, word by word for many songs. Covers from Apple&apos;s iTunes Search.</p>
                </div>
                <div className="faq__item">
                  <h3>What does the helper do on my computer?</h3>
                  <p>It tells this tab what Spotify or Apple Music is playing and where. It answers only on localhost, and you can read it first.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer closing footer--statement g2m" id="contact" aria-labelledby="close-h">
        <div className="wrap">
          <div className="closing__cta close--type">
            <div className="section-head">
              <h2 id="close-h">Turn the lamp off and play a song</h2>
              <p>Free and MIT licensed. Sign in with a free publik account, then pick a song.</p>
            </div>
            <a className="btn btn--primary btn--xl btn--wide" href="/app">{SIGN_IN}{ARROW}</a>
          </div>
          <div className="closing__links">
            <div className="grid">
              <div className="span-8 stack-4">
                <a className="nav__logo" href="#top"><Mark />backlit</a>
                <p className="footer__lede">Screen-edge glow and synced lyrics in a browser tab.</p>
              </div>
              <div className="span-2 footer__col">
                <h3>backlit</h3>
                <ul>
                  <li><a href="#app">Setup</a></li>
                  <li><a href="#ways">Sync</a></li>
                  <li><a href="#looks">Settings</a></li>
                </ul>
              </div>
              <div className="span-2 footer__col">
                <h3>Help</h3>
                <ul>
                  <li><a href="#compare">Price</a></li>
                  <li><a href="#status">What works</a></li>
                  <li><a href="#questions">Questions</a></li>
                </ul>
              </div>
            </div>
            <div className="footer__legal">
              <span>&copy; 2026 backlit · free &amp; open source · not affiliated with Verci or Lumn</span>
              <span><a href={REPO}>source code</a> · <a href="https://x.com/forkthis_ai">Built by @forkthis_ai</a></span>
              <span>Product names and logos are trademarks of their owners.</span>
              <div className="socials" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

