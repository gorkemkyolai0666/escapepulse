# ResinPulse — Veritabanı (DATABASE)

## PostgreSQL

Connection: `DATABASE_URL` environment variable

## Modeller

| Model | Tablo | Açıklama |
|-------|-------|----------|
| ResinStudio | resin_studios | Tenis tesisi profili |
| User | users | Kullanıcı hesapları |
| Court | courts | Kort envanteri |
| PourBatch | pour_batches | Ders gelir kayıtları |
| EquipmentRepair | equipment_repair | Top makinesi bakım |
| CuringChecklist | curing_checklists | Kort bakım planı |
| MoldOrder | mold_orders | Kordon siparişleri |
| WorkshopRate | workshop_rates | Atölye Ücreti kademeleri |

## Migration

```bash
npm run db:migrate   # prisma migrate deploy
npm run db:seed      # prisma db seed
npm run deploy       # migrate + seed + start:prod
```

## Seed Verisi

- 1 tesis: Claywheel Resin Studio (Phoenix, AZ)
- 1 demo kullanıcı: demo@iridescentpourstudio.com
- 8 kort (kalıp, sert, çim, kapalı)
- 2 ders oturumu
- 2 top makinesi bakım kaydı
- 2 kort bakım planı
- 3 fiyat kademesi
- 5 kordon siparişi

Seed idempotent — upsert ile tekrar çalıştırılabilir.
