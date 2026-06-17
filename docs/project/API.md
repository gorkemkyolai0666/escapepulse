# EscapePulse — API (API)

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
| GET | /api/game-sessions | Yes | 200 |
| GET | /api/game-sessions/:id | Yes | 200 |
| POST | /api/game-sessions | Yes | 201 |
| PATCH | /api/game-sessions/:id | Yes | 200 |
| DELETE | /api/game-sessions/:id | Yes | 200 |

## Ball Machine Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/puzzle-maintenance | Yes | 200 |
| GET | /api/puzzle-maintenance/urgent | Yes | 200 |
| GET | /api/puzzle-maintenance/:id | Yes | 200 |
| POST | /api/puzzle-maintenance | Yes | 201 |
| PATCH | /api/puzzle-maintenance/:id | Yes | 200 |
| DELETE | /api/puzzle-maintenance/:id | Yes | 200 |

## Court Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/reset-checklists | Yes | 200 |
| GET | /api/reset-checklists/:id | Yes | 200 |
| POST | /api/reset-checklists | Yes | 201 |
| PATCH | /api/reset-checklists/:id | Yes | 200 |
| DELETE | /api/reset-checklists/:id | Yes | 200 |

## Stringing Orders

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/prop-orders | Yes | 200 |
| GET | /api/prop-orders/pending | Yes | 200 |
| GET | /api/prop-orders/:id | Yes | 200 |
| POST | /api/prop-orders | Yes | 201 |
| PATCH | /api/prop-orders/:id | Yes | 200 |
| DELETE | /api/prop-orders/:id | Yes | 200 |

## Rate Tiers

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/rate-tiers | Yes | 200 |
| GET | /api/rate-tiers/:id | Yes | 200 |
| POST | /api/rate-tiers | Yes | 201 |
| PATCH | /api/rate-tiers/:id | Yes | 200 |
| DELETE | /api/rate-tiers/:id | Yes | 200 |

## Dashboard

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/dashboard/stats | Yes | 200 |
