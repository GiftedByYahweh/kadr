# Client gallery — features

Photo gallery functionality for the photographer.

## 1. Downloading photos

The client can:

- Download all photos as a single ZIP archive.
- Download individual photos.
- Download only the selected photos.

## 2. Selecting photos

- The client can put a ❤️ on photos to build a list of favourite shots.
- The photographer sees all liked photos together with their original file
  names, for example:
  - IMG_5432
  - IMG_5441
  - IMG_5518
  - IMG_5602

## 3. Comments

- Each photo has a comment field.
- The photographer sees the comments in the gallery.

## 4. Comparing photos (optional)

- Ability to open several photos side by side.

## 5. Selling additional photos

- The photographer defines a package: the number of photos included in the
  price of the shoot.
- The system tracks how many photos the client has selected.
- If the client selects more photos than the package includes, the system
  automatically offers to buy the additional shots at a set price.
- The client sees the number of selected photos, the package limit and the
  price of additional shots.

## 6. Gallery access period

- The photographer can set a period during which the client has access to the
  gallery and can download photos.
- When the period ends, the link becomes inactive for the client.
- The gallery is not deleted right away; preferably it is moved to a trash or
  archive.
- The photographer can restore the gallery and reopen access for the client.
- Preferably, the access period can be extended without re-uploading the
  photos.

---

## Decisions

- **One gallery for selecting and downloading.** The client selects photos and
  can also download them; there are no separate proofing and delivery stages.
- **Extra photos: counting only.** No online payment. The system calculates
  the amount; the photographer settles it with the client outside the system.
- **Package counter.** The client always sees `selected / included` (the limit
  is set by the photographer per gallery). Every photo selected above the limit
  adds the per-photo price, and the extra total is shown on screen. Selecting
  is not blocked when the limit is exceeded.
- **No visitor identity.** Anyone with the gallery link can view, like and
  comment. Visitors are not identified (no name, no account); the secret
  `share_token` in the link is the only access control. Per-visitor likes can
  be added later without breaking data.
- **Shared selection.** A like belongs to a photo, not to a person: it is the
  `liked_at` timestamp on the photo, and removing it removes it for everyone.
  The package counter counts liked photos of the gallery.
- **Comments** belong to a photo and have no author; they all come from the
  client side.
- **Extra photo price** is a whole number in UAH.
- **Submit selection, with history.** The client confirms the selection with
  "Submit selection"; each submit saves a snapshot of the selected photos.
  While the gallery is open the client can still change the selection, but the
  change counts only after submitting again. Every submit is logged for the
  photographer, e.g. "21:20 — 34 photos, +600 ₴", "21:30 — 31 photos, +150 ₴",
  with what was added and removed compared to the previous submit. The
  photographer works from the latest submitted selection and also sees when the
  current likes differ from it ("changed after submit, not confirmed yet").
  **Planned, not implemented yet.**
- **After expiry** the gallery link is fully blocked for the client.
- **Trash instead of archive.** A gallery has two statuses: `active` and
  `trashed`. "Move to trash" turns the client link off and keeps everything
  (rows and files) for **30 days**; during that time the gallery can be
  restored. After 30 days a cron job deletes it completely: rows and files in
  storage. "Delete permanently" is available both for an active gallery and for
  one in the trash: it deletes rows and files right away, without restore, and
  is confirmed by typing the gallery title.
- **Restoring an expired gallery.** If `expires_at` has already passed when the
  photographer restores a gallery from the trash, the restore asks for a new
  access date (14 / 30 / 60 days from today, a custom date, or no limit). It
  cannot be restored without one, so an "active but dead link" gallery never
  happens; the API rejects such a restore too. A gallery that has not expired is
  restored right away.
- **No sections** inside a gallery in the MVP.
- **Client UI language**: Ukrainian (labels, dates `16 жовтня о 21:20`,
  prices `300 ₴`).
- **Photo order**: by file name by default, the photographer can reorder by
  drag and drop.
- **Revoke link.** In the admin the photographer can regenerate the gallery's
  `share_token`; the old link stops working immediately.
- **Signed file URLs.** Previews and originals are served only through
  short-lived signed URLs issued by the API for a valid `share_token`; storage
  is never public.
- **No PIN/password** on galleries for now; the secret link is enough.
- **Token lookup is rate limited** by the general API rate limiter, so
  `share_token` cannot be brute-forced.
- **Gallery pages are `noindex`** (meta tag + `X-Robots-Tag` header), so they
  never appear in search results.

## Data model

```
users ──< galleries ──< gallery_media ──< gallery_comments
```

- `galleries`: `user_id`, `title`, `share_token`, `status`
  (`active` / `trashed`), `trashed_at` (start of the 30-day countdown),
  `expires_at`, `included_count`, `extra_price`, `selection_submitted_at`.
  The schema still has `archived` and no `trashed_at`: to be changed with a
  migration together with the gallery API.
- `gallery_media`: `original_name`, `storage_key`, `preview_key`, `status`
  (`uploading` / `ready` / `failed`), `content_type`, `size_bytes`, `width`,
  `height`, `taken_at`, `position`, `liked_at` (`null` = not liked),
  `is_cover` (at most one per gallery; without a cover the first photo by
  `position` is used).
- `gallery_comments`: `media_id`, `text`, `created_at`.
- `gallery_selection_submissions` (planned): `gallery_id`, `submitted_at`,
  `media_ids` (snapshot of the selected media), `selected_count`,
  `extra_total`. `galleries.selection_submitted_at` then becomes the time of
  the latest submission.

Schema source: `apps/api/src/modules/*/tables/`.

## Open questions

### Downloads

- ZIP of a whole shoot can be several GB: stream it on the fly, prebuild it, or
  split it into parts?
- Does the client download originals, web-sized copies, or choose?
- Is "download selected" the same as the liked photos? (Proposed: yes.)
- Should the photographer see who downloaded what?

### Selection and file names

- Export format for file names: comma- or newline-separated, ready-made
  Lightroom search string? With or without extension? (Photographer uploads
  JPEGs but works with RAWs, so without extension is more useful.)
- Duplicate file names (two cameras → two `IMG_0001` in one shoot).

### Comments

- Per photo only, or also a general gallery comment?
- Can the photographer reply (threads)?
- Does commenting automatically like the photo?

### Access period

- Reminder to the client before expiry?

### Security

- Watermarks on previews?

### General

- Upload formats: JPEG only? HEIC? Video?
- Notifications to the photographer (email/Telegram) about selections and
  comments?
- Promote a gallery photo to the portfolio in one click?
- Comparing photos: how many at once (2? up to 4?), and how does it work on a
  phone?
