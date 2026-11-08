# Content schema

## Lesson frontmatter

Required fields: `id`, `slug`, `part`, `part_title`, `order`, `title`, `summary`, `read_min`, `action_min`, `takeaway`, `min_action`, `min_action_output`, `exercise`, `exercise_min`, `exercise_output`, `stop_when`, `optional`.

`part` is `start`, `I`, `II`, `III`, `IV`, `V`, `VI`, or `optional`.

`items` is a list of teaching units:

```yaml
items:
  - id: 01-what-marketing-is-i01
    kind: principle | tactic | claim | finding | synthesis
    statement: One sentence.
    attribution: source-method | source-claim | source-tactic | source-finding | synthesis
    source_ids: [x-123]
    informed_by: []
    notes: Optional
```

## Status fields on sources

`retrieval_status` is how completely we could read the work (full, partial, missing).
`archive_status` is what was saved (full-text, partial-text, missing).
They are not the same thing. A source can be marked full-read in a live fetch and still have only a partial saved file. Lessons may only use what the saved text actually contains.

## App rendering

- Do not paste copyrighted articles into pages
- Keep names, links, and source ids when shortening copy
- If two people taught the same idea, show both
- Label `source-claim` as the creator’s claim
- Label `synthesis` as ours, and list `informed_by` as what shaped it
- Curator posts (`credit_role: curator`) credit the original author of the quoted work

## Progress

See `data/progress.schema.json`. Completion, bookmarks, and notes should work with local storage and no account.
