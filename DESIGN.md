# Design notes

## Product goals

This app is designed for a reader who wants to learn quickly, stop often, and return without guilt.
That led to a few hard constraints:

- no streaks, quotas, or fake achievements
- strong start/resume affordances
- calm typography over dashboard chrome
- core path and optional depth clearly separated
- full attribution preserved without crowding the main prose
- local-only progress by default, with no account expectations

## Information architecture

The experience is intentionally split into five simple destinations:

1. **Course**: start/resume, progress summary, prerequisite-ordered map
2. **Lesson pages**: one lesson at a time, with chunk navigation and visible done criteria
3. **Search**: find lessons, tactics, templates, and source context by topic
4. **Templates**: copy/download usable worksheets
5. **Sources**: attribution library with creator, limitations, and lesson backlinks

This keeps the navigation small enough for mobile while still exposing the source library and backup tools.

## Reading design

Lesson pages bias toward fast scanning:

- takeaway near the top
- read/action timing surfaced early
- "Under 2 minutes", optional exercise, and "You're done when" pinned near the reading
- section navigation with heading-level chunk jumps
- private notes beside the lesson rather than hidden in a separate tool

The prose column is intentionally narrow, with generous spacing and obvious heading breaks so a 10-12 minute lesson still feels interruptible.

## Credits and sources

The app preserves the authored distinctions between:

- methods
- creator claims
- findings
- synthesis

Credits are hidden behind an on-demand disclosure so the lesson body stays readable, but they never disappear. The source library exposes retrieval/archive limitations and backlinks for auditability.

## Local persistence

Completion, bookmarks, notes, and last-read section are stored in browser-local state only.

Important behavior:

- storage failures degrade gracefully to in-memory state for the current tab
- malformed saved data is reset with a visible warning
- export/import is explicit and user-driven

## Visual system

The UI uses custom CSS instead of a large component framework to keep the app lightweight and maintainable.

Key choices:

- warm neutral background with a soft blue accent
- strong focus outlines and large tap targets
- sticky top navigation and sticky desktop lesson sidebar
- reduced-motion support
- semantic headings and labels throughout

## Cloudflare Workers choices

The app uses `@sveltejs/adapter-cloudflare` with a real `wrangler.jsonc` for **Cloudflare Workers + Static Assets**.

Relevant deployment/runtime choices:

- Worker entry: `.svelte-kit/cloudflare/_worker.js`
- assets directory: `.svelte-kit/cloudflare`
- current compatibility date
- Workers observability/traces enabled in Wrangler config
- no server-side filesystem reads at runtime; course content is precompiled into generated app data

## Content pipeline

The committed `course/` directory is the editable source of truth.

`scripts/build-course-data.mjs`:

- reads the manifest, markdown lessons, templates, sources, credits, and progress schema
- rewrites internal markdown links to app routes
- renders safe HTML
- extracts section navigation headings
- validates course counts and cross-links
- generates typed app data for the Svelte routes

This keeps authored content editable in markdown/JSON while avoiding runtime parsing on Workers.
