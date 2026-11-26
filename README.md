# Doctor Bennani — Frontend

Website, patient portal and admin dashboard for Doctor Bennani, Dentistry & Orthodontics (Casablanca).

React 19 · Vite · Tailwind CSS 4 · TanStack Query · React Router 7 · react-hook-form + zod · i18next (EN / FR / AR with RTL) · Stripe · Recharts.

## Getting started

```bash
cp .env.example .env     # then adjust values
npm install
npm run dev              # http://localhost:5173
```

The Laravel API must be running at `VITE_API_URL` (default `http://127.0.0.1:8000`).

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Laravel API origin (no trailing slash, without `/api`) |
| `VITE_STRIPE_KEY` | Stripe **publishable** key |
| `VITE_SITE_URL` | Public URL of this site |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (route-level code splitting) |
| `npm run test` | Vitest + Testing Library suite |
| `npm run lint` | ESLint |
| `npm run i18n:check` | Verifies every translation key exists in EN, FR and AR |

## Project layout

```
src/
  pages/              Route components (lazy-loaded in App.jsx)
  components/
    ui/               Design-system primitives (Button, Field, Modal, Badge…)
    Home/             Landing page sections
    dashboard/        Shared dashboard shell, tables, charts, profile blocks
    appointments/     Date & time picker (live availability)
    SecondRegister/   Onboarding wizard steps
  hooks/              React Query hooks per domain (auth, account, appointments, catalog, admin)
  lib/                API client, query client, zod schemas, PDF invoice
  i18n/               i18next setup + locales/en.js (source of truth), fr.js, ar.js
  data/clinic.js      Static clinic info + fallbacks until the catalogue API exists
docs/API_SPEC.md      Backend endpoints the frontend expects
```

## Backend contract

New features (availability, cancel/reschedule, reviews, contact messages, notification preferences,
admin stats/calendar/patient file, doctors & services management, webhook-based Stripe checkout) are
built against **[docs/API_SPEC.md](docs/API_SPEC.md)**. Until an endpoint exists the UI degrades
gracefully: catalogue data falls back to `src/data/clinic.js`, and admin pages show a "coming soon" card
naming the missing endpoint.

## Translations

`src/i18n/locales/en.js` is the source of truth. When adding copy, add the key to all three files and run
`npm run i18n:check`. Values saved to the API (onboarding answers, statuses) stay in English and are only
translated for display. Use logical Tailwind utilities (`ps-*`, `ms-*`, `start-*`, `text-start`) so layouts
mirror correctly in Arabic.
