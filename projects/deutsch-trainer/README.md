# Konjugator - German Verb Trainer

A focused drill for the German present tense (Präsens). You're shown a pronoun
and a verb, you type the conjugated form, and it checks you instantly. Tracks
your streak, best streak, and accuracy. Best streak persists in your browser.

Filter by verb type: irregular, modal, or regular. Umlauts are optional -
typing `ae`, `oe`, `ue`, or `ss` is accepted.

Built with React + Vite. No API, no keys, no backend.

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

Push to GitHub, import on Vercel, framework preset **Vite**. No env variables.

## Adding verbs

All data lives in `src/verbs.js`. Each verb has its six present-tense forms in
the order: ich, du, er/sie/es, wir, ihr, sie/Sie.
