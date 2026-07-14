# Bakehouse — AI Knowledge Base

> Context file for AI coding tools. Every claim below is traceable to source files in this repo.
>
> **App title (index.html):** Bitter Sweet Symphony — Orders
> **Production URL:** https://bakehouse-ruby.vercel.app/orders
> **package.json name:** `bakehouse` (`"private": true`)

---

## 1. What This App Does

Per `LoginPage.tsx`: employees sign in to "view and update your production queue."

After login, `OrdersPage` shows orders **assigned to the logged-in employee** for a **selected day** (`selectedDay` state, default `new Date()`). Orders render in four process sections from `PROCESSES` in `constants.ts`. An employee can open an order (`OrderDetailsModal`), then advance its status (`StatusChangeModal` → `advanceOrderStatus`). The board updates in real time via Firestore `onSnapshot` in `subscribeToDayOrders` (`src/lib/orders.ts`).

---

## 2. Architecture Overview

```
main.tsx
  └─ BrowserRouter
       └─ App.tsx
            └─ AuthBootstrap          # restoreSession() on mount
                 └─ AppRoutes (routes.tsx)
                      ├─ PublicRoute → /login
                      ├─ ProtectedRoute → /orders
                      └─ RootRedirect → / and *

OrdersPage
  ├─ useOrdersSubscription            # Firestore listener
  └─ OrdersBoard
       ├─ OrderCard
       ├─ OrderDetailsModal
       └─ StatusChangeModal

Firebase (src/firebase.ts)
  ├─ Firestore — used by employees.ts, orders.ts, lib/orders.ts
  └─ Storage — initialized and exported; not imported elsewhere in src/
```

**State:** Two Zustand stores (`authStore`, `ordersStore`). No React Query, Redux, or React Context for app state.

**Path alias:** `@/` → `src/` in `vite.config.ts` and `tsconfig.app.json`.

---

## 3. Authentication

**Custom auth via Firestore — not Firebase Auth.** No `firebase/auth` imports in the codebase.

### Flow (from source)

1. `LoginPage` → `authenticateEmployee(email, password)` (`src/services/employees.ts`)
2. Queries `employees` collection: `where("email", "==", email.trim())`, `limit(1)`
3. Compares `record.password !== password` (plain string equality)
4. Requires `record.role?.toLowerCase() === "employee"` (both login and session restore)
5. `signIn(employee)` → `localStorage.setItem("employeeId", employee.id)` (`AUTH_STORAGE_KEY` in `constants/auth.ts`)
6. `AuthBootstrap` → `restoreSession()` → `getEmployeeById(employeeId)` on mount

### Route guards

| Component | File | Behavior |
|---|---|---|
| `ProtectedRoute` | `ProtectedRoute.tsx` | `<Navigate to="/login">` if `employee === null` |
| `PublicRoute` | `PublicRoute.tsx` | `<Navigate to="/orders">` if authenticated |
| `RootRedirect` | `RootRedirect.tsx` | `/orders` or `/login` based on auth |

### Security facts (no design intent claimed)

- Passwords are stored in Firestore and compared in plaintext (`employees.ts` lines 57–58).
- `toEmployee()` strips `password` before returning data to the client.
- Session is only an employee document ID in `localStorage`.

---

## 4. Firestore Data Model

### Collection: `employees` (`EMPLOYEES_COLLECTION` in `employees.ts`)

```ts
// src/types/employee.ts
interface Employee {
  id: string;
  email?: string;
  role?: string;
  name?: string;
}

interface EmployeeRecord extends Employee {
  password?: string;
}
```

### Collection: `orders` (hardcoded `"orders"` in `lib/orders.ts`, `services/orders.ts`)

```ts
// src/types/order.ts — all fields optional except id
interface Order {
  id: string;
  status?: string;
  orderNo?: string;
  productType?: string;
  deliveryDate?: number;
  deliveryType?: string;
  specialInstructions?: string;
  imageUrl?: string;
  properties?: OrderProperty[];
  customer?: { name?: string };
  layering?: { label?: string; value?: string };
  finishing?: { label?: string; value?: string };
  decorating?: { label?: string; value?: string };
  fondantFinishing?: { label?: string; value?: string };
}

interface OrderProperty {
  cake?: string;
  filling?: string;
  frosting?: string;
}
```

**Process assignment** (`groupOrdersByProcess` in `lib/orders.ts`):

```ts
if (order[process]?.value === employeeId) {
  grouped[process].push(order);
}
```

**Status update** (`advanceOrderStatus` in `services/orders.ts`) writes:

- `status` — from `getNextStatus(currentStatus)`
- `updatedBy` — `currentEmployee?.email` (from `StatusChangeModal`) or `null`
- `updatedOn` — `Timestamp.now()`

---

## 5. Production Processes & Status Workflow

### Processes (`PROCESSES` + `PROCESSES_STATUS_MAP` in `constants.ts`)

| Process key | Column label | Active when `order.status` equals |
|---|---|---|
| `layering` | Layering | `PENDING` |
| `finishing` | Finishing | `LAYERED` |
| `fondantFinishing` | Fondant Work Finishing | `FINISHED` |
| `decorating` | Decorating | `FONDANT_FINISHED` |

**Assigned vs active** (`OrdersBoard.tsx`):

- **Assigned count:** `processOrders.length` (all orders in that process for this employee)
- **Active cards:** `getActiveOrdersForProcess(processOrders, PROCESSES_STATUS_MAP[process])` — filters to matching status

### Status progression (`NEXT_STATUS_MAPPING` in `constants.ts`)

```
PENDING → LAYERED → FINISHED → FONDANT_FINISHED → DECORATED → UNAPPROVED
```

- `canAdvanceStatus()` (`lib/status.ts`): `status in NEXT_STATUS_MAPPING`
- `OrderDetailsModal` shows "Mark as completed" only when `isInEmployeesHand` (= `canAdvanceStatus(order.status)`)
- `StatusChangeModal` calls `advanceOrderStatus()` on confirm

### Excluded statuses (`EXCLUDED_ORDER_STATUSES` in `lib/orders.ts`)

Skipped in `groupOrdersByProcess`: `CANCELLED`, `READY`, `COMPLETED`.

### Status display

- `StatusBadge.tsx` uses a local `STATUS_STYLES` map + `formatStatusLabel()` from `lib/status.ts`
- `STATUS_OPTIONS` in `constants.ts` defines labels/values but is **not imported anywhere else in `src/`** as of this writing

---

## 6. Orders Query & Real-Time Subscription

### Day filter (`buildDayOrdersQuery` in `lib/orders.ts`)

```ts
const { start, end } = getDayBounds(day); // startOfDay / endOfDay from date-fns

query(
  collection(firestore, "orders"),
  where("deliveryDate", ">=", start),
  where("deliveryDate", "<", end),
  orderBy("deliveryDate", "asc"),
);
```

`deliveryDate` is compared as millisecond timestamps (`number` on `Order` type).

### Subscription (`useOrdersSubscription.ts`)

- Re-subscribes when `employeeId`, `dayKey` (`startOfDay(selectedDay).getTime()`), or `selectedDay` changes
- Cleans up prior listener in effect cleanup
- On data: `setOrders(grouped)`; on error: sets message `"Unable to load orders. Please try again."`

### Production week (`WeekBar.tsx`)

`getProductionWeekDays(new Date())` is called inside `useMemo(..., [])` — computed **once on mount**:

1. Find Wednesday: `isWednesday(anchor) ? anchor : previousWednesday(anchor)`
2. Append `addDays(wednesday, 1..5)` → Thu, Fri, Sat, Sun, Mon
3. Append `isTuesday(anchor) ? anchor : nextTuesday(anchor)`

Result: 7 buttons, Wednesday through Tuesday. Selecting a day calls `onChange(date)` → updates `selectedDay` in `OrdersPage`.

---

## 7. Key Files — When to Edit What

| Task | Files |
|---|---|
| Add/change production stage | `constants.ts`, `types/order.ts` |
| Change order visibility/filtering | `lib/orders.ts` |
| Change status advance rules | `constants.ts` (`NEXT_STATUS_MAPPING`), `lib/status.ts`, `services/orders.ts` |
| Change login/session | `services/employees.ts`, `stores/authStore.ts`, `constants/auth.ts` |
| Change day query | `lib/orders.ts` (`buildDayOrdersQuery`, `getDayBounds`) |
| Add route/page | `routes.tsx`, `pages/` |
| UI | `components/` |
| Firebase init | `firebase.ts`, `.env.local` |

---

## 8. Component Tree

```
OrdersPage
├── header (employee name, selected day, sign out)
├── WeekBar
└── OrdersBoard
    ├── [per process] OrderCard × active orders
    ├── OrderDetailsModal
    │   ├── PropertiesTable
    │   └── OrderImage (+ full-screen overlay)
    └── StatusChangeModal (only if canAdvanceStatus)
```

**Modal behavior:**

| Component | `useBodyScrollLock` | `useEscapeKey` | Backdrop click closes |
|---|---|---|---|
| `OrderDetailsModal` | yes | yes | yes |
| `StatusChangeModal` | yes | yes, disabled while `updating` | yes, disabled while `updating` |
| `OrderImage` overlay | yes | yes | yes |

---

## 9. Conventions (from config files)

### TypeScript (`tsconfig.app.json`)

- `verbatimModuleSyntax: true`
- `noUnusedLocals: true`, `noUnusedParameters: true`
- `erasableSyntaxOnly: true`
- `noEmit: true`

### Styling

- Tailwind CSS 4 via `@tailwindcss/vite` (`vite.config.ts`)
- `cn()` in `lib/utils.ts` (clsx + tailwind-merge)
- Theme CSS variables in `src/index.css` (e.g. `--background`, `--primary`, `--muted`, `--destructive`)
- shadcn: `components.json` present; `@import "shadcn/tailwind.css"` in `index.css`; no files under `src/components/ui/`

### Linting

- `pnpm lint` runs `oxlint` (`.oxlintrc.json` exists)
- No test files or test script in `package.json`

---

## 10. Common Change Scenarios

### Add a production process

1. Add to `PROCESSES` and `PROCESSES_STATUS_MAP` in `constants.ts`
2. If it advances status, extend `NEXT_STATUS_MAPPING`
3. Add matching optional field on `Order` in `types/order.ts`
4. `PROCESS_KEYS` in `lib/orders.ts` is derived from `PROCESSES` — grouping picks up new processes automatically

### Change production week days

Edit `getProductionWeekDays()` in `WeekBar.tsx`.

### Add a route

Add page in `pages/`, register in `routes.tsx` under `ProtectedRoute` or `PublicRoute`.

---

## 11. Deployment

| Item | Source |
|---|---|
| Platform | `vercel.json` present; production URL uses `*.vercel.app` |
| Build command | `pnpm build` → `tsc -b && vite build` |
| Output | `dist/` |
| SPA routing | `vercel.json` rewrite `/(.*)` → `/` |
| Env vars | `VITE_FIREBASE_*` in `firebase.ts` |

---

## 12. Gotchas (observed from code)

1. **Plaintext passwords** in Firestore `employees` documents.
2. **Assigned ≠ active:** header shows both counts; only active-status orders render as cards.
3. **WeekBar frozen at mount:** `useMemo(..., [])` — week days do not recompute if the app stays open across a week boundary.
4. **Range + orderBy query:** `deliveryDate` filter with `orderBy("deliveryDate")` may require a Firestore composite index (Firebase typically surfaces a console link on failure).
5. **`imageUrl`:** used directly as `<img src={order.imageUrl}>` in `OrderImage.tsx`; no Storage SDK fetch in app code.
6. **Sign out clears orders:** `authStore.signOut()` calls `useOrdersStore.getState().resetOrders()`.
7. **Customer name:** `OrderDetailsModal` renders `order.customer?.name` only when `isInEmployeesHand` is true; not shown on `OrderCard`.
8. **Status advance is two steps:** `OrderDetailsModal` "Mark as completed" → `StatusChangeModal` confirmation.
9. **`STATUS_OPTIONS` unused:** defined in `constants.ts` but not referenced by components; `StatusBadge` has its own `STATUS_STYLES`.

---

## 13. Environment Variables

All consumed in `src/firebase.ts`:

| Variable | Maps to |
|---|---|
| `VITE_FIREBASE_API_KEY` | `firebaseConfig.apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `firebaseConfig.authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `firebaseConfig.projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `firebaseConfig.storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `firebaseConfig.messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `firebaseConfig.appId` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `firebaseConfig.measurementId` |

Local values live in `.env.local` (gitignored). Do not commit secrets.

---

## 14. File Index

All `.ts`/`.tsx` files under `src/`:

```
src/
├── App.tsx
├── main.tsx
├── routes.tsx
├── firebase.ts
├── constants.ts
├── constants/auth.ts
├── index.css
├── types/order.ts
├── types/employee.ts
├── stores/authStore.ts
├── stores/ordersStore.ts
├── services/employees.ts
├── services/orders.ts
├── lib/orders.ts
├── lib/status.ts
├── lib/firestore.ts
├── lib/utils.ts
├── hooks/useOrdersSubscription.ts
├── hooks/useEscapeKey.ts
├── hooks/useBodyScrollLock.ts
├── pages/LoginPage.tsx
├── pages/OrdersPage.tsx
├── components/OrdersBoard.tsx
├── components/OrderCard.tsx
├── components/OrderDetailsModal.tsx
├── components/StatusChangeModal.tsx
├── components/StatusBadge.tsx
├── components/OrderImage.tsx
├── components/PropertiesTable.tsx
├── components/WeekBar.tsx
└── components/auth/
    ├── AuthBootstrap.tsx
    ├── ProtectedRoute.tsx
    ├── PublicRoute.tsx
    └── RootRedirect.tsx
```

---

*Update this file when architecture, data model, or business rules change in source.*
