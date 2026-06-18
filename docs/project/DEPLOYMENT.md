# ResinPulse — Deployment

## Repository

| Alan | Değer |
|------|-------|
| GitHub Owner | gorkemkyolai0666 |
| Repository | escapepulse (geçici — repo yeniden adlandırma izni bekleniyor) |
| Hedef Ad | resinpulse |
| URL | https://github.com/gorkemkyolai0666/escapepulse |

> **Not:** GitHub `create_repository` ve repo yeniden adlandırma API'si bu otomasyon ortamında kullanılamıyor. Proje `fork_repository` ile org altında oluşturuldu. İçerik tamamen ResinPulse olarak dönüştürüldü.

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@iridescentpourstudio.com |
| Şifre | demo123456 |

## Ortam Değişkenleri

### Backend (Railway)

```
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
PORT=4018
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=
```

## Deployment Durumu

| Bileşen | Durum | Not |
|---------|-------|-----|
| GitHub Repo | ✅ Kod push edildi | escapepulse adı altında |
| GitHub Actions CI | ⏳ Bekliyor | push sonrası tetiklenecek |
| Railway Backend | ⏳ Bekliyor | RAILWAY_API_TOKEN org secret gerekli |
| Vercel Frontend | ⏳ Bekliyor | VERCEL_TOKEN org secret gerekli |
| PostgreSQL | ⏳ Bekliyor | Railway provisioning |
| Public Demo URL | ⏳ Bekliyor | Deployment sonrası |

## Eksik Altyapı Yetenekleri

- `create_repository` MCP: Permission Denied
- `gh repo create`: Resource not accessible by integration
- Org düzeyinde `RAILWAY_API_TOKEN`, `VERCEL_TOKEN`: Agent ortamında erişilemez
- `npm run provision`: Yalnızca GitHub Actions CI sırasında org secret'lar ile çalışır

## Smoke Test Gereksinimleri (Deployment Sonrası)

1. `GET /api/health` → HTTP 200
2. Demo hesap girişi
3. Kimlik doğrulamalı dashboard isteği
4. İstasyon CRUD
5. Kalıp siparişi CRUD

## URLs (Deployment Sonrası Güncellenecek)

| Servis | URL |
|--------|-----|
| Frontend | _bekliyor_ |
| Backend | _bekliyor_ |
| Health | _bekliyor_ |
