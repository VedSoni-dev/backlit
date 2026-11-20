# backlit (agent notes)

Next.js App Router. Landing at `/` (components/landing), the app at `/app` behind Sign in with publik (components/Backlit.tsx).
The look: components/Stage.tsx (`Glow` = screen-edge light from three blurred, masked conic-gradient rings driven by `--lvl`; `Lyrics` = bubbles or one big line, word by word).
Lyrics + art lookups run in the browser (lib/client.ts): LRCLIB v2 search → /api/get/{id} (word timing from its `lyricsfile` YAML, else LRC, else plain text spread out), iTunes Search for covers (shown with an Apple Music link).
Timing: lib/lrc.ts (pure, tested). Colours: lib/palette.ts (pure, tested). Tests: `npm test` (node --test, runs before `next build`).
The "follow your player" helpers are plain scripts served from public/link (mac.sh: osascript JXA + nc on 127.0.0.1:47817; windows.ps1: Windows media controls + HttpListener on localhost:47817). They answer GET /now with {player,title,artist,album,duration,position,playing,at}.
No AI: `USES_AI = false` in lib/publik.ts. Sign in with publik goes through the builds hub listing (APP_SLUG "deckhand").

## publik API
- Sign in with publik: the publik module's gate wraps /app (`components/PublikGate.tsx`; the words and every publik call are in `lib/publik.ts`); it also sends usage telemetry (app_opened, then active_session every 30 minutes) through `/api/publik/telemetry`
- Key: per-install `pk_` from POST /installs. This app is hosted for many browsers, so each browser gets its own install and its key is sealed into an http-only cookie (`lib/publik.ts`); it never reaches client code
- App token: publik-app-token.txt (public by design, committed) or PUBLIK_APP_TOKEN. Cookie seal: PUBLIK_COOKIE_SECRET (falls back to a hash of the app token)
- Self-test: `npm run build && PUBLIK_SELF_TEST=1 npm run start` prints `publik self-test: ok <slug> <version>` (instrumentation.ts)
- Never print or log a key
- Docs: https://publikhq.com/llms.txt, https://publikhq.com/developers

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
