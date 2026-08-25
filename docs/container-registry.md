# انتشار imageهای production در Registry

فایل `.env.registry.example` را به `.env.registry` کپی کنید و نام Registry و tag انتشار را وارد کنید.

```bash
docker login your-registry-host
docker compose --env-file .env.registry -f docker-compose.prod.yml build
docker compose --env-file .env.registry -f docker-compose.prod.yml push
```

برای اجرای سرور با imageهای Registry (بدون build محلی)، همان فایل env را روی سرور قرار دهید و اجرا کنید:

```bash
docker compose --env-file .env.registry -f docker-compose.prod.yml pull
docker compose --env-file .env.registry -f docker-compose.prod.yml up -d --force-recreate
```

imageهای منتشرشده عبارت‌اند از `backend`، `frontend`، `admin` و `nginx`.
