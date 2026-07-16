# Stage 1: Build the frontend assets
FROM node:20-alpine AS assets-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: PHP Application Container
FROM serversideup/php:8.3-fpm-nginx-alpine

# Switch to root to install the MongoDB PHP extension
USER root

# Install the MongoDB PHP extension
RUN install-php-extensions mongodb

# Switch back to the standard unprivileged user
USER www-data

# Set working directory
WORKDIR /var/www/html

# Copy project files and ensure correct ownership
COPY --chown=www-data:www-data . .

# Copy the compiled static assets from the frontend builder stage
COPY --from=assets-builder --chown=www-data:www-data /app/public/build ./public/build

# Install PHP dependencies for production
RUN composer install --no-dev --optimize-autoloader

# Production configurations
ENV PHP_OPCACHE_ENABLE=1 \
    AUTORUN_ENABLED=true
