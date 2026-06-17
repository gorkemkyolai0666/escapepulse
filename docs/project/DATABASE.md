# EscapePulse — Veritabanı (DATABASE)

## PostgreSQL

Connection: `DATABASE_URL` environment variable

## Modeller

| Model | Tablo | Açıklama |
|-------|-------|----------|
| EscapeVenue | escape_venues | Tenis tesisi profili |
| User | users | Kullanıcı hesapları |
| Court | courts | Kort envanteri |
| GameSession | game_sessions | Ders gelir kayıtları |
| PuzzleMaintenance | puzzle_maintenance | Top makinesi bakım |
| ResetChecklist | reset_checklists | Kort bakım planı |
| PropOrder | prop_orders | Kordon siparişleri |
| RateTier | rate_tiers | Fiyat kademeleri |

## Migration

```bash
npm run db:migrate   # prisma migrate deploy
npm run db:seed      # prisma db seed
npm run deploy       # migrate + seed + start:prod
```

## Seed Verisi

- 1 tesis: Mystery Manor Escapes (Phoenix, AZ)
- 1 demo kullanıcı: demo@mysterymanorescapes.com
- 8 kort (kil, sert, çim, kapalı)
- 2 ders oturumu
- 2 top makinesi bakım kaydı
- 2 kort bakım planı
- 3 fiyat kademesi
- 5 kordon siparişi

Seed idempotent — upsert ile tekrar çalıştırılabilir.
