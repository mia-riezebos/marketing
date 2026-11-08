# Editing course content

## Source of truth

All editable teaching content in this repository lives under:

- `course/content/` — lesson and template markdown
- `course/data/COURSE.json` — module/template index
- `course/data/sources.json` — source library
- `course/data/item-credits.json` — item-level attribution
- `course/data/progress.schema.json` — browser-local progress contract

Do **not** edit files under `src/lib/generated/` by hand. They are regenerated.

## Typical workflow

1. Edit the markdown or JSON under `course/`
2. Regenerate app data:

```bash
pnpm run course:build
```

3. Run checks:

```bash
pnpm run check
pnpm run test:unit -- --run
pnpm run test:e2e
pnpm run narration:export
```

## Lesson authoring expectations

Lesson files keep their authored frontmatter and body structure.

The app expects each lesson to preserve fields such as:

- `id`
- `slug`
- `part`
- `part_title`
- `order`
- `title`
- `summary`
- `read_min`
- `action_min`
- `takeaway`
- `min_action`
- `min_action_output`
- `exercise`
- `exercise_min`
- `exercise_output`
- `stop_when`
- `optional`

The markdown body is rendered as lesson content, and second-level headings become section-jump targets in the lesson sidebar.

## Templates

Template files under `course/content/templates/` are exposed as:

- rendered preview
- copy-to-clipboard markdown
- downloadable `.md` files

Keep them plain, copyable markdown.

## Sources and credits

`sources.json` and `item-credits.json` are meant to preserve attribution fidelity:

- keep multiple credits when overlap exists
- keep creator claims distinct from findings and synthesis
- preserve retrieval/archive limitations
- do not fabricate coverage for missing or partial sources

## Local preview and deployment

### Local Worker preview

```bash
pnpm run build
pnpm run preview
```

### Deploy to Cloudflare Workers later

Prerequisites:

- authenticated Wrangler session or API token for the target Cloudflare account
- a `workers.dev` subdomain or custom-domain setup in that account

Command:

```bash
pnpm run build
pnpm exec wrangler deploy
```

This project targets **Cloudflare Workers with Static Assets**, not Pages and not Vercel.

## Narration prep exports

To regenerate the narration-ready text exports and count reports:

```bash
pnpm run narration:export
```

This writes:

- `reports/narration/lessons/*.txt`
- `reports/narration/templates/*.txt`
- `reports/narration/modules/*.txt`
- `reports/narration/manifest.json`
- `reports/narration/counts.md`
- `reports/narration/counts.json`
