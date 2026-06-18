# ResinPulse — Tasarım Sistemi

## Tasarım Yönü: Futuristic Laboratory Glassmorphism

Epoksi reçine atölyelerinin laboratuvar estetiğini yansıtan, cam efektli ve futuristik bir arayüz.

## Renk Paleti

| Token | Light | Dark | Kullanım |
|-------|-------|------|----------|
| primary | #1A1B4B (indigo) | #00D4FF (cyan) | Başlıklar, vurgu |
| accent | #00D4FF (cyan) | #00D4FF | CTA, aktif nav |
| iris | #7B2D8E (violet) | #9B4DCA | Gradient, ikincil vurgu |
| background | #F8F5FF (pearl) | #0D0E2A | Sayfa zemini |
| card | rgba(255,255,255,0.7) | rgba(26,27,75,0.6) | Glass kartlar |

## Tipografi

- **Display:** Space Grotesk — başlıklar, marka adı
- **Body:** IBM Plex Sans — gövde metni, form etiketleri

## Spacing Scale

4px taban: 4, 8, 12, 16, 24, 32, 48, 64

## Border Radius

- `--radius: 20px` — glass kartlar ve butonlar
- `rounded-2xl` — navigasyon öğeleri

## Navigasyon

Üst cam navigasyon çubuğu (TopGlassNav) — GlazePulse yan rail'den farklı.

## Bileşen Dili

- `glass-card` — backdrop-blur + yarı saydam arka plan
- `resin-btn` — 20px radius butonlar
- Gradient logo ikonu (accent → iris)

## Erişilebilirlik

- WCAG AA kontrast oranları
- `aria-label` tema ve çıkış butonlarında
- `aria-current="page"` aktif nav linklerinde
