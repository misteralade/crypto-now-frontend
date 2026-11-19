# CryptoNow Frontend

CryptoNow is a customer-facing web application and Progressive Web App (PWA) for trading cryptocurrency and Nigerian Naira (NGN). It supports guest trading, registered user trading, custodial deposit address management, order status tracking, and dispute management.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/) with SWC
- **Routing**: [TanStack Router](https://tanstack.com/router) with type-safe file-based route tree generation (`src/routeTree.gen.ts`)
- **Server State & Caching**: [TanStack React Query](https://tanstack.com/query) for asynchronous requests, caching, and polling
- **Client State**: [Redux Toolkit](https://redux-toolkit.js.org/) + [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Forms & Validation**: [Formik](https://formik.org/) + [Zod](https://zod.dev/) with `zod-formik-adapter`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components & Icons**: [Lucide React](https://lucide.dev/), [Phosphor Icons](https://phosphoricons.com/), and [Framer Motion](https://www.framer.com/motion/)
- **Observability**: [@sentry/react](https://sentry.io/) for frontend error reporting
- **PWA & Offline Strategy**: Custom service worker (`src/sw.ts`) with runtime cache rules (see [PWA Documentation](./docs/pwa.md))
- **End-to-End Testing**: [Playwright](https://playwright.dev/) test suite (`tests/`)

## Key Features

### 1. Anonymous (Guest) Trading
- **Guest BUY**: Quote calculation, destination crypto wallet input, payment details to platform bank account, receipt upload, and session ID tracking.
- **Guest SELL**: Quote calculation, verified payout bank account input, automated custodial deposit wallet assignment, and live deposit monitoring.
- **Resumable Orders**: Ability to look up and resume unexpired anonymous sell sessions using email and blockchain network.

### 2. Authenticated Trading & Dashboard
- **User Dashboard**: Summary of recent orders, incomplete order count pill, live market exchange rate ticker, and custodial wallet overview.
- **Custodial Wallets**: Displays user deposit addresses for supported assets (SOL, ETH, BTC, TRON) with on-demand wallet generation for newly supported networks.
- **Order Details & History**: Filterable transaction history (BUY/SELL, status tabs, date ranges) and single-transaction timeline with status icons.
- **Manual Deposit Recheck**: Trigger on-demand blockchain rechecks if a deposit has not yet been detected by automated indexers.

### 3. Banking & Payout Management
- Add, update, and manage Nigerian bank accounts (NUBAN).
- Real-time account holder name verification using Nomba bank lookup.
- Set default payout accounts with confirmation modals.

### 4. Dispute Resolution Center
- Direct dispute initiation for uncredited or delayed transactions.
- In-app threaded messaging between users and support staff with file upload attachments.

### 5. Identity Verification (KYC)
- Tiered verification workflow:
  - **Tier 1**: National Identification Number (NIN) verification via Prembly.
  - **Tier 2**: Biometric selfie and government-issued ID verification hosted by Didit.

## Project Structure

```
crypto-now-frontend/
├── docs/                 # Documentation (PWA strategy, etc.)
├── src/
│   ├── api/              # Axios API clients mapped to backend endpoints
│   ├── assets/           # Static images, SVG logos, and background art
│   ├── components/       # Global UI components (buttons, modals, badges, inputs)
│   ├── config/           # App configuration and environment variable bindings
│   ├── constants/        # Centralized constants, regex patterns, and route paths
│   ├── hooks/            # Custom hooks for UI state and business logic
│   ├── layouts/          # Authenticated and Public layout wrappers
│   ├── lib/              # Third-party client wrappers (Moment, Axios, Sentry)
│   ├── pages/            # Page-level containers
│   ├── queries/          # TanStack React Query hooks with cache key hierarchies
│   ├── redux/            # Redux Toolkit slices (trade, auth, crypto, UI)
│   ├── routes/           # TanStack Router route definitions
│   ├── schemas/          # Zod validation schemas
│   ├── sections/         # Domain-specific UI sections (dashboard, trade, dispute)
│   ├── types/            # TypeScript interfaces and API payload types
│   ├── util/             # Utility helpers, number formatters, and precision math
│   ├── pwa.ts            # PWA registration and update prompt bindings
│   ├── store.ts          # Redux store setup with persistence
│   └── sw.ts             # Service worker implementation with Workbox
└── tests/                # Playwright E2E test specs
```

## Development and Scripts

### Prerequisites
- [pnpm](https://pnpm.io/) package manager
- Node.js 20+

### Available Scripts

- `pnpm dev`: Starts the Vite development server with hot module replacement (HMR).
- `pnpm build`: Runs TypeScript compiler (`tsc -b`) and bundles production assets via Vite.
- `pnpm preview`: Locally previews the production build.
- `pnpm lint`: Lints codebase using ESLint.
- `pnpm test`: Runs end-to-end test suite using Playwright.
- `pnpm test:headed`: Runs Playwright tests with a visible browser.
- `pnpm test:ui`: Opens the interactive Playwright test runner UI.

## Environment Variables

Configure the following environment variables in `.env` (or `.env.local`):

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:5000/api/v1/crypto-now`) |
| `VITE_SENTRY_DSN` | Sentry DSN for frontend error telemetry (optional in development) |
| `VITE_APP_ENV` | Environment identifier (`local`, `dev`, `prod`) |
