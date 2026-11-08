---
id: opt-fomo-tech-appendix
slug: fomo-tech-appendix
part: optional
part_title: Optional depth
order: 114
title: A technical FOMO list, translated
summary: Suraj’s “cancel your weekend” list is a pile of agent-infrastructure techniques. It is not a marketing plan. This appendix names what the items are so they are not mistaken for launch tactics.
read_min: 6
action_min: 5
takeaway: Most items on that list are engineering reliability problems. Marketing still starts with a customer and a sentence they understand.
min_action: Pick one item from the list and write whether it is marketing, product reliability, or neither.
min_action_output: One labeled item.
exercise: Group five listed techniques into “would help a marketer later,” “is only for builders,” or “I do not need this.” Stop after five.
exercise_min: 5
exercise_output: Five grouped items.
stop_when: You can see the list as infrastructure, not as a weekend marketing assignment.
optional: true
items:
  - id: opt-fomo-tech-appendix-i01
    kind: method
    statement: Suraj’s 2027 list includes computer-use agents, generative UI, a cheap/fast router for easy requests, durable workflows that can resume, an MCP server so other agents can call your product, constrained outputs, graders, injection proxies, privacy unmasking, cost kill-switches, and related serving tricks.
    attribution: source-method
    source_ids: [x-2118682313479573689]
    informed_by: [web-5bd78febd4a5]
---

# A technical FOMO list, translated

About 6 minutes to read. Optional exercise about 5 minutes. These are estimates.

Suraj posted a “cancel your weekend” list of things the “2027 meta” supposedly requires: agents that drive software with no API, interfaces generated as live components, a router that handles easy requests cheaply and sends hard ones to a heavier model, workflows that resume after a crash, a raw MCP server so other agents can call you, outputs forced into valid JSON, graders that block bad tool sequences, proxies that catch prompt injections and hide personal data, and cost kill-switches.

Those are real engineering ideas. A few connect to marketing later (an MCP server is what Taras needed for an agent marketplace; a cost kill-switch is Hunt’s “ask first” for spend). Most of them are how you keep an agent from breaking or leaking, not how you find a customer.

If the list makes you feel behind, that is the rhetorical trick. You can market something useful without a speculative-decoding gateway. Come back here if you become the person who builds the agent other marketers call.

## A concrete translation

“Write a raw MCP server” means: make a small, documented door so another assistant can call your product with limited permissions. That is why Taras could list a product on an agent marketplace. It is a product interface, not a launch post.

“Add a cost kill-switch” means: stop a loop before it spends more than you allowed. That is Hunt’s ask-first list, written as engineering.

“Build a computer-use agent that clicks around software with no API” is a reliability research problem. It is not how you decide what your homepage should say.

## What to do

**Under 2 minutes.** Label one item.

**Optional, about 5 minutes.** Group five items.

## You're done when

You can see the list as infrastructure.
