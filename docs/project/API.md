# ResinPulse — API (API)

Base URL: `{NEXT_PUBLIC_API_URL}` (production: Railway backend URL + `/api`)

## Auth

| Method | Endpoint | Auth | Status | Açıklama |
|--------|----------|------|--------|----------|
| POST | /api/auth/login | No | 200 | Giriş |
| POST | /api/auth/register | No | 201 | Kayıt |

## Health

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/health | No | 200 |

## Tennis Club

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/tennis-club | Yes | 200 |
| PATCH | /api/tennis-club | Yes | 200 |

## Courts

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/courts | Yes | 200 |
| GET | /api/courts/:id | Yes | 200 |
| POST | /api/courts | Yes | 201 |
| PATCH | /api/courts/:id | Yes | 200 |
| DELETE | /api/courts/:id | Yes | 200 |

## Lesson Sessions

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/pour-batches | Yes | 200 |
| GET | /api/pour-batches/:id | Yes | 200 |
| POST | /api/pour-batches | Yes | 201 |
| PATCH | /api/pour-batches/:id | Yes | 200 |
| DELETE | /api/pour-batches/:id | Yes | 200 |

## Ball Machine Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/equipment-repairs | Yes | 200 |
| GET | /api/equipment-repairs/urgent | Yes | 200 |
| GET | /api/equipment-repairs/:id | Yes | 200 |
| POST | /api/equipment-repairs | Yes | 201 |
| PATCH | /api/equipment-repairs/:id | Yes | 200 |
| DELETE | /api/equipment-repairs/:id | Yes | 200 |

## Court Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/curing-checklists | Yes | 200 |
| GET | /api/curing-checklists/:id | Yes | 200 |
| POST | /api/curing-checklists | Yes | 201 |
| PATCH | /api/curing-checklists/:id | Yes | 200 |
| DELETE | /api/curing-checklists/:id | Yes | 200 |

## Stringing Orders

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/mold-orders | Yes | 200 |
| GET | /api/mold-orders/pending | Yes | 200 |
| GET | /api/mold-orders/:id | Yes | 200 |
| POST | /api/mold-orders | Yes | 201 |
| PATCH | /api/mold-orders/:id | Yes | 200 |
| DELETE | /api/mold-orders/:id | Yes | 200 |

## Rate Tiers

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/workshop-rates | Yes | 200 |
| GET | /api/workshop-rates/:id | Yes | 200 |
| POST | /api/workshop-rates | Yes | 201 |
| PATCH | /api/workshop-rates/:id | Yes | 200 |
| DELETE | /api/workshop-rates/:id | Yes | 200 |

## Dashboard

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/dashboard/stats | Yes | 200 |
