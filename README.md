# kadr

Portfolio website and client galleries for a photographer.

- **Portfolio** — public site with categories, collections, prices and an
  about page, managed from the admin panel.
- **Client galleries** — the photographer uploads a shoot and shares a link;
  the client views, likes, comments on and downloads photos, and the
  photographer works with the selection. See
  [docs/gallery-features.md](docs/gallery-features.md).

## Structure

| Path              | What                         | Stack                                       |
| ----------------- | ---------------------------- | ------------------------------------------- |
| `apps/api`        | Backend API                  | Fastify, Drizzle ORM, PostgreSQL            |
| `apps/admin`      | Admin panel for photographer | Vue 3, vue-router, TanStack Query, PrimeVue |
| `apps/gallery`    | Client gallery               | Vue 3, vue-router                           |
| `apps/portfolio`  | Public portfolio site        | Astro (static)                              |
| `packages/shared` | Shared types and validation  | TypeScript, Zod                             |
| `packages/ui`     | Shared Vue components        | Vue 3                                       |

## Requirements

- Node.js 24+
- pnpm 12 (`npm i -g pnpm@12.11.2`)
- Docker with Compose

## Getting started

```sh
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm dev
```

`pnpm dev` starts PostgreSQL in Docker and runs all apps locally with hot
reload.

## Scripts

| Command            | What it does                               |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Start PostgreSQL and all apps in dev mode  |
| `pnpm infra:up`    | Start PostgreSQL only                      |
| `pnpm infra:down`  | Stop PostgreSQL (data is kept in a volume) |
| `pnpm docker:up`   | Build and run the whole system in Docker   |
| `pnpm docker:down` | Stop the whole system                      |
| `pnpm typecheck`   | Type-check all packages                    |
| `pnpm lint`        | Lint all packages with ESLint              |
| `pnpm format`      | Format code with Prettier                  |

## Ports

| Service    | Port |
| ---------- | ---- |
| api        | 4000 |
| admin      | 5180 |
| gallery    | 5181 |
| portfolio  | 4321 |
| PostgreSQL | 5440 |

The same ports are used by `pnpm dev` and `pnpm docker:up`, so run one at a
time.
