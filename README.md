# אידה — מכון לקוסמטיקה מתקדמת

Mobile-first, RTL Hebrew website for **Eida — Institute for Advanced Cosmetics**, Kfar Saba. Built with vanilla HTML/CSS/JS — no build step.

## ⚠️ Placeholders to fill in before going live

These values are clearly marked with `TODO` HTML comments. Search the codebase and replace them with real data:

| Placeholder | Where it appears | Files |
|---|---|---|
| `+972500000000` / `972500000000` / `050-000-0000` | Phone, WhatsApp links | `index.html`, `script.js` |
| `כפר סבא` (no street) | Address (no street number yet) | `index.html` |
| `#` (Facebook + Instagram links) | Footer socials | `index.html` |
| Testimonials (3 quotes) | Replace with real customer testimonials | `index.html` |
| `https://eida-cosmetics.co.il/` | Canonical URL, OG URL, sitemap | `index.html`, `sitemap.xml` |
| Google Maps query | Map link | `index.html` |

Quick find: `grep -n "TODO" index.html`

## What's inside

- **`index.html`** — full single-page site (Hero · About · Services · Process · Why us · Gallery · Testimonials · CTA · Contact · Footer)
- **`styles.css`** — design system + all sections (champagne / mahogany / gold leaf palette)
- **`script.js`** — scroll reveals, 3D card tilt, parallax, mobile nav, smooth scroll, contact form → WhatsApp
- **`favicon.svg`**, **`og-image.svg`** — branded SVG assets
- **`robots.txt`**, **`sitemap.xml`** — SEO

## Features

- 🇮🇱 Hebrew, RTL throughout — Frank Ruhl Libre (display) + Heebo (body)
- 📱 Mobile-first responsive (works from 320px up)
- ♿ Accessibility: skip link, ARIA, focus rings, `prefers-reduced-motion`
- 🎨 Refined editorial-luxe design with grain, ambient orbs, 3D hero card, marquee, parallax
- 🔍 SEO: meta tags, Open Graph, Schema.org `BeautySalon` JSON-LD, sitemap
- 💬 Floating WhatsApp button + form-to-WhatsApp handoff
- 📞 Click-to-call, Google Maps deep link, social links

## Run locally

```bash
python -m http.server 8000
# open http://localhost:8000
```
