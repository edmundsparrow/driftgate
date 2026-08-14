---
title: "DriftGate(): This is not a weekend challenge"
published: false
description: "A weekend dog-game challenge turned into the discovery of a small, stateless primitive for reporting signed drift from a moving reference — before anything decides what that drift means."
tags: javascript, webdev, opensource, challenge
---

*This is a submission for [Weekend Challenge: Dog Days Edition](https://dev.to/challenges/weekend-2026-08-13)*

## What I Built

I started with the weekend challenge's small, ordinary dog prompt. But the dog isn't really the point — the dog is standing in for an **agent**. It wants something, it moves, it encounters boundaries, and its activity can be observed relative to a reference: where it's allowed to be, where the line sits, whether that line has moved.

Watching that unfold, the question that stuck with me wasn't "how do I make a fun dog game," it was:

> What is the smallest primitive that can report how far an activity has drifted from a reference — without deciding what that drift means, and without needing the agent to understand the boundary at all?

That question is what I actually built an answer to. `driftGate()` is a small, stateless function that classifies signed deviation (`value - reference`) into `ok`, `resist`, or `jam`, on the `under` or `over` side, using a bounds object (`minHard`, `minSoft`, `maxSoft`, `maxHard`). It doesn't know or care whether drifting above or below the reference is good or bad, and it doesn't know or care why a boundary exists — that judgment belongs entirely to whatever system is calling it. The dog and the gate are the visible wrapper; `driftGate()` is what came out of actually looking at it.

## Demo

**`demo.html`** — a dog in a yard, a fence, and a gate. The dog just keeps attempting to move. Every attempt calls `driftGate(dogPosition, gatePosition, bounds)` — the same primitive from `driftGate.js`, loaded as a plain `<script>` tag, unmodified — and the returned `{ drift, state, side }` decides what happens: `ok` lets the dog through, `resist` warns as it nears the gate, `jam` stops it cold.

Close the gate and the dog jams right at the boundary. Open it and — with no change to the dog's reasoning, no new rule learned — the identical attempted move now reads `ok` well past where it used to jam. Nothing about the agent changed. Only the bounds object handed to `driftGate()` changed. That's the whole thesis, made clickable.

There's also a **Make Uncertain** button that deliberately does something `driftGate()` itself can't: it escalates to "ask a human" instead of guessing. `driftGate()` only ever returns `ok`/`resist`/`jam` — the escalation is an application-layer choice built on top of it, not something the primitive knows how to do. Worth being honest about that boundary too.

Open `demo.html` directly in a browser (no server needed) to try it.

## Code

`driftGate.js` — the whole primitive, unmodified logic, no classes, no state between calls, no async:

```js
function driftGate(value, reference, {
  minHard,
  minSoft,
  maxSoft,
  maxHard
}) {
  const drift = value - reference;

  if (drift <= minHard) {
    return { drift, state: 'jam', side: 'under' };
  }

  if (drift <= minSoft) {
    return { drift, state: 'resist', side: 'under' };
  }

  if (drift >= maxHard) {
    return { drift, state: 'jam', side: 'over' };
  }

  if (drift >= maxSoft) {
    return { drift, state: 'resist', side: 'over' };
  }

  return { drift, state: 'ok' };
}
```

And here's the demo actually calling it, not just importing it for show:

```js
const result = driftGate(dogPosition, gatePosition, currentBounds());
// { drift: -40, state: 'resist', side: 'over' }  ← dog nearing a closed gate
// { drift: 0,   state: 'jam',    side: 'over' }  ← dog at the line, gate closed
// { drift: 0,   state: 'ok' }                    ← same position, gate now open
```

Full repo (this post's files) is attached below — `driftGate.js`, `demo.html`, `dog.md` (the longer write-up on how this led here), and `driftgate-post.md` (a standalone technical deep-dive on the primitive by itself).

## How I Built It

Drift is signed displacement from a reference:

```
drift = value - reference

120 - 100 = +20  → over
100 - 120 = -20  → under
```

Magnitude alone isn't enough — direction is part of the state. A value 20 above the reference and one 20 below it are different situations, and the primitive keeps that distinction instead of collapsing it.

The threshold model is five zones over four boundaries, and the bounds don't have to be symmetric:

```
   minHard       minSoft             maxSoft       maxHard
      │             │                   │             │
      ▼             ▼                   ▼             ▼
   ─── JAM ─── RESIST ───── OK ───── RESIST ─── JAM ───
      under                          over
```

The deliberate part of the design is everything `driftGate()` refuses to do. It has no success/failure semantics, no convergence or correction logic, no retry or shutdown logic, no prediction, and no memory of previous calls — it's stateless, full stop. For an agentic system, that separation matters: the primitive can tell the surrounding system that activity is `over`, `under`, `resist`, or `jam` without pretending to know whether the agent's movement is actually desirable. That judgment call — is drifting above the reference good news or bad news — is different for every domain, and `driftGate()` deliberately stays out of making it.

It also turns out to generalize an earlier primitive of mine, `capacityGate(load, bounds)`, which only ever measured load against an implicit zero. `capacityGate(load, bounds)` is just `driftGate(load, 0, bounds)` — the zero-reference special case. `driftGate()` extends that to a reference that isn't fixed, which is the part `capacityGate()` could never express on its own.

So yeah — there's a dog, there's a fence, there's a gate you can click open and closed. But what I actually walked away with from the weekend wasn't another dog toy. It was a reusable way of looking at any agent's activity: agent → activity → reference → signed drift → `driftGate()` → domain interpretation. The dog just supplied the excuse to go find it — and this time, the demo actually runs the primitive instead of just gesturing at it.

---

**Status:** standalone primitive / weekend challenge experiment
**Version:** 0.1.0
**Author:** Edmund Sparrow / Gnoke Suite
