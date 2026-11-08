---
id: 16-be-findable
slug: be-findable
part: IV
part_title: Be findable
order: 16
title: Make the site possible to find
summary: Search cannot help a page that machines cannot read, that disagrees with itself, or that has no unique title. Most early search work is hygiene, not magic.
read_min: 9
action_min: 12
takeaway: Before you chase backlinks or new articles, make sure a search engine is allowed to see a clear page with a real title and a real author.
min_action: Pick a page you already have, or imagine one. Write a unique title and a one-sentence description that says what a searcher would find there.
min_action_output: One title and one description.
exercise: Walk Suraj Sharma’s checklist on paper. Mark each item “already true,” “not true,” “cannot check yet,” or “does not apply.” Do not connect a search account for the exercise.
exercise_min: 12
exercise_output: A marked checklist.
stop_when: You can explain the difference between “Google is not allowed to see this” and “this page is not useful yet,” and you have written one unique title.
optional: false
items:
  - id: 16-be-findable-i01
    kind: method
    statement: A practical search checklist includes server-rendered pages, a sitemap, allowing crawlers, removing accidental noindex tags, fixing redirects and broken links, canonical URLs, unique titles and descriptions, one H1, useful schema, internal links, image text and compression, stable layout, a real author, and links from sites people trust.
    attribution: source-method
    source_ids: [x-2116062550416871512, x-1697157681549897945]
    informed_by: []
  - id: 16-be-findable-i02
    kind: method
    statement: Rewrite text that sounds machine-generic, and do the last steps yourself earn trust and write as a real person.
    attribution: source-method
    source_ids: [x-2116062550416871512, x-1697157681549897945]
    informed_by: []
---

# Make the site possible to find

About 9 minutes to read. Optional exercise about 12 minutes. These are estimates.

Search engine optimization, often shortened to SEO, is the work of helping people find you through search. It is not a trick that puts you on page one by Monday. Suraj Sharma posted a checklist as a joke prompt for people who “vibe coded” a site (built it quickly with an assistant) and then wondered why it did not appear. He then says the joke is that the list really is the work.

You do not need to do every line this week. You do need to know which problems are “the page is invisible” and which are “the page is visible and still not worth choosing.”

## Let the page be seen

Several items on Suraj’s list are about permission and plumbing.

If a site only builds its text in the browser, some crawlers see an empty shell. Server-side rendering means the useful text exists in the page the server sends.

An XML sitemap is a file that lists your URLs so a search engine does not have to discover them by accident. Submitting it in Google Search Console is a later step if you choose to use that free tool. This lesson will not ask you to create an account.

robots.txt is a file that tells crawlers which paths they may request. A noindex tag tells them not to include a page even if they find it. Both are useful when you mean them. Both are disasters when a template leaves them on by accident.

Redirect chains (page A sends you to B, which sends you to C) waste time and confuse both people and crawlers. Broken links waste them too. A canonical URL is the address you want treated as the main copy when similar pages exist.

If these are wrong, better writing will not save you. The page is not really in the race.

## Make each page itself

Then come the human-facing basics:

- A unique title and description for every page
- One main heading (an H1) that matches what the page actually is
- Structured data such as FAQ or Article markup when it fits, so machines can label the page more clearly
- Breadcrumbs so people and crawlers can see where they are
- Internal links so orphan pages (pages nothing else points to) can be found
- Alt text that describes images, and images that are not huge
- A layout that does not jump around while it loads, and pages that load in a reasonable time (Suraj names a layout shift score under 0.1 and a load under two seconds as targets)

None of this requires a poetic brand voice. It requires that two pages are not titled “Home” and that a picture of a repair is not labeled “image1.”

## Then sound like a person

Suraj also says to rewrite anything that sounds like generic machine writing, add a real author with a real bio, and earn links from sites people trust. He tells people to paste the checklist into an assistant and to do those last two themselves.

That last instruction matters. An assistant can help you notice a missing title. It cannot live your experience, and it cannot make another trusted site mention you.

Kunal, in an older function-building thread, wrote that search is mostly about content and that everything else is secondary. The two views fit: plumbing gets you into the index, and useful pages give people a reason to choose you. The next lesson is about improving pages search already notices.

## A concrete example

A furniture-repair site whose every page is titled “Services” will look like one page to a tired searcher. “Same-week chair repair in Utrecht” is a title. “We fix chairs” is a hope. A missing sitemap and an accidental noindex tag would hide even the better title.

## Hypothetical Maal example

This example is invented for teaching.

A unique title might be “ADHD dinner decisions, without another meal plan to maintain.” A generic title would be “Home | Maal.” If the product site blocked crawlers during private testing and forgot to lift the block, no amount of clever phrasing would help.

## What to do

**Under 2 minutes.** Write a unique title and a one-sentence description for one page.

**Optional, about 12 minutes.** Walk Suraj’s checklist on paper. Mark each line “already true,” “not true,” “cannot check yet,” or “does not apply.” Do not create a search-console account for the exercise.

## You're done when

You can tell an invisible page from an unhelpful one, and you have written one unique title.
