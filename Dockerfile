# Repo-root Dockerfile: builds ONLY the job-tracker Laravel API.
#
# Why it lives at the root: the jobtracker-api-jelen Render service would not let
# its "Root Directory" setting persist through the dashboard, so it builds from
# the repo root with the default Dockerfile path (./Dockerfile). This file copies
# just the jobtracker-api subtree and builds it exactly like the other APIs.
#
# It does not affect any other service:
#  - invoicer-api and linkshort-api on Render have their own Root Directory set,
#    so Render uses their subdir Dockerfiles, not this one.
#  - the Vercel frontends use Vite, not Docker.
#
# If the Render Root Directory field ever starts saving, point jobtracker-api at
# projects/job-tracker/jobtracker-api and delete this file.

FROM php:8.3-cli

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions \
    && install-php-extensions pdo_sqlite mbstring bcmath exif zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY projects/job-tracker/jobtracker-api/ /app/

RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && cp -n .env.example .env \
    && touch database/database.sqlite \
    && mkdir -p storage/framework/views storage/framework/cache/data storage/framework/sessions bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && php artisan key:generate --force

ENV APP_ENV=production
ENV APP_DEBUG=false

EXPOSE 8080
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
