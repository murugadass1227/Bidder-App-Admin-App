# Bidder Monorepo

Production-ready full-stack monorepo: **Turborepo** + **pnpm**, with **Next.js** (Bidder + Admin), **NestJS API**, **MySQL + Prisma**, **JWT auth**, and **real-time bidding** via WebSockets.

## Structure

```
apps/
  bidder-web/     # Next.js 15 App Router – bidder frontend (port 3000)
  admin-web/      # Next.js 15 App Router – admin dashboard (port 3001)
  api/            # NestJS – REST API + WebSocket (port 4000)
packages/
  db/             # Prisma schema + client (User, Auction, Bid)
  ui/             # Shared Tailwind UI components
  config/         # Shared TS + ESLint config
```

## User roles

| Role | Capabilities |
|------|--------------|
| **Bidder** | Register, browse lots, bid, pay (if required), view won lots, download documents. |
| **Admin** | Create lots, upload media/docs, create/start/end auctions, manage bidders, approvals, reporting. |
| **Salvage/Yard Operator** *(optional)* | Update location, release, pickup status. |
| **Insurer/Assessor** *(optional)* | Submit lots, approvals, reserve price. |

Self-registration is allowed only for **Bidder** and **Admin**. Optional roles (Salvage/Yard Operator, Insurer/Assessor) are assigned by an admin.

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** 9 (or run `corepack enable && corepack prepare pnpm@9.14.2 --activate`)
- **MySQL** 8 (local or Docker)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Copy the example env and set required values:

```bash
cp .env.example .env
```

For database commands (migrate, push, studio), ensure `packages/db/.env` exists with `DATABASE_URL`, or copy from root `.env`:

```bash
cp .env packages/db/.env
```

Edit `.env` and set at least:

- `DATABASE_URL` – MySQL connection string (e.g. `mysql://user:password@localhost:3306/bidder_db`)
- `JWT_ACCESS_SECRET` – min 32 characters
- `JWT_REFRESH_SECRET` – min 32 characters

Optional: `CORS_ORIGINS`, `PORT`, `RATE_LIMIT_*`, and frontend `NEXT_PUBLIC_*` in each app.

### 3. Database

Create the MySQL database if it does not exist, then generate Prisma client and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

### 4. Run all apps (development)

```bash
pnpm dev
```

If you change API DTOs (e.g. register/login payloads), restart `pnpm dev` so the API rebuilds; otherwise validation may reject new properties.

- **Bidder**: http://localhost:3000  
- **Admin**: http://localhost:3001  
- **API**: http://localhost:4000/api/v1  

To run only the API (after building the db package):

```bash
pnpm dev:api
```

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start all apps in dev mode (Turborepo) |
| `pnpm dev:api` | Build db package and run API only |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all workspaces |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting without writing |
| `pnpm clean` | Remove build outputs and node_modules |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:push` | Push schema (no migration files) |
| `pnpm commit` | Run commitlint (conventional commits) |

## Docker

The project uses **MySQL**. For a quick local database:

```bash
docker run -d --name bidder-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=bidder_db -p 3306:3306 mysql:8
# Then run migrations from host:
pnpm db:migrate
```

Or use the included `docker-compose.yml` (PostgreSQL) if you prefer – update `packages/db/prisma/schema.prisma` provider to `postgresql` and adjust `DATABASE_URL` accordingly.

## API Overview

- **Auth**: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/refresh`, verify email/mobile
- **Users**: `GET /api/v1/users/me`, `PATCH /api/v1/users/me`, reservation proof, KYC, `GET /api/v1/users/me/won`, `GET /api/v1/users/me/invoices`
- **Auctions (lots)**: `GET /api/v1/auctions` (query: status, make, model, year, yard, damageType), `GET /api/v1/auctions/:id` (public; VIN/engine masked for bidders); Admin: `POST/PATCH/DELETE`
- **Bids**: `POST /api/v1/bids` (place bid, optional maxBid), `GET /api/v1/bids/auction/:auctionId` (history with anonymized bidder ID), `GET /api/v1/bids/my`
- **Watchlist**: `GET/POST /api/v1/watchlist`, `DELETE /api/v1/watchlist/:auctionId`
- **WebSocket**: namespace `/bidding` – events: `bid`, `join`, `leave`; server emits `bid:update`

## Creating an admin user

After registering a user (Bidder by default), promote to admin via Prisma:

```bash
pnpm db:studio
# Edit the user row and set role to ADMIN
```

Or use a seed script in `packages/db` to create an initial admin (see Prisma docs for seeding).

## Code quality

- **ESLint** + **Prettier** (shared config in `packages/config`)
- **Husky** pre-commit runs **lint-staged** (lint + format)
- **Conventional commits** recommended (use `pnpm commit` or `git commit` after `husky` setup)

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):

- Install deps, generate Prisma client
- Lint and build all workspaces
- Optional: test API against a MySQL service

## Security

- **Helmet** and **CORS** enabled on API
- **Rate limiting** via `@nestjs/throttler`
- **JWT** access + refresh tokens; **Passport** strategies and role guards

## License

Private / MIT (as needed).
