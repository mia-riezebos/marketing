---
id: 23-write-down-what-you-learned
slug: write-down-what-you-learned
part: VI
part_title: Work with agents without giving up judgment
order: 23
title: Write down what you learned, not everything that happened
summary: Useful memory is a small set of validated lessons and exact facts you will need again. A huge archive of live details goes stale and hides the point.
read_min: 11
action_min: 12
takeaway: Save the rule and how you know it is true. Do not save a play-by-play of a week that will be outdated on Monday.
min_action: Write one lesson from your own work in two lines the rule, and how you know it.
min_action_output: A two-line memory note.
exercise: Create a tiny memory page for your practice idea current goal, two validated lessons with sources, and any exact promise or phrase that must be quoted rather than summarized. Leave live weekly metrics out on purpose.
exercise_min: 12
exercise_output: A one-page memory note with a dated goal and two lessons.
stop_when: You can explain why a shared summary table can lose facts, and you have written at least one lesson with its proof attached.
optional: false
items:
  - id: 23-write-down-what-you-learned-i01
    kind: finding
    statement: Memory that stores tested rules and current goals beat memory that archived every changing detail. In a Pokémon evaluation, a model that wrote hundreds of files progressed less than a model that kept a small set of plans and learned rules.
    attribution: source-finding
    source_ids: [web-anthropic-agent-memory]
    informed_by: []
    notes: Anthropic evaluation, described by Lance Martin with editorial guidance. Game progress is the study’s measure, not a marketing metric.
  - id: 23-write-down-what-you-learned-i02
    kind: finding
    statement: Writing down a verified fact is a prediction that a future session will want to rely on it. Stronger memory notes included the rule and how the agent knew the rule was true.
    attribution: source-finding
    source_ids: [web-anthropic-agent-memory]
    informed_by: []
  - id: 23-write-down-what-you-learned-i03
    kind: finding
    statement: When several agents wrote a shared table of contract terms at once, 41 of 57 graded facts survived. When one agent per contract wrote its own page and quoted terms word for word, 57 of 57 survived.
    attribution: source-finding
    source_ids: [web-anthropic-agent-memory]
    informed_by: []
  - id: 23-write-down-what-you-learned-i04
    kind: method
    statement: Quote exact promises, banned phrases, and other contract-like facts instead of summarizing them into a shared table that many writers can overwrite.
    attribution: source-method
    source_ids: [web-anthropic-agent-memory]
    informed_by: [firstparty-course-design]
---

# Write down what you learned, not everything that happened

About 11 minutes to read. Optional exercise about 12 minutes. These are estimates.

If you work with assistants across many sessions, you will be tempted to save everything: every draft, every chat, every weekly number. Anthropic’s writing on agent memory, published with Lance Martin and editorial colleagues, suggests that more files are not the same as more knowledge.

By agent memory they mean knowledge an assistant gains from experience and keeps between sessions, as notes it can read later. That is different from changing the model itself, from what it learns inside one conversation, and from summaries that replace old turns so a long chat can continue.

## Save lessons, not a stale diary

In one evaluation they compared memory folders from two models playing Pokémon after about 10,000 steps.

One model assumed everything might matter and wrote hundreds of files across hundreds of folders, often a file per battle, item, or character. The game state kept changing, so the archive went stale. The model then spent its time tending files instead of playing. Around step 10,000 it created and deleted several files in a short span and took no actions in the game. It earned one badge.

The other model wrote a handful of files: a dashboard with the current goal and a plan, plus notes about routes and strategies it had actually learned. Details you can read off the screen every turn, such as money or map position, were not worth storing. Strategy, plans, and tested rules exist only if you work them out, and they disappear unless you write them down. After several failed attempts to catch an easy creature, it wrote a timing rule that had just worked. It earned four badges.

The portable idea: memory should hold what a future you cannot simply look up. A live visitor count does not belong in a lasting note. “Titles that only name the category got almost no clicks on our own pages” does, if you attach how you know.

Writing down a verified fact, they write, is a prediction: a future session will want to rely on it without checking again. In their learning-loop tests, stronger notes included the rule and how the agent knew the rule was true, plus warnings about traps it had already hit. Weaker notes were scattered untested guesses.

## Check notes against reality

A wrong note, trusted later, can send you in a loop. In the same Pokémon work, an incorrect landmark made the model think a cave was finished when it was not. When they let the system review notes against the original transcript (they call this dreaming), the error was caught and rewritten, and progress resumed. With the uncorrected note, the run kept falling back to an earlier route.

You do not need their research setup to use the idea. When you save a lesson, keep a pointer to the evidence: the page, the interview phrase, the dated test card. If a later week disagrees, update the lesson. Do not let an old summary outrank a new fact.

They also found that telling a capable model only that a memory folder exists can be enough, and that a rigid rule such as “record only failures” can remove much of the benefit. For older, weaker setups, they had to prompt the model to read its notes and test its theories. The beginner habit is simpler: when you start a session, read the small memory page first.

## Exact words, one writer

The sharpest finding for anyone who keeps shared notes is about contracts.

In a legal-brief benchmark, several agents wrote at the same time into a shared table of contract terms. When a brief was graded from that wiki, only 41 of 57 facts survived. The shared table had summarized poorly, and agents had overwritten one another.

When they changed the instructions so each contract had its own page, written by a single agent, quoting terms word for word instead of summarizing them into a shared table, 57 of 57 facts survived.

If your product has locked phrases, pricing rules, legal claims, or (in a later team) lines you have agreed not to invent, do not let five assistants paraphrase them into one cell. Give those facts their own place, quote them, and let one writer update them.

This course already treats some phrases that way when it uses a hypothetical Maal example. Locked lines such as “dinner, decided” are the kind of fact you quote, not the kind you let a model improve into something catchier.

A memory page that grows larger than the work it describes has also failed. In one of their tests, a wiki became bigger than the source files and abstracted nothing. Keep the top layer small: current goal, a few validated lessons, links to deeper evidence.

## A concrete example

A repair shop’s useful memory page might say: current goal is to learn whether movers will mention the shop; lesson one is that “same-week” matters more than “quality,” based on five conversations dated and saved; lesson two is that the homepage must mention deposits because three people asked; the exact promise is “same-week chair repair,” quoted, not rewritten as “fast luxury restoration.” It would not save every daily page-view number.

## Hypothetical Maal example

This example is invented for teaching.

A useful note: “Dinner is a decision problem, not a recipe problem. Source: phrases copied from public ADHD forum posts and two conversations with people we already know.” The locked hypothetical lines stay quoted. A stale archive of every leftover prompt about macros does not.

## What to do

**Under 2 minutes.** Write one lesson in two lines: the rule, and how you know.

**Optional, about 12 minutes.** Make a tiny memory page: current goal, two validated lessons with sources, and any phrase that must be quoted. Leave live weekly metrics out.

## You're done when

You can explain why a shared summary table can lose facts, and you have at least one lesson with its proof attached.
