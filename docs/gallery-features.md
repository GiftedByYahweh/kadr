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

- **Single photographer.** The system has one photographer user. No
  multi-tenancy, but the code is still built properly.
- **One gallery for selecting and downloading.** The client selects photos and
  can also download them; there are no separate proofing and delivery stages.
- **Extra photos: counting only.** No online payment. The system calculates
  the amount; the photographer settles it with the client outside the system.
- **Package counter.** The client always sees `selected / included` (the limit
  is set by the photographer per gallery). Every photo selected above the limit
  adds the per-photo price, and the extra total is shown on screen. Selecting
  is not blocked when the limit is exceeded.
- **Client identity.** Anyone with the link can view. To like or comment, the
  visitor enters a name (email optional) once; it is remembered in the browser.
  No passwords or accounts.
- **Shared selection.** A gallery has one shared selection. The counter counts
  unique liked photos; every like and comment records who made it, so the
  photographer sees e.g. "❤️ Olena, Andrii".

## Open questions

### Downloads

- ZIP of a whole shoot can be several GB: stream it on the fly, prebuild it, or
  split it into parts?
- Does the client download originals, web-sized copies, or choose?
- Is "download selected" the same as the liked photos? (Proposed: yes.)
- Should the photographer see who downloaded what?

### Selection and file names

- Is there a "submit selection" step that notifies the photographer and locks
  the selection? Can the client change it afterwards?
- Export format for file names: comma- or newline-separated, ready-made
  Lightroom search string? With or without extension? (Photographer uploads
  JPEGs but works with RAWs, so without extension is more useful.)
- Duplicate file names (two cameras → two `IMG_0001` in one shoot).

### Comments

- Per photo only, or also a general gallery comment?
- Can the photographer reply (threads)?
- Does commenting automatically like the photo?

### Access period

- After expiry: is everything blocked, or only downloads?
- How long does an archived/trashed gallery live before final deletion?
  (Directly affects storage cost: originals of one shoot are 5–15 GB.)
- Reminder to the client before expiry?
- Manual revoke / regenerate link?

### Security

- PIN/password on the gallery, or a secret link only?
- Watermarks on previews?

### General

- Sections inside a shoot (ceremony, party, …)?
- Photo order: file name, capture time (EXIF), or manual?
- Upload formats: JPEG only? HEIC? Video?
- Notifications to the photographer (email/Telegram) about selections and
  comments?
- Promote a gallery photo to the portfolio in one click?
- Client UI language: Ukrainian only or several?
- Comparing photos: how many at once (2? up to 4?), and how does it work on a
  phone?
