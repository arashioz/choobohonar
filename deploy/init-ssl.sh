#!/usr/bin/env bash
# Issue or expand the Let's Encrypt certificate and switch nginx to HTTPS.
# Run on the server from the repository root, after DNS points here:
#
#   ./deploy/init-ssl.sh admin@choobohonar.com
#   SITE_DOMAIN=choobohonar.com COMPOSE_FILE=docker-compose.prod.yml ./deploy/init-ssl.sh admin@choobohonar.com
#
# Covers: choobohonar.com, www.choobohonar.com, admin.choobohonar.com
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
admin_ip="$(resolve "admin.$DOMAIN")"
echo "server IP: ${server_ip:-unknown}"
echo "$DOMAIN -> ${apex_ip:-not resolved}"
echo "www.$DOMAIN -> ${www_ip:-not resolved}"
echo "admin.$DOMAIN -> ${admin_ip:-not resolved}"

if [ -z "$apex_ip" ]; then
  echo "DNS for $DOMAIN does not resolve yet; wait for propagation and retry." >&2
  exit 1
fi
if [ -n "$server_ip" ] && [ "$apex_ip" != "$server_ip" ]; then
  echo "warning: $DOMAIN points to $apex_ip, not this server ($server_ip)." >&2
  echo "         Behind a CDN this is expected, but the HTTP-01 challenge must still reach this server." >&2
fi

docker compose up -d nginx

test_challenge() {
  local host="$1"
  local token="ping-$(date +%s)-$RANDOM"
  echo "$token" > "$WEBROOT/.well-known/acme-challenge/$token"
  local ok=0
  if curl -fsS --max-time 10 "http://$host/.well-known/acme-challenge/$token" 2>/dev/null | grep -q "$token"; then
    ok=1
  fi
  rm -f "$WEBROOT/.well-known/acme-challenge/$token"
  return $((1 - ok))
}

if ! test_challenge "$DOMAIN"; then
  echo "http://$DOMAIN/.well-known/acme-challenge/ is not reachable through nginx (port 80 closed or DNS not here)." >&2
  exit 1
fi

domains=(-d "$DOMAIN")

if [ -n "$www_ip" ]; then
  if test_challenge "www.$DOMAIN"; then
    domains+=(-d "www.$DOMAIN")
  else
    echo "warning: www.$DOMAIN challenge unreachable; skipping www."
  fi
else
  echo "www.$DOMAIN does not resolve; skipping www."
fi

if [ -n "$admin_ip" ]; then
  if test_challenge "admin.$DOMAIN"; then
    domains+=(-d "admin.$DOMAIN")
  else
    echo "warning: admin.$DOMAIN challenge unreachable; skipping admin."
  fi
else
  echo "admin.$DOMAIN does not resolve; make sure DNS A record points here."
fi

staging_flag=()
[ "$STAGING" = "1" ] && staging_flag=(--staging)

echo "Requesting certificate for: ${domains[*]}"
docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  "${domains[@]}" \
  --email "$EMAIL" --agree-tos --no-eff-email \
  --expand --keep-until-expiring --non-interactive \
  ${staging_flag[@]+"${staging_flag[@]}"}

docker compose restart nginx
docker compose up -d certbot
docker compose logs --tail=5 nginx | grep select-site || true

cat <<EOF

HTTPS is enabled for:
  - Storefront: https://$DOMAIN
  - Admin:      https://admin.$DOMAIN

Now ensure these are set in the root .env and recreate backend/admin:
  FRONTEND_URL=https://$DOMAIN,https://admin.$DOMAIN
  FORCE_HTTPS=true

Then run:
  docker compose up -d --force-recreate backend admin
EOF
