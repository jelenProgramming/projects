# Invoicer - Web

React + Vite dashboard for the Invoicer API. Sign up, add clients, build
invoices with line items and live totals, set status, and download a PDF.

## Run locally

```bash
npm install
cp .env.example .env       # point VITE_API_URL at your API
npm run dev
```

Make sure the Laravel API is running (see the `invoicer` repo).

## Deploy to Vercel

Push to GitHub, import on Vercel, framework preset **Vite**. Set the env var
`VITE_API_URL` to your deployed Railway API URL (no trailing slash).

## Notes

The auth token is kept in `localStorage`. The PDF download fetches the file
with the auth header attached, then saves it client-side.
