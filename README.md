# July Anime Corner

A personal anime tracking progressive web app. It pulls anime release data and lets its owner track favorite shows, viewed episodes, and progression through the seasons — independent of whether any third-party tracking app or service stays online.

## What This Project Does

The app surfaces four views — Currently Airing (Schedule), My List, Search, and Calendar — sourced from the Jikan API v4 for anime metadata and (eventually) Supabase for the user's personal, durable watchlist. Adding an anime from Schedule, Search, or Calendar writes it to the same watchlist, which My List reads exclusively (never touching Jikan), so the list stays fast and durable regardless of any third-party API's availability.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (scaffolded via `shadcn/create`, `base-rhea` style preset, theme tokens isolated in `app/globals.css`)
- Jikan API v4 — anime metadata, schedules, search (no API key)
- Supabase (Postgres + Auth) — planned persistence + auth layer, not yet wired in
- Upstash Redis — planned rate-limit counter store, not yet wired in
- Deployment target: Vercel

## Project Structure

- `app/page.tsx` — Schedule (Currently Airing) view, server-fetched from Jikan `/seasons/now`, revalidated hourly
- `app/list/page.tsx` — My List view, favorites filter, progress bars
- `app/search/page.tsx` — Search view, 800ms debounced Jikan `/anime?q=`
- `app/calendar/page.tsx` — Calendar view, Jikan `/schedules` grouped by weekday, revalidated hourly
- `app/robots.ts`, `app/manifest.ts` — crawler-blocking `robots.txt` and PWA manifest
- `components/anime-card.tsx`, `components/watchlist-card.tsx` — shared anime display components
- `components/nav-shell.tsx` — shared layout/navigation shell
- `lib/jikan.ts` — Jikan API fetch helpers
- `lib/watchlist-store.ts` — temporary client-side (localStorage) watchlist store standing in for the Supabase `watchlist` table until auth/backend work lands; shape mirrors `spec/blueprints/data-model.md`

## Setup

No external services are wired in yet — the app runs standalone against Jikan with a local watchlist store. `npm install && npm run dev` is enough to try it. Supabase auth, the allow-list trigger, and Upstash rate limiting from `spec/blueprints/` are deferred to a later implementation run.

---

_Spec version: 2026-07-03_
_Soul version: 2026-07-03_
