# GD Productions

Astro website for [garrethdean.com](https://garrethdean.com).

## Pages

- `/` — GD Productions
- `/games` — Cloaked Protocol and Augment Protocol
- `/tools` — Unity tools
- `/company` — About
- `/newsletter` — Newsletter signup

## Development

```powershell
npm install
npm run dev
```

Open `http://localhost:4321`.

## Build

```powershell
npm run build
```

The static site is generated in `dist/`.

## Newsletter

Copy `.env.example` to `.env` and provide the public Supabase URL and publishable key. Newsletter signups are written to `public.newsletter_subscribers`.
