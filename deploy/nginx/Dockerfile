FROM docker.arvancloud.ir/nginx:stable-alpine

COPY common.conf app.conf http-only.conf https.conf ssl-params.conf /etc/nginx/site-templates/
COPY 40-select-site.sh /docker-entrypoint.d/40-select-site.sh
RUN chmod +x /docker-entrypoint.d/40-select-site.sh \
  && mkdir -p /var/www/certbot /var/www/legacy

EXPOSE 80 443
