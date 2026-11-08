---
id: opt-super-agent-design
slug: super-agent-design
part: optional
part_title: Optional depth
order: 113
title: Super-agent design, in plain words
summary: DeepSeek’s writeup is about an always-on system that routes work to specialists instead of trapping every task in a separate chat. It is architecture, not a marketing channel.
read_min: 7
action_min: 6
takeaway: Isolated chats do not scale past a handful of jobs. A router plus specialists is closer to how a small team already works.
min_action: Write two jobs you would never put in the same chat, and why.
min_action_output: Two separated jobs.
exercise: Sketch a router and three named specialist roles on paper, including what each is forbidden to do. Do not build it.
exercise_min: 6
exercise_output: A four-box sketch.
stop_when: You can explain why session isolation becomes a management problem, and you know this module is optional architecture.
optional: true
items:
  - id: opt-super-agent-design-i01
    kind: method
    statement: Mainstream agents still treat a single isolated session as the unit of work, and a person can usually follow only a few active sessions. A super-agent design routes incoming work to specialist workers and keeps the human at higher-level decisions.
    attribution: source-method
    source_ids: [x-2116857257245987236, web-5bd78febd4a5]
    informed_by: [x-2118086670918750341]
    notes: The article discusses architectural ideas and is not an introduction to shipping DeepSeek product features.
---

# Super-agent design, in plain words

About 7 minutes to read. Optional exercise about 6 minutes. These are estimates.

DeepSeek’s harness team published a long piece (original in Chinese, with a translation in this corpus) about “super-agent” design. They say it is architectural thinking, not a tour of existing product features.

The problem they name: today’s agents usually live in isolated sessions. If you run several jobs, you switch between chats by hand and remember what each one contains. In their experience a person can follow about three to five active sessions. That ceiling is familiar if you have ever lost a thought in a pile of assistant tabs.

As models get better at using tools with less step-by-step help, the human role moves up to decisions and sign-off. Personal agents that watch mail and calendars are one example of always-on, event-driven work. The same pattern, they write, matters in commercial work such as software.

A super-agent, in their sketch, is closer to a dispatcher: it notices incoming work, sends it to specialist workers, and keeps you at the layer where judgment lives. That pairs with Hunt’s “one bot that reads the others” and with charters that forbid sending or paying.

You do not need this architecture to market a first product. It is here so the adjacent systems writing in the corpus is not silently dropped.

## What to do

**Under 2 minutes.** Name two jobs that should not share a chat.

**Optional, about 6 minutes.** Sketch a router and three specialists, including forbidden actions.

## You're done when

You can explain the session-isolation problem in ordinary words.
