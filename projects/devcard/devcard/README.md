# DevCard

A clean GitHub profile visualizer. Type any username and get an at-a-glance
card: profile, key stats, most-used languages, and most-starred repositories.

Built with React + Vite. Data comes from the public GitHub REST API, so there
are no API keys to configure.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Push this repo to GitHub, then import it on Vercel. Framework preset: **Vite**.
No environment variables needed.

## Notes

The GitHub API allows ~60 unauthenticated requests per hour per IP, which is
plenty for a demo. Each profile lookup makes two requests.
