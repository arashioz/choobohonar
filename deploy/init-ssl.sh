#!/usr/bin/env bash
# Issue the first Let's Encrypt certificate and switch nginx to HTTPS.
# Run on the server from the repository root, after DNS points here:
#
#   ./deploy/init-ssl.sh admin@choobohonar.com
#   SITE_DOMAIN=choobohonar.com COMPOSE_FILE=docker-compose.prod.yml ./deploy/init-ssl.sh admin@choobohonar.com
#
# Renewals are handled afterwards by the long-running `certbot` service.
set -euo pipefail

EMAIL="${1:-}"
DOMAIN="${SITE_DOMAIN:-choobohonar.com}"
WEBROOT=./data/certbot/www
STAGING="${STAGING:-0}"

if [ -z "$EMAIL" ]; then
  echo "usage: $0 <email>   (env: SITE_DOMAIN, COMPOSE_FILE, STAGING=1)" >&2
  exit 1
fi

cd "$(dirname "$0")/.."
mkdir -p "$WEBROOT/.well-known/acme-challenge" ./data/certbot/conf

resolve() { getent ahostsv4 "$1" 2>/dev/null | awk 'NR==1 {print $1}'; }
server_ip="$(curl -4 -fsS --max-time 5 https://api.ipify.org 2>/dev/null || true)"
apex_ip="$(resolve "$DOMAIN")"
www_ip="$(resolve "www.$DOMAIN")"
echo "server IP: ${server_ip:-unknown}"
echo "$DOMAIN -> ${apex_ip:-not resolved}"
echo "www.$DOMAIN -> ${www_ip:-not resolved}"

if [ -z "$apex_ip" ]; then
  echo "DNS for $DOMAIN does not resolve yet; wait for propagation and retry." >&2
  exit 1
fi
if [ -n "$server_ip" ] && [ "$apex_ip" != "$server_ip" ]; then
  echo "warning: $DOMAIN points to $apex_ip, not this server ($server_ip)." >&2
  echo "         Behind a CDN this is expected, but the HTTP-01 challenge must still reach this server." >&2
fi

domains=(-d "$DOMAIN")
if [ -n "$www_ip" ]; then
  domains+=(-d "www.$DOMAIN")
else
  echo "www.$DOMAIN does not resolve; issuing for $DOMAIN only."
fi

docker compose up -d nginx

token="ping-$(date +%s)"
echo "$token" > "$WEBROOT/.well-known/acme-challenge/$token"
if ! curl -fsS --max-time 10 "http://$DOMAIN/.well-known/acme-challenge/$token" | grep -q "$token"; then
  rm -f "$WEBROOT/.well-known/acme-challenge/$token"
  echo "http://$DOMAIN/.well-known/acme-challenge/ is not reachable through nginx (port 80 closed or DNS not here)." >&2
  exit 1
fi
rm -f "$WEBROOT/.well-known/acme-challenge/$token"

staging_flag=()
[ "$STAGING" = "1" ] && staging_flag=(--staging)

docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  "${domains[@]}" \
  --email "$EMAIL" --agree-tos --no-eff-email \
  --keep-until-expiring --non-interactive \
  ${staging_flag[@]+"${staging_flag[@]}"}

docker compose restart nginx
docker compose up -d certbot
docker compose logs --tail=5 nginx | grep select-site || true

cat <<EOF

HTTPS is enabled for https://$DOMAIN
Now set these in the root .env and recreate backend/admin:
  FRONTEND_URL=https://$DOMAIN
  FORCE_HTTPS=true
  docker compose up -d --force-recreate backend admin
EOF
