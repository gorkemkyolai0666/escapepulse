# EscapePulse

Kaçış odası tesisi operasyon yönetimi B2B SaaS platformu.

**GitHub:** https://github.com/gorkemkyolai06/escapepulse

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@mysterymanorescapes.com |
| Şifre | demo123456 |

## Yerel Geliştirme

```bash
docker compose up postgres -d

cd backend
cp .env.example .env
npm ci
npm run db:migrate && npm run db:seed
npm run start:dev

cd ../frontend
cp .env.example .env.local
npm ci && npm run dev
```

| Servis | Port |
|--------|------|
| Frontend | 3016 |
| Backend | 4016 |
| PostgreSQL | 5456 |

## Modüller

- **Kaçış Odaları** — Oda envanteri ve durum takibi
- **Oyun Oturumları** — Kurumsal, doğum günü ve özel grup gelir kayıtları
- **Bulmaca Bakımı** — Bulmaca ve mekanizma servis iş emirleri
- **Sıfırlama Kontrolü** — Tam sıfırlama, prop kontrolü, ipucu yenileme
- **Prop Siparişleri** — Tedarikçi prop ve ekipman siparişleri
- **Fiyat Kademeleri** — Oda kiralama ve etkinlik paketi fiyatlandırması

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- Backend: NestJS, Prisma, PostgreSQL
- Deploy: Railway (backend), Vercel (frontend)
