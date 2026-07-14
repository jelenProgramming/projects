# Tracklr - API

A job application tracker. Each user records the companies they're applying to,
the roles, and moves each application through a pipeline (wishlist → applied →
interview → offer → rejected / accepted). Every status change is logged to a
per-application timeline. Built with Laravel + Sanctum.

## What it shows

- Token auth with Laravel Sanctum (register / login / logout / me)
- Two relations: Company → Applications, Application → ApplicationEvents (timeline)
- Filtering and search on the index endpoint (status, company, free text)
- A status-change action that automatically writes a timeline event
- A funnel stats endpoint (count per status)
- Per-user authorization throughout (403 on anything that isn't yours)

## Endpoints

Public: `POST /api/register`, `POST /api/login`

Authenticated (`Authorization: Bearer <token>`):

| Method | Path                                  | Purpose                              |
|--------|---------------------------------------|--------------------------------------|
| GET    | `/api/me`                             | Current user                         |
| POST   | `/api/logout`                         | Revoke token                         |
| GET    | `/api/stats`                          | Counts per status (funnel)           |
| GET    | `/api/companies`                      | List companies                       |
| POST   | `/api/companies`                      | Create company                       |
| PUT    | `/api/companies/{id}`                 | Update company                       |
| DELETE | `/api/companies/{id}`                 | Delete company                       |
| GET    | `/api/applications`                   | List + filter (`?status=`, `?company_id=`, `?search=`) |
| POST   | `/api/applications`                   | Create application                   |
| GET    | `/api/applications/{id}`              | One application + timeline           |
| PUT    | `/api/applications/{id}`              | Update application                   |
| PATCH  | `/api/applications/{id}/status`       | Change status (logs a timeline event)|
| POST   | `/api/applications/{id}/events`       | Add a timeline note                  |
| DELETE | `/api/applications/{id}`              | Delete application                   |

## Run locally

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve            # http://127.0.0.1:8000
```

## Deploy to Railway

Push to its own GitHub repo, deploy on Railway (uses `nixpacks.toml`). Set
`APP_KEY` (`php artisan key:generate --show`), `APP_ENV=production`,
`APP_DEBUG=false`. Add a Railway Postgres for persistent data. Then point the
frontend's `VITE_API_URL` at the Railway URL.
