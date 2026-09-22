# Heckmondwike Travel & Tours

Marketing site for Heckmondwike Travel & Tours — a local travel agency in Heckmondwike, West Yorkshire offering flights, holidays, and Hajj & Umrah packages.

## Stack

- **Astro** — multi-page, mostly static, for SEO and performance
- **Tailwind CSS v4** — navy/teal/white palette in `src/styles/global.css`, matching the brand logo
- **React island** (`src/components/ExchangeRate.tsx`) — live GBP→PKR rate in the hero
- **@astrojs/vercel** adapter — deploys as Vercel serverless functions
- **Resend** — sends contact form enquiries by email

## Key behaviour

- **Exchange rate**: `/api/exchange-rate` refreshes every 3 hours (~240 calls/month against exchangerate-api.com's 1,500/month free cap), cached in memory on the serverless instance so visitor traffic doesn't hit the external API directly. A cold-start cache miss just costs one extra live call — fine at this site's traffic volume, well under the free cap either way. Displayed rate is the live market rate minus 1 PKR (client's requested margin), applied server-side before caching. Falls back to the last known rate if the live fetch fails.
- **Contact form**: posts to `/api/contact` via `fetch`, sent through Resend, inline success/error state, no page reload.
- **Hajj & Umrah**: has its own page (`packages/hajj-umrah.astro`) with separate Umrah/Hajj package tiers, plus a highlight section on the homepage.
- **Nav/branding**: the teal-pill `BrandMark` (navbar + footer) doubles as the home link; clicking it while already on `/` smooth-scrolls to top instead of reloading. A floating scroll-to-top button appears after scrolling.

## Commands

| Command           | Action                                       |
| :----------------- | :-------------------------------------------- |
| `npm install`       | Install dependencies                          |
| `npm run dev`       | Start local dev server at `localhost:4321`    |
| `npm run build`     | Build production site to `./dist/`            |
| `npm run preview`   | Preview the build locally                     |
