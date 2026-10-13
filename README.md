# Ladakh 2k26 checklist

Shared trip checklist. Static page in `public/`, tiny API in `src/index.js`, ticks stored in Cloudflare D1 (`ladakh-2k26`).

- `GET /api/state` → all ticks
- `POST /api/toggle` `{ id, checked }`

Deploys automatically to Cloudflare Workers on every push to `main` (Workers Builds).
