FROM php:8.3-cli

# reliable extension installer: pulls all system deps automatically
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions \
    && install-php-extensions pdo_sqlite mbstring gd zip bcmath exif

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && cp -n .env.example .env \
    && touch database/database.sqlite \
    && php artisan key:generate --force

ENV APP_ENV=production
ENV APP_DEBUG=false

EXPOSE 8080
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
