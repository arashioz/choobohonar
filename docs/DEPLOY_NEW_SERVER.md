# اجرای production روی سرور جدید

این پروژه با یک Nginx جلویی و چهار سرویس Docker اجرا می‌شود: `frontend`، `admin`، `backend` و `nginx`؛ MongoDB و Redis هم داخل Compose با volume پایدار هستند.

## ۱) آماده‌سازی Ubuntu

```bash
sudo apt update
sudo apt install -y ca-certificates curl git openssl ufw
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
newgrp docker
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw --force enable
```

در پنل شرکت ارائه‌دهندهٔ سرور هم TCP پورت ۸۰ (و در صورت استفاده از HTTPS، ۴۴۳) را باز کنید. فقط Nginx باید public باشد؛ پورت‌های ۳۰۰۰، ۳۰۰۱ و ۳۰۰۳ را باز نکنید.

## ۲) دریافت کد و ساخت secrets

```bash
git clone https://github.com/arashioz/choobohonar.git
cd choobohonar
cp backend/.env.example backend/.env
openssl rand -hex 32
nano backend/.env
```

در `backend/.env` مقدارهای `ADMIN_PASS` و `JWT_SECRET` را عوض کنید و `FRONTEND_URL` را برابر آدرس واقعی بگذارید؛ برای IP مثلاً `http://NEW_SERVER_IP` و برای دامنه `https://example.com`.

در ریشهٔ پروژه فایل `.env` بسازید تا Compose به IP قبلی وابسته نباشد:

```dotenv
HTTP_PORT=80
FRONTEND_URL=http://NEW_SERVER_IP
```

## ۳) build و اجرا

```bash
docker compose config
docker compose up -d --build
docker compose ps
```

اگر mirror npm موقتاً خطای ۴۰۲ بدهد، Dockerfileها یک retry خودکار با `registry.npmjs.org` دارند. برای build مستقیم با رجیستری دیگر:

```bash
docker compose build --build-arg NPM_REGISTRY=https://registry.npmjs.org
```

## ۴) بررسی سرویس‌ها و seed

```bash
docker compose logs --tail=100 backend
docker compose logs --tail=100 nginx
curl -i http://127.0.0.1/api/admin/health
curl -i http://127.0.0.1/api/public-cms/page
```

پس از بالا آمدن backend، seedهای محصولات، مقالات، پروژه‌ها، صفحات و رسانه‌ها در startup انجام می‌شوند. برای بومی‌سازی URLهای تصویرهای remote (اختیاری و idempotent):

```bash
docker compose exec backend npm run migrate:media -- --dry-run
docker compose exec backend npm run migrate:media
```

## ۵) آدرس‌ها

- سایت: `http://NEW_SERVER_IP/`
- پنل ادمین مستقل: `http://NEW_SERVER_IP/admin`
- ورود پنل: `http://NEW_SERVER_IP/login`

بعد از ورود، مسیر «صفحات سایت» برای ویرایش داده‌های `nav`، `interior` و `contact-forms` در دسترس است. برای به‌روزرسانی deploymentهای بعدی:

```bash
git pull --ff-only
docker compose up -d --build --force-recreate
```

MongoDB در `./data/mongo` و فایل‌های آپلودی در `./backend/uploads` نگه‌داری می‌شوند؛ قبل از جابه‌جایی یا حذف این پوشه‌ها backup بگیرید.
