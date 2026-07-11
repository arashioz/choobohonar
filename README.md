# چوب و هنر (Choobohonar)

پلتفرم فروشگاهی و هوشمند «چوب و هنر» — Headless E-commerce + AI Agentic Workflow

## ساختار پروژه

| پوشه | توضیح |
|------|-------|
| `behzad-02/` | فرانت‌اند — Next.js 14 (App Router) + TypeScript + Tailwind + GSAP |
| `api/` | بک‌اند — NestJS + MongoDB + Redis + BullMQ |

## پیش‌نیازها

- Node.js 20+
- Docker (برای MongoDB و Redis)

## اجرای سریع

### فرانت‌اند (با API موک داخلی)

```bash
cd behzad-02
cp .env.local.example .env.local   # در صورت وجود
ulimit -n 10240 && npm install && npm run dev
```

مرورگر: http://localhost:3000

### بک‌اند (NestJS)

```bash
cd api
cp .env.example .env
docker compose up -d
npm install && npm run start:dev
```

API: http://localhost:3001

برای اتصال فرانت به بک‌اند واقعی، در `behzad-02/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## مستندات

- `implementation_planـDraft.md` — معماری و PRD اولیه
- `behzad-02/README.md` — جزئیات فرانت‌اند
