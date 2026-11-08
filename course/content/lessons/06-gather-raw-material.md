---
id: 06-gather-raw-material
slug: gather-raw-material
part: I
part_title: See clearly
order: 6
title: Gather raw material before you ask an assistant
summary: Fast market research is not “summarize this market.” It is collecting real pages, reviews, and complaints, then asking questions that force a challenge.
read_min: 10
action_min: 12
takeaway: An assistant cannot invent industry scars. It can help you notice patterns in material you actually collected.
min_action: Write three public places where people already complain about the category you are practicing on.
min_action_output: Three named public places, such as a review site, a forum, or a support thread.
exercise: Read five public reviews or forum posts in that category. Copy five phrases people used. Then write one question that would force an assistant to challenge your current idea, not praise it.
exercise_min: 12
exercise_output: Five copied phrases and one challenge question.
stop_when: You can explain why raw material comes before a prompt, and you have at least a few phrases that did not come from your own draft.
optional: false
items:
  - id: 06-gather-raw-material-i01
    kind: method
    statement: Start go-to-market research by feeding raw material competitor sites, incumbent earnings calls, more than 100 reviews, and forum threads where people vent.
    attribution: source-method
    source_ids: [x-2118657239217041552, x-2119091729181880583]
    informed_by: []
    notes: Guillaume Bardet authored this. Roman later shared the post.
  - id: 06-gather-raw-material-i02
    kind: method
    statement: Ask questions that force thinking, not summarizing, including what winners know that customers would not admit, and which industry beliefs would have to be false.
    attribution: source-method
    source_ids: [x-2118657239217041552, x-2119091729181880583]
    informed_by: []
  - id: 06-gather-raw-material-i03
    kind: method
    statement: Steelman your best angle the way a careful investor would, then show exactly where it fails. Repeat. The result is still a hypothesis.
    attribution: source-method
    source_ids: [x-2118657239217041552]
    informed_by: []
  - id: 06-gather-raw-material-i04
    kind: method
    statement: Customer research can also start from a large set of existing reviews when you cannot yet run interviews.
    attribution: source-method
    source_ids: [x-2118984119988236662, x-1697157685941326148]
    informed_by: [x-2118657239217041552]
    notes: Korzhov describes research from about 5,000 reviews as one marketing-engineering step.
---

# Gather raw material before you ask an assistant

About 10 minutes to read. Optional exercise about 12 minutes. These are estimates.

A prompt like “research the market for note-taking apps” will get you a tidy summary. Tidy summaries sound smart and hide what people are actually angry about.

Guillaume Bardet describes a faster go-to-market research method. He says a version of it is taught at Y Combinator, and that it can turn weeks of wandering into a few focused hours. That time claim is his. The method is what we can reuse. Roman later shared the post. Guillaume wrote it.

He also mentions a tool, Gojiberry, for finding people to test a hypothesis with. That is his promotion. This lesson does not ask you to sign up for it.

## What “raw material” means

You start by collecting things that already exist in public, not by asking a model to imagine the industry.

Guillaume’s list:

- 25 to 40 competitor websites, including pricing pages, case studies, and docs
- Recent earnings calls from the three to five biggest incumbents, when those exist
- More than 100 customer reviews from places like G2, Capterra, Trustpilot, or app stores
- Forum or Reddit threads where people vent about the category

You do not need all of that on day one, and this course does not ask you to scrape sites or buy tools. The point is the kind of evidence: words customers already typed when they were not performing for you.

Dmitry Korzhov later names a nearby move: customer research from a very large review set (he says about 5,000). Same idea at a bigger scale. The reviews are the raw material. The model is the sorter.

## Questions that force thinking

Once you have material, Guillaume says not to ask for a summary. Ask questions that create tension.

Two he offers:

1. “What do the winners in this market know that their customers would never admit?”
2. “List the beliefs this whole industry takes for granted. For each one, what would need to happen for it to be false?”

In a short pass, he writes, you start to see where everyone agrees, where everyone is blind, and which pains nobody is building for.

Then you flip it. Take your best angle and ask the assistant to steelman it. A steelman is the strongest fair version of an attack on your idea, not a cartoon of a critic. Guillaume’s prompt shape is: steelman this thesis the way a careful investor would, then show exactly where it fails.

Do a few rounds. What you have at the end, he says, is a first go-to-market hypothesis that can sound experienced. It is still a hypothesis. The next lesson in this path already told you the rest: the real work starts when you talk to actual buyers.

## Why this saves you from a pretty lie

If you skip the raw material, the assistant will average the public internet. Averaged advice is how five competitors end up with the same homepage sentence.

If you collect complaints and then ask for a challenge, you are more likely to notice a neglected sentence. That sentence becomes positioning later, not because a model invented it, but because someone already used it.

## A concrete example

You are exploring a tool that helps freelancers send invoices. Competitor homepages all say “get paid faster.” Reviews say things like “I still had to chase the client on WhatsApp” and “the tax export broke in March.” Earnings calls from a large payments company might mention chargebacks and late international transfers.

A summarizing prompt will return “the market wants faster payments.” A challenge prompt, pointed at those reviews, might return: winners know that “faster” often means “stop making me feel rude when I follow up.” That is a different product story.

## Hypothetical Maal example

This example is invented for teaching.

Competitor pages might talk about personalized meal plans and macro tracking. Public ADHD forum posts might say “I just want dinner to be decided” and “I abandon every planner by Wednesday.” The hypothesis is not “we are an AI meal planner.” The hypothesis is “dinner is a decision problem.” You would still have to test that with people.

## What to do

**Under 2 minutes.** Write three public places where people already complain about your category.

**Optional, about 12 minutes.** Read five public reviews or posts. Copy five phrases. Write one question that would force an assistant to attack your current idea.

Do not message the reviewers. Do not scrape behind a login you do not already have.

## You're done when

You can explain why raw material comes before a prompt, and you have a few phrases you did not write yourself.
