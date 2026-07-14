# Invoicer - API

A multi-user invoicing API for freelancers. Each user signs up, manages their
own clients, builds invoices with line items, and downloads a polished PDF.
Built with Laravel + Sanctum (token auth) + dompdf.

## What it shows

- Token authentication with Laravel Sanctum (register / login / logout / me)
- Per-user authorization: you can only touch your own clients and invoices (403 otherwise)
- Relations: User → Clients → Invoices → InvoiceItems
- Nested writes: an invoice is created with its line items in one request
- Computed money fields (subtotal, tax, total) as model accessors
- Server-side PDF generation from a Blade template
- A dashboard stats endpoint (total invoiced, paid, outstanding)

## Endpoints

Public: `POST /api/register`, `POST /api/login`

Authenticated (`Authorization: Bearer <token>`):

| Method | Path                       | Purpose                         |
|--------|----------------------------|---------------------------------|
| GET    | `/api/me`                  | Current user                    |
| POST   | `/api/logout`              | Revoke current token            |
| GET    | `/api/stats`               | Dashboard totals                |
| GET    | `/api/clients`             | List your clients               |
| POST   | `/api/clients`             | Create a client                 |
| PUT    | `/api/clients/{id}`        | Update a client                 |
| DELETE | `/api/clients/{id}`        | Delete a client                 |
| GET    | `/api/invoices`            | List your invoices              |
| POST   | `/api/invoices`            | Create invoice (with items)     |
| GET    | `/api/invoices/{id}`       | One invoice                     |
| PUT    | `/api/invoices/{id}`       | Update invoice + items          |
| DELETE | `/api/invoices/{id}`       | Delete invoice                  |
| GET    | `/api/invoices/{id}/pdf`   | Download the invoice as a PDF   |

## Run locally

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve            # http://127.0.0.1:8000
```

SQLite by default, so no database setup.

## Deploy to Railway

1. Push this folder to its own GitHub repo.
2. Railway → New Project → Deploy from GitHub repo (it uses `nixpacks.toml`).
3. Set env vars: `APP_KEY` (from `php artisan key:generate --show`),
   `APP_ENV=production`, `APP_DEBUG=false`.
4. For persistent data, add a Railway Postgres and set `DB_CONNECTION=pgsql` + the `DB_*` vars.

Then set the frontend's `VITE_API_URL` to your Railway URL.
