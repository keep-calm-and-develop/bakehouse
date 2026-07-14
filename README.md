# Bakehouse — Bitter Sweet Symphony Orders

Employee-facing production queue for **Bitter Sweet Symphony** (page title: *Bitter Sweet Symphony — Orders*). Staff sign in, pick a production day, and see orders assigned to them across four production stages: layering, finishing, fondant work finishing, and decorating.

**Production:** [https://bakehouse-ruby.vercel.app/orders](https://bakehouse-ruby.vercel.app/orders)

## Features

- Employee login with session persistence (`localStorage` key `employeeId`)
- Real-time order board via Firestore `onSnapshot` subscriptions
- Production week picker (Wednesday → Tuesday)
- Orders grouped by production process
- Order detail view with properties, special instructions, reference image, and customer name (when status is advanceable)
- Status advancement via "Mark as completed" → confirmation modal

## Tech Stack

Versions from `package.json`:

| Layer | Choice |
|---|---|
| UI | React 19, TypeScript, Tailwind CSS 4, shadcn theme/CSS (`components.json`, `src/index.css`) |
| Build | Vite 8 |
| Routing | React Router 8 |
| State | Zustand |
| Backend | Firebase Firestore (`firebase` package); Firebase Storage SDK initialized in `src/firebase.ts` |
| Dates | date-fns |
| Icons | lucide-react |
| Deploy | Vercel (`vercel.json` SPA rewrite) |
| Lint | oxlint |

UI is built with custom components under `src/components/` (no `src/components/ui/` shadcn components installed yet).

## Quick Start

### Prerequisites

- pnpm 9+ (pinned in `package.json` as `pnpm@9.15.4`)
- Node.js (no `engines` field in `package.json`)

### Install & run

```bash
pnpm install
# create .env.local with the Firebase variables listed below
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) (Vite default port). Unauthenticated users hitting `/orders` are redirected to `/login` via `ProtectedRoute`.

### Scripts

| Command | Description |
|---|---|
| `pnpm dev` | `vite` — start dev server |
| `pnpm build` | `tsc -b && vite build` — type-check and build |
| `pnpm preview` | `vite preview` — preview production build |
| `pnpm lint` | `oxlint` |

## Environment Variables

Create `.env.local` in the project root (read by `src/firebase.ts` via `import.meta.env`):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

## Routes

Defined in `src/routes.tsx`:

| Path | Guard | Page |
|---|---|---|
| `/` | — | `RootRedirect` → `/orders` if authenticated, else `/login` |
| `*` | — | Same as `/` |
| `/login` | `PublicRoute` (redirects to `/orders` if authenticated) | `LoginPage` |
| `/orders` | `ProtectedRoute` (redirects to `/login` if not authenticated) | `OrdersPage` |

## Project Structure

```
src/
├── components/       # UI + auth route guards
├── constants.ts      # STATUS_OPTIONS, PROCESSES, status mappings
├── constants/auth.ts # AUTH_STORAGE_KEY ("employeeId")
├── firebase.ts       # Firebase app, Firestore, Storage init
├── hooks/
├── lib/              # orders grouping/query, status helpers, Firestore parsers
├── pages/            # LoginPage, OrdersPage
├── routes.tsx
├── services/         # employees.ts, orders.ts
├── stores/           # authStore, ordersStore (Zustand)
└── types/            # order.ts, employee.ts
```

## Deployment

`vercel.json` rewrites all paths to `/` for client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Build output goes to `dist/` (`pnpm build`). Set `VITE_FIREBASE_*` variables in the Vercel project for production.

## AI-Assisted Maintenance

See **[KNOWLEDGE.md](./KNOWLEDGE.md)** for architecture, Firestore schema, status workflow, and file-level change guidance grounded in the source code.
