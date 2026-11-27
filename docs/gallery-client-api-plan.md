# Plan: Gallery Client API (part 2)

## Context

Kadr is a photographer's portfolio plus client galleries. The photographer
creates a gallery in the admin and sends the client a secret link
`GALLERY_URL/<shareToken>`. The client opens it, views photos, likes them and
leaves comments.

The client app `apps/gallery` is already built, but it reads data from a mock
(`apps/gallery/src/mocks/gallery.json`). This task adds the client API zone
`/api/gallery/*` and connects the app to it.

Read before starting:

- `AGENTS.md` — project rules (architecture, style, prohibitions). Mandatory.
- `docs/gallery-features.md` — gallery features and decisions made.
- `docs/gallery-admin-api-plan.md` — the previous part. Its code in
  `apps/api/src/modules/gallery/` is the reference for this one.

Start from a branch that already has `feat/gallery-admin-api` merged: this task
extends the same module (repository, mapper, container).

## Scope

- Read a gallery by `shareToken`.
- Like and unlike a photo.
- Add a comment to a photo.
- `noindex` for the client zone.
- Connect `apps/gallery` to the API instead of the mock.

**Out of scope** (separate tasks later): photo upload and previews,
"Submit selection" and its history, downloads and ZIP, comparing photos,
trash cleanup cron.

## 1. Routes

Add the paths to `GalleryApiRoutes` (`packages/shared/src/api/routes/gallery.ts`,
it is empty now) in the same style as `AdminApiRoutes`: a `GALLERY_API_PREFIX`
built from `API_PREFIX`, full paths, no strings anywhere else.

| Method   | Path                                          | What it does      |
| -------- | --------------------------------------------- | ----------------- |
| `GET`    | `/api/gallery/:token`                         | The gallery       |
| `POST`    | `/api/gallery/:token/media/:mediaId/like`    | Toggle photo like |
| `POST`   | `/api/gallery/:token/media/:mediaId/comments` | Add a comment     |

One route = one use case: `GetClientGalleryUseCase`, `LikeMediaUseCase`,
`UnlikeMediaUseCase`, `AddMediaCommentUseCase`.

There is no session here: access is the `token` in the path. No guard, but
every use case first resolves the gallery by token and checks access
(section 3). Put that check in one place (a helper used by all four use cases
or a small use case they receive through the constructor), not copied four
times.

Like and unlike are idempotent: liking an already liked photo keeps the first
`liked_at`, unliking a photo without a like is not an error.

### Request bodies

- **Comment:** `text`, trimmed, 1–`GALLERY_COMMENT_MAX_LENGTH` characters
  (the constant already exists in `@kadr/shared`).

Zod schemas (params and body) live in `@kadr/shared` next to the admin ones.

## 2. What we return

`GET` returns `ClientGalleryDto` (already in `packages/shared/src/gallery/dto.ts`).
Changes to it:

- add `currency` — without it the client cannot see the price of extra photos;
- `subtitle` has no column in the database. Agree with the project owner
  before the step whether to remove it from the DTO and `GalleryHero` or to
  add a column;
- `coverUrl` becomes `string | null`: a gallery may have no photos.

Rules for the media list:

- only media with status `ready`;
- ordered by `position`;
- comments of each photo ordered by `created_at`;
- cover: the media with `is_cover`, otherwise the first one by `position`.

`previewUrl` and `coverUrl` are short-lived signed URLs from
`FileStorage.presignDownload` (`apps/api/src/common/storage/`), built from
`preview_key`. Storage is never public, the original (`storage_key`) is never
returned here. Put the URL lifetime into a named constant.

Like, unlike and comment return the updated `ClientGalleryMediaDto` of that
photo, so the client can replace it in its state.

## 3. Business rules

- Gallery not found by token, gallery in the trash (`trashed_at` is set), or
  `expires_at` has passed → the same `GALLERY_NOT_FOUND`. The client must not
  learn whether the link is wrong, trashed or expired.
- `mediaId` that does not belong to this gallery or is not `ready` →
  `GALLERY_MEDIA_NOT_FOUND` (already exists in `DomainErrorCode`).
- The current time (`new Date()`) is taken in the use case and passed into
  pure functions of `gallery.service.ts` (e.g. "is the gallery open").
- Token lookup is already protected by the general rate limiter in
  `server.ts`; check that it covers the new routes.

## 4. `noindex`

- API: header `X-Robots-Tag: noindex, nofollow` on all `/api/gallery/*`
  responses (one hook in the routes plugin, not per handler).
- `apps/gallery/index.html`: `<meta name="robots" content="noindex, nofollow">`.
- Production Caddy for the gallery site: the same `X-Robots-Tag` header
  (`docker/caddy/`).

## 5. Frontend (`apps/gallery`)

- Read the token from `location.pathname` (`/<token>`), no vue-router.
- `src/services/gallery.service.ts`: call the API through `http` from
  `@kadr/shared/http` with `GalleryApiRoutes`. Remove the mock and
  `src/mocks/gallery.json`.
- `useGallery`: `toggleLike` and `addComment` call the API and replace the
  photo with the returned DTO. On failure the UI must not stay in a state the
  server does not have.
- Show the currency from the DTO instead of a hardcoded one.
- Screen for `GALLERY_NOT_FOUND` (Ukrainian text, e.g. "Галерея недоступна"),
  decided by `code`, not by `message`.

## 6. Steps

Each step ends with green typecheck/lint/format and is handed over for review
separately.

1. **Foundation:** `GalleryApiRoutes`, Zod schemas, DTO changes in
   `@kadr/shared`.
2. **Read:** access check, repository methods, mapper with signed URLs,
   `GetClientGalleryUseCase`, routes plugin, container, `noindex` header.
3. **Writes:** like, unlike, comment.
4. **Frontend:** token from the path, service, `useGallery`, error screen,
   meta tag.
5. **End-to-end check** (section 7).

## 7. Checks before handing over

There is no photo upload yet, so seed data by hand: create a gallery in the
admin, insert a few `gallery_media` rows with status `ready` and put files
under their `preview_key` in local storage (or point them at existing keys).

1. `pnpm typecheck`, `pnpm lint`, `pnpm format:check` — no errors.
2. Through curl / HTTP client: the gallery opens by token; like, unlike,
   comment work; repeated like/unlike does not fail.
3. Errors: wrong token, trashed gallery, expired gallery → all
   `GALLERY_NOT_FOUND`; photo of another gallery → `GALLERY_MEDIA_NOT_FOUND`;
   empty and too long comment → `BAD_REQUEST`.
4. Regenerating the link in the admin makes the old one return
   `GALLERY_NOT_FOUND` immediately.
5. `X-Robots-Tag` is present on the responses.
6. `pnpm dev`, open `http://localhost:5181/<token>`: photos load, likes and
   comments survive a page reload, the counter and extra price are correct.
7. No comments in code, no `enum`, no new packages without approval.
8. No tests for now.
