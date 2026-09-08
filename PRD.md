# PRD.md — Video Link Vault (Mini Project)

*As-built, updated Sep 8 2026. Sections follow the Application Design Guidelines outline. Where the delivered app differs from the original plan, see "Deviations from the Original Plan" at the end — the drift was deliberate in every case, and the reasoning is recorded in `memory.md`.*

## Purpose
A scaled-down, ASP.NET Core Web API + React practice build of Video Link Vault: users register/log in, then add, browse, filter, and delete their own saved video links from TikTok, YouTube, Instagram and Facebook. Data is held in memory with no database, to build reps on ASP.NET/React integration ahead of the full capstone. Each account has its own private vault; links are organised by one category apiece and any number of free-form tags, and are browsable by platform, category, search text and time range.

## Language, Framework, Version, App Type
- **Backend:** C#, .NET 10 (LTS), ASP.NET Core Web API (controller-based, not minimal API)
- **Frontend:** JavaScript/React 19 (Vite), run locally via `npm run dev` — no build/deploy step for this mini project
- **App type:** Web application (REST API + SPA client), local-only, no Azure resources, no database
- **Password hashing:** `Microsoft.AspNetCore.Identity.PasswordHasher<T>` (the framework's hasher only — full ASP.NET Core Identity is not used)

## Design of Custom Data Types

**Models**
- **`Platform`** (enum) — `TikTok`, `YouTube`, `Instagram`, `Facebook`. Serialized as its string name (not an int) via `JsonStringEnumConverter`, registered in `Program.cs`.
- **`VideoLink`** (class) — `Id` (Guid), `UserId` (Guid, owner), `Url` (string), `Platform` (Platform), `Title` (string?), `ThumbnailUrl` (string?, `null` renders a placeholder card), `Category` (string, exactly one per link — drives the sidebar list and counts), `Tags` (`List<string>`, zero or more — rendered as chips on the card), `CreatedAtUtc` (DateTime).
- **`User`** (class) — `Id` (Guid), `FirstName`, `LastName`, `Email`, `PasswordHash`. **`Email` is a hand-written property with a private backing field enforcing three invariants in its setter:** it cannot be blank, it must contain `@`, and it cannot be reassigned once set (throws `ArgumentException` / `InvalidOperationException`). This is the project's clearest example of encapsulation — the class defends its own validity rather than trusting callers.

**DTOs** (deliberately separate from the models, so the API's input/output shapes are decoupled from storage)
- **`CreateVideoLinkRequest`** — `Url` (`[Required] [Url]`), `Platform` (`[Required]`, nullable enum so a missing value fails validation instead of silently defaulting to `TikTok`), `Title` (`[MaxLength(200)]`), `ThumbnailUrl`, `Category` (`[Required]`), `Tags`.
- **`RegisterRequest`** — `FirstName`/`LastName` (`[Required] [MaxLength(50)]`), `Email` (`[Required] [EmailAddress]`), password (`[Required] [MinLength(8)]`).
- **`LoginRequest`** — `Email` (`[Required] [EmailAddress]`), password (`[Required]`).
- **`UserResponse`** — `Id`, `FirstName`, `LastName`, `Email`. **Deliberately carries no password field of any kind**, so a hash can never be serialized to a client.

**Services (storage layer)**
- **`UserStore`** — `FindByEmail`, `FindById`, `Add`, `GetAllUsers`; wraps a `List<User>`.
- **`VideoLinkStore`** — `GetForUser`, `Add`, `Delete(userId, linkId)`, `SeedDemoData(userId)`; wraps a `List<VideoLink>` and filters by `UserId` so accounts never see each other's links.
- Both are registered as **singletons** in `Program.cs`. This is load-bearing: scoped or transient registration would build a fresh list per request and silently wipe all data between calls.

**Data structures used:** `List<T>` (both stores, and `Tags`), `Guid` keys for identity, and — on the frontend — a `Map` for deriving per-category counts and a `Set` for de-duplicating tags on submit.

No inheritance hierarchy — scope is intentionally small. Composition and interface-based framework abstractions (`IPasswordHasher<User>` injected by DI) are used instead.

## Preliminary Solution Structure
Monorepo, two sibling projects (`MSSA_Mini_Project`, cloned outside OneDrive so background sync can't corrupt `.git`):

    MSSA_Mini_Project/
      Backend/Backend_Link_Vault/         (ASP.NET Core Web API)
        Models/        Platform.cs  VideoLink.cs  User.cs
        DTO/           CreateVideoLinkRequest.cs  RegisterRequest.cs
                       LoginRequest.cs  UserResponse.cs
        Services/      UserStore.cs  VideoLinkStore.cs
        Controllers/   VideoLinksController.cs  AuthController.cs
        Program.cs                        (DI, CORS, JSON enum converter, demo seed)
      Frontend/Frontend_Link_Vault/       (React 19 + Vite)
        src/App.jsx                       (owns links, categories, filters, auth state)
        src/config.js                     (API base URL)
        src/components/  LinkCard  CategorySidebar  SearchBar
                         AddLinkDialog  AuthDialog   (each with co-located .css)

**Endpoints**

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account; returns `UserResponse` |
| POST | `/api/auth/login` | Verify credentials; returns `UserResponse` |
| GET | `/api/videolinks/{userId}` | List that account's links |
| POST | `/api/videolinks/{userId}` | Add a link |
| DELETE | `/api/videolinks/{userId}/{linkId}` | Delete one link |

**Cross-cutting:** a `FrontendDev` CORS policy allows `http://localhost:5173` (Vite's dev port), applied before `MapControllers()`. Login returns the same generic `401` whether the email is unknown or the password is wrong, to prevent user enumeration. A demo account (`timothy@example.com`) is seeded at startup with thirteen sample links spanning all four platforms, so the app is immediately demonstrable after any restart.

## Features Delivered
- Register / log in / sign out, with a password-visibility toggle on both forms
- Per-account vault: three distinct UI states (logged out, logged in with an empty vault, logged in with data)
- Add a link: URL, optional title, auto-detected platform with manual override, category, comma-separated tags (de-duplicated on save)
- Delete a link, with the grid, footer total and sidebar counts all updating from one piece of state
- Filter by platform chips, by user-created category, by free-text search, and by time range — all composable
- User-created categories with live per-category counts
- YouTube thumbnails derived from the video ID with no API call; other platforms render a placeholder card
- Click a card's thumbnail to open the video in a new tab
- Loading and error messaging on the link fetch and delete paths, including a "Loading your links…" state during the initial fetch after login

## External Resources Required
- **Local tooling only:** .NET 10 SDK, Node.js/npm, Visual Studio (backend), VS Code (frontend)
- **No database, no Azure resources, no authentication provider, no API keys**
- **One third-party asset, no account needed:** YouTube's public thumbnail URL pattern (`https://img.youtube.com/vi/{videoId}/hqdefault.jpg`), built by string manipulation from the video ID. No request is made to any YouTube API — the browser simply loads the image. Three of the demo account's thirteen seeded links use real YouTube URLs with this thumbnail attached, so the demo shows both a populated and a placeholder card side by side; the remaining ten (TikTok, Instagram, Facebook, and three older YouTube entries with placeholder IDs) render the gray placeholder.

## Planned vs. Actual Development Time
Planned **~10 hours** against the 8–12 hour budget. Actual effort ran higher, because auth and per-user data were added after the original estimate was written:

| Area | Hrs |
|---|---|
| API scaffold, models, DTOs, in-memory stores | ~3 |
| Auth vertical (register/login, hashing, DTOs, demo seeding) | ~2 |
| Video link CRUD endpoints + Postman verification | ~2 |
| React app, layout, components, filters, categories | ~4 |
| Wiring the frontend to the real API (auth, load, add, delete) | ~3 |
| Polish: thumbnails, loading/error states, accessibility, theming | ~2 |

## Deviations from the Original Plan
Each was a deliberate call, not drift:
1. **Authentication was added.** Not in the original PRD at all. The app grew a real register/login flow with hashed passwords and per-account vaults, which is why `User`, three auth DTOs, `UserStore` and `AuthController` exist.
2. **Routes are per-user.** `/api/videolinks/{userId}` rather than the flat `/api/videolinks`, following from (1).
3. **`Platform` has four values, not five.** The planned `Unknown` member was dropped; instead the frontend refuses to submit a URL it can't match to a known platform, so an unrecognised value never reaches the API.
4. **`IVideoLinkRepository` / `InMemoryVideoLinkRepository` were not built.** The concrete `VideoLinkStore` is injected directly. Functionally equivalent here; the interface seam is deferred to the capstone, where swapping in EF Core/Postgres makes it worthwhile. *Known gap — this was the planned OOP abstraction point.*
5. **Solution structure is a two-project monorepo**, not a single API project with a `client/` subfolder.
6. **`CreateVideoLinkRequest` carries more fields than planned** (`Platform`, `Title`, `ThumbnailUrl`), because platform detection and thumbnail derivation currently happen client-side.

## Known Limitations (accepted, not defects)
- **No JWT or token auth.** `{userId}` is taken from the route with nothing to prove the caller owns it, so any client that knows a GUID can read or delete that account's links. Explicitly deferred to the capstone; the MSSA rubric grades OOP and language fundamentals rather than auth hardening.
- **All data is in RAM.** Every account and link is lost on backend restart, including one triggered by Hot Reload. Only the seeded demo account survives, by design.
- **Thumbnails are YouTube-only.** TikTok would need a server-side oEmbed call; Instagram and Facebook removed `thumbnail_url` from their oEmbed responses effective Nov 3 2025 and require a Meta developer token regardless. Placeholders are used for all three. Moving derivation to a backend `VideoMetadataService` is a capstone task.
- **The add-link dialog is not fully keyboard-accessible.** It sets `role="dialog"`, `aria-modal` and `aria-labelledby`, but `aria-modal` does not trap focus; real focus-trapping needs a ref/effect pair, out of scope here.

## Pending Cleanup (non-blocking, tracked in `memory.md`)
- Three comments in `App.jsx` (on `links`, `signOut`, and `categoryList`) still refer to "mock data" as the seed source. `links`/`categoryList` now start empty per account and are populated from the real API on login — the comments are leftover from the pre-wiring version of the code and should be reworded before submission, but nothing they describe is functionally wrong.
