FROM docker.arvancloud.ir/nginx:stable-alpine

COPY *.conf /etc/nginx/site-templates/
COPY 40-select-site.sh /docker-entrypoint.d/40-select-site.sh
RUN chmod +x /docker-entrypoint.d/40-select-site.sh \
  && mkdir -p /var/www/certbot /var/www/legacy

EXPOSE 80 443
