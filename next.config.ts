import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  turbopack: { root: process.cwd() },
  // lib/publik.ts reads the public publik app token (and the pending marker) from the repo root at run time.
  outputFileTracingIncludes: { "/api/**": ["./publik-app-token.txt", "./publik-pending.txt"] },  // backlit lives on frontend.vedantsoni.com/backlit now (Vedant, 2026-11-20): every old address goes there, the
  // helper scripts to their new copies so a pasted command still works.
  async redirects() {
    return [
      { source: "/link/:file", destination: "https://frontend.vedantsoni.com/backlit/link/:file", permanent: true },
      { source: "/:path*", destination: "https://frontend.vedantsoni.com/backlit", permanent: true },
    ];
  },
};

export default nextConfig;
