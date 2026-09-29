#!/bin/sh
# Runs from the official image's /docker-entrypoint.d before nginx starts.
# Renders the site templates for SITE_DOMAIN and picks HTTPS when a
# certificate already exists, otherwise plain HTTP (first boot / no DNS yet).
set -eu

SITE_DOMAIN="${SITE_DOMAIN:-choobohonar.com}"
LEGACY_WP_ORIGIN="${LEGACY_WP_ORIGIN:-}"
TEMPLATES=/etc/nginx/site-templates
OUT=/etc/nginx/site
CERT="/etc/letsencrypt/live/${SITE_DOMAIN}/fullchain.pem"

mkdir -p "$OUT" /var/www/certbot
for file in "$TEMPLATES"/*.conf; do
  sed \
    -e "s|__SITE_DOMAIN__|${SITE_DOMAIN}|g" \
    -e "s|__LEGACY_WP_ORIGIN__|${LEGACY_WP_ORIGIN}|g" \
    "$file" > "$OUT/$(basename "$file")"
done

if [ -s "$CERT" ]; then
  mode=https
else
  mode=http-only
fi

cat "$OUT/common.conf" "$OUT/${mode}.conf" > /etc/nginx/conf.d/default.conf
echo "[select-site] ${SITE_DOMAIN}: ${mode}${LEGACY_WP_ORIGIN:+ (legacy media: ${LEGACY_WP_ORIGIN})}"

# Pick up renewed certificates without restarting the container.
if [ "$mode" = https ]; then
  (while sleep 21600; do nginx -s reload >/dev/null 2>&1 || true; done) &
fi
