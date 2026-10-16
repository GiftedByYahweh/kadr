# Instructions and Rules for Kadr Project

## 0. Project Context

- Kadr is a photographer's portfolio website plus client galleries, built for a single photographer (one user in the system).
- It replaces the older `photographer_portfolio` project, which stays live until the portfolio is migrated here.
- Current phase: **client galleries first** (api + admin + gallery), then the portfolio migration.
- Gallery features, decisions and open questions: `docs/gallery-features.md`. Read it before any gallery work.
- Shared foundations (auth, file storage, images, previews) MUST be generic, not gallery-specific, so the portfolio can reuse them later.

## 1. STRICT CONSTRAINTS (CRITICAL RULES)

### 1.1 Git Version Control

**The agent is STRICTLY FORBIDDEN from:**

1. Running `git commit`.
2. Running `git push`.
3. Creating or switching branches (`git checkout -b`, `git branch`, `git switch -c`).
4. Modifying git history or branch states in any other way.

> **All commits, pushes, and branch management are performed EXCLUSIVELY by the user.**
> The agent only creates, edits, and verifies code files and runs local tests/builds/docker. When asked, the agent may propose a commit message.

### 1.2 Package & Dependency Management

- **NEVER install or add new packages autonomously.** If a new package is needed, the agent MUST name it, explain why, and get the user's confirmation before installing.
- Package manager is **pnpm** only. Never use `npm install` / `yarn` inside the repo.
- Respect pnpm's `minimumReleaseAge` policy: never add `minimumReleaseAgeExclude` entries; pick an older version range instead.
- Install scripts are allowed only for packages listed in `allowBuilds` in `pnpm-workspace.yaml`.

### 1.3 Zero Code Comments

- **STRICTLY FORBIDDEN: leaving comments in code** (`//`, `/* */`, `<!-- -->`), including commented-out code. Write self-documenting code with meaningful names and strict types.

### 1.4 SVG Assets Isolation

- **SVG MUST ALWAYS be a separate `.svg` file.** Inline `<svg>` markup in Vue templates, Astro, HTML, or TS files is forbidden.

### 1.5 Prohibition of TypeScript `enum`

- **STRICTLY FORBIDDEN: TypeScript `enum`.** Use `const ... as const` objects with union types derived via `(typeof Obj)[keyof typeof Obj]`, or string literal unions.

### 1.6 Magic Numbers and Magic Strings

- Values in business logic whose meaning is not obvious (limits, TTLs, thresholds, max lengths, cookie names, statuses, route paths) MUST be named constants (`const ... as const` or `SCREAMING_SNAKE_CASE`).
- Validation limits shared by backend and frontend live in `@kadr/shared` and are reused across Zod schemas, DB definitions and UI.
- This does NOT mean extracting every literal: self-evident presentational values (icon sizes, spacing, UI tweaks) stay inline.

---

## 2. Monorepo Architecture

- **pnpm workspaces**: `apps/*`, `packages/*`.

| Package           | Role                         | Stack                                       |
| ----------------- | ---------------------------- | ------------------------------------------- |
| `apps/api`        | Backend API                  | Fastify, Drizzle ORM, PostgreSQL            |
| `apps/admin`      | Admin panel for photographer | Vue 3, vue-router, TanStack Query, PrimeVue |
| `apps/gallery`    | Client gallery               | Vue 3, vue-router                           |
| `apps/portfolio`  | Public portfolio site        | Astro (static)                              |
| `packages/shared` | Shared types, DTOs, Zod      | TypeScript, Zod                             |
| `packages/ui`     | Shared Vue components        | Vue 3 (no PrimeVue)                         |

- Internal packages are consumed as TypeScript source (`exports` → `./src/index.ts`), no build step. Depend on them with `workspace:*`.
- `@kadr/shared` must stay framework-free (no Vue, Fastify, Drizzle). `@kadr/ui` must not depend on PrimeVue, because `gallery` does not use it.
- All configs are TypeScript (`.ts`) or JSON. No `.js` config files.
- Every package extends `tsconfig.base.json` (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`). `apps/portfolio` extends it together with `astro/tsconfigs/strict`. Relative imports use explicit `.ts` extensions; env variables are read as `process.env['NAME']`.

---

## 3. Environment & Docker

- Node 24+, pnpm 12, Docker with Compose.
- **Development (`pnpm dev`)**: PostgreSQL runs in Docker (`docker-compose.yml`, service `postgres`), all apps run on the host with hot reload.
- **Full stack in Docker (`pnpm docker:up` / `pnpm docker:down`)**: apps are in the compose profile `full`. `api` runs via `node --import tsx` with production dependencies only, as the `node` user. `admin`, `gallery`, `portfolio` are static builds served by nginx.
- `pnpm dev` and `pnpm docker:up` use the same host ports; run one at a time.
- Ports: api `4000`, admin `5180`, gallery `5181`, portfolio `4321`, PostgreSQL `5440`. Do not change them without a reason: ports `3000`, `5173`–`5174`, `5432`–`5434` are taken by other local projects.
- `apps/api/.env` is created from `apps/api/.env.example` and is never committed.
- Production target: own server with Docker (cron jobs needed), PostgreSQL in Docker on that server.

---

## 4. Backend Architecture (`apps/api`)

### 4.1 Feature Module Structure (`src/modules/<feature>/`)

```
src/
├── modules/<feature>/   # Business feature modules (vertical slices)
├── container/           # Composition root: wires modules with infrastructure
├── db/                  # Drizzle client, migrations, unit of work
├── common/              # Cross-cutting: errors, use case types, guards, utils
├── server.ts            # Fastify instance, plugins, error handler
└── main.ts              # Entry point
```

```
src/modules/<feature>/
├── entities/
│   └── <name>.entity.ts             # Pure domain models
├── repositories/
│   ├── <name>.repository.ts         # Repository port interface
│   └── drizzle-<name>.repository.ts # Drizzle implementation
├── tables/
│   └── <name>.table.ts              # Drizzle table definition
├── mappers/
│   └── <name>.mapper.ts             # DB row -> entity, entity -> DTO
├── use-cases/
│   └── <action>.use-case.ts         # One business operation per file
├── routes/
│   ├── <feature>.routes.ts          # Fastify route plugin
│   └── <feature>.schema.ts          # Route validation schemas
├── <feature>.deps.ts                # Deps interfaces of the module's use cases
├── <feature>.service.ts             # Pure domain logic
└── index.ts                         # Public barrel export
```

- No controllers: route handlers parse the request, call one use case and return its result.
- Modules never import from `src/container/`; only the container depends on modules.

### 4.2 Single Use Case per Route & Atomic Transactions

- A route handler calls **exactly one** use case. Multi-step workflows live inside a single use case and run atomically in `unitOfWork.run(async () => { ... })`.
- Route handlers contain zero business logic and zero arithmetic.
- Max 350 lines per use case file; split steps into named helper functions or `<feature>.service.ts` before hitting ESLint limits.

### 4.3 Functions vs Classes

- **Functions everywhere. Classes only for components that own state**: connections, pools, SDK clients (DB provider, file storage client, logger). They implement a port interface.
- Use cases: plain `async function` with the fixed signature `(deps, input)` (see 4.4).
- Repositories and other components that only hold dependencies: factory functions returning an object that implements the port, e.g. `drizzleGalleryRepository(db): GalleryRepository`.
- Mappers, `<feature>.service.ts`, helpers: plain functions.
- Fastify route plugins and guards: functions.

### 4.4 Use Case Shape

- One use case = one file = one exported `async function <action>(deps, input)`. The signature is fixed: dependencies first, input second. No closures returning functions, no classes, no `.execute()`.
- `<Action>Input` is a named interface in the use case file.
- `<Action>Deps` interfaces of a module live together in `modules/<feature>/<feature>.deps.ts`, one interface per use case listing only what it needs.
- The return type is inferred, except when the use case returns a DTO from `@kadr/shared`, then it is annotated (`Promise<GalleryDto>`).

```ts
export interface TogglePhotoLikeInput {
  galleryId: string;
  photoId: string;
  visitorId: string;
}

export async function togglePhotoLike(
  deps: TogglePhotoLikeDeps,
  input: TogglePhotoLikeInput,
) {
  const gallery = await deps.galleryRepository.findById(input.galleryId);
  assertGalleryOpen(gallery, new Date());
  ...
}
```

- Dependencies are bound once in `src/container/<feature>.container.ts`, which returns the module's use cases as an object; route plugins receive it and call `useCases.<action>(input)`:

```ts
export const galleryUseCases = (deps: GalleryModuleDeps) => ({
  togglePhotoLike: (input: TogglePhotoLikeInput) =>
    togglePhotoLike(deps, input),
});

export type GalleryUseCases = ReturnType<typeof galleryUseCases>;
```

- When a use case needs another use case, it receives the bound function through its `deps`.
- Use cases depend on repository ports (interfaces), never on Drizzle implementations.
- Use cases take the current time (`new Date()`) and pass it into pure service functions; services never read the clock themselves.
- Use cases return DTOs from `@kadr/shared`, produced by mappers. Defaults and statuses of new records (e.g. `status: PENDING`) are decided in the use case, not in mappers.
- `unitOfWork.run` is used only when several writes must succeed together.

### 4.5 Naming

- Functions: no `create` prefix (`drizzleGalleryRepository`, `galleryRoutes`, `galleryUseCases`, `toGalleryDto`, `successResponse`). A use case may start with `create` only when the domain action is creating something (`createGallery`).
- Stateful classes: `DbProvider`, `R2FileStorage implements FileStorage`, `ConsoleLogger implements Logger`.
- Files in `apps/api` use kebab-case with role suffixes: `.service.ts`, `.use-case.ts`, `.deps.ts`, `.table.ts`, `.repository.ts`, `drizzle-<name>.repository.ts`, `.schema.ts`, `.guard.ts`, `.routes.ts`, `.mapper.ts`, `.entity.ts`, `.provider.ts`, `.error.ts`, `.context.ts`. camelCase file names are forbidden.

### 4.6 Response Envelope

- Types live in `@kadr/shared` (`types/api.ts`):
  - `ApiSuccessResponse<T>`: `{ success: true, data: T, timestamp: number }`.
  - `ApiErrorResponse`: `{ success: false, code: AppErrorCode, message: string, timestamp: number }`. Never `data` in errors.
  - `ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse`.
- Built only by `successResponse(data)` and `errorResponse({ code, message })` from `src/common/utils/api-response.ts`.
- A global `preSerialization` hook wraps successful responses with `successResponse`; responses with status `>= 400` and docs routes pass through untouched. Handlers return data directly. No artificial `reply.status(201)`.

### 4.7 Routes

- All API route paths are declared once in `@kadr/shared` (`ApiRoutes`) and used by both Fastify and frontend transports. No inline or module-local route strings.
- The API has three zones with different auth: `admin` (photographer session), `public` (portfolio build, read-only), `gallery` (gallery link + visitor identity).

### 4.8 Isolation & Dependency Injection

- Fastify is used only in `src/server.ts`, `src/main.ts` and `*.routes.ts`. `FastifyRequest`/`FastifyReply` never reach use cases, services or repositories.
- Route schemas live in `*.schema.ts`, never inline in handlers.
- Manual DI in `src/container/`: `infrastructure.container.ts`, `repositories.container.ts`, `<feature>.container.ts`, `app.container.ts`.
- Mappers (`mappers/<name>.mapper.ts`) are plain functions with two jobs:
  - DB row -> entity (`toGallery(row)`), used only by `drizzle-*.repository.ts`;
  - entity -> DTO from `@kadr/shared` (`toAdminGalleryDto`, `toClientGalleryDto`): dates to ISO strings, storage keys to URLs, computed fields. Fields are picked deliberately per consumer instead of copying the whole entity. Entities are never returned from the API directly.
- Stateful infrastructure adapters are classes implementing a port interface (see 4.3).
- Pure domain calculations (e.g. package limit / extra photos price) live in `<feature>.service.ts` with zero framework or DB imports.

### 4.9 Database

- Drizzle and `pg` are used only in `src/db/`, `tables/*.table.ts`, `drizzle-*.repository.ts` and row -> entity mappers.
- Tables live in the module that owns them: `src/modules/<feature>/tables/<name>.table.ts`, one file per table; exports use the `Table` suffix (`galleriesTable`, `galleryMediaTable`). `drizzle.config.ts` collects them with the glob `./src/modules/*/tables/*.table.ts`.
- A module may import another module's table only to declare a foreign key (e.g. `galleriesTable.userId` → `usersTable`), never its repositories or use cases.
- Columns with a fixed set of values (statuses, types) are Postgres enums: `pgEnum('<name>', pgEnumValues(Dictionary))`, where the dictionary is a `const ... as const` from `@kadr/shared` and `pgEnumValues` lives in `src/db/pg-enum-values.ts`. The enum is exported from the table file with the `Enum` suffix (`galleryStatusEnum`). Never `text().$type<...>()` for such columns.
- Migrations are shared for the whole database in `src/db/migrations/`. Migrations are generated with `drizzle-kit` and committed. Never use `drizzle-kit push`.
- No `BaseRepository`.
- Entities (`entities/*.entity.ts`) are business models with zero ORM imports.
- Every method of a `drizzle-<name>.repository.ts` returns its result through the row -> entity mapper. Never return a Drizzle row typed as an entity: TypeScript accepts it, but all extra columns (e.g. `passwordHash`) travel along at runtime.
- Row types (`typeof table.$inferSelect`) are used only in `drizzle-*.repository.ts` and in row -> entity mappers.
- Transactions via `UnitOfWork` on top of `AsyncLocalStorage`.
- The `pg` pool MUST have an `error` listener, otherwise a dropped idle connection crashes the process.

### 4.10 Errors & Validation

- Two levels: Zod for request shapes, business rules in use cases.
- Error codes live in `@kadr/shared` (`errors/`), as `const ... as const` dictionaries:
  - `HttpStatusCode` — generic HTTP codes (`BAD_REQUEST: 400`, `NOT_FOUND: 404`, ...).
  - `DomainErrorCode` — numeric domain codes starting at `1001` (`GALLERY_NOT_FOUND`, `GALLERY_EXPIRED`, ...).
  - `AppErrorCode = DomainErrorCode | HttpStatusCode`.
- `AppError(code, message?)` (`src/common/error/app.error.ts`) carries only an `AppErrorCode`; without a message it uses the default message of the mapped HTTP status.
- `src/common/error/http-status.map.ts` holds `HTTP_STATUS_BY_APP_ERROR` (every `AppErrorCode` → HTTP status) and `HTTP_STATUS_MESSAGES`. Every new `DomainErrorCode` MUST be added there.
- `src/server.ts`:
  - error handler: `AppError` → mapped status + `errorResponse`; anything else is logged and returned as `500`;
  - not-found handler → `404` `errorResponse`;
  - schema error formatter → `AppError(BAD_REQUEST, "<field>: <reason>")`.
- The frontend decides what to show by `code`, not by `message`.
- Errors are never swallowed: no empty `catch`, no `.catch()` that hides failures, no returning `undefined` from a failed handler.

### 4.11 Files

- Photos are uploaded directly to object storage via presigned URLs; file bodies never go through the API.
- Clients see generated previews; originals are served only for downloads.

---

## 5. Frontend Architecture (`apps/admin`, `apps/gallery`)

### 5.1 Layers

- `src/api/` — transport: typed fetch wrapper (`credentials: "include"`, JSON handling, normalized errors) and domain API functions using `ApiRoutes`.
- `src/services/` — business operations over the API, throwing user-friendly errors.
- `src/composables/` — shared reactive state and logic.
- `src/components/` — `shared/`, `features/`, `widgets/`.
- `src/layouts/`, `src/pages/`, `src/router/`.

### 5.2 State

- Server state in `admin` goes through TanStack Query.
- Client state lives in composables with module-level reactive singletons. No Pinia/Vuex.
- No `provide` / `inject` in application code.
- Auth relies on HttpOnly cookies; the session is hydrated in a router `beforeEach` guard.

### 5.3 Components & Styling

- `admin` uses PrimeVue components for tables, forms, dialogs and toasts. Do not reimplement what PrimeVue provides.
- Components shared by `admin` and `gallery` (photo grid, lightbox, photo card) live in `@kadr/ui`.
- Component styles in `<style scoped>`. Global CSS only for custom properties, resets and widely shared utility classes.
- DRY: duplicated templates become components; duplicated CSS becomes a global class.

---

## 6. Portfolio (`apps/portfolio`)

- Astro, static output. Data is fetched from the `public` API zone at build time.
- Images are served as optimized previews with responsive `srcset`, never raw originals.

---

## 7. Verification Before Completing Any Task

1. `pnpm typecheck` — 0 errors across all packages.
2. `pnpm lint` — 0 ESLint errors/warnings (`eslint.config.ts`: `strictTypeChecked`, `stylisticTypeChecked`, `vue/flat/recommended`). `.astro` files are not linted.
3. Respect ESLint complexity limits: `max-lines-per-function: 60`, `max-params: 4`, `complexity: 10`, `max-depth: 3`, `max-statements: 15`, `max-nested-callbacks: 3`. Decompose code instead of disabling rules.
4. `pnpm format:check` — passes.
5. Verify behaviour empirically (run the app or the endpoint), not only by reading code.
6. No comments, no inline SVG, no `enum`, no unexplained magic values.
7. One use case per route; route paths only from `ApiRoutes`.
8. No new packages without the user's confirmation.
