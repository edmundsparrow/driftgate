---
title: "DriftGate(): Reporting Signed Deviation, Not Deciding What It Means"
published: false
description: "A small, stateless primitive that classifies signed drift from a reference into ok/resist/jam — and refuses to tell you whether that drift is good or bad."
tags: javascript, architecture, webdev, opensource
---

`capacityGate()` answered one question: *how close is this value to a hard limit, measured from zero?*

That worked as long as the thing you cared about had a fixed floor. Load against capacity. Usage against a ceiling. Zero was always the honest starting point.

Then a simpler question broke that assumption:

> What if the thing you're comparing against isn't zero — it's a target that itself moves?

That's not a capacity problem anymore. That's a **drift** problem.

## The primitive

```js
function driftGate(value, reference, {
  minHard,
  minSoft,
  maxSoft,
  maxHard
}) {
  const drift = value - reference;

  if (drift <= minHard)
    return { drift, state: 'jam', side: 'under' };

  if (drift <= minSoft)
    return { drift, state: 'resist', side: 'under' };

  if (drift >= maxHard)
    return { drift, state: 'jam', side: 'over' };

  if (drift >= maxSoft)
    return { drift, state: 'resist', side: 'over' };

  return { drift, state: 'ok' };
}

export { driftGate };
```

No classes. No state held between calls. No async. Give it two numbers and a bounds object, get a classification back. That's the entire surface area.

## What it measures

Drift is signed displacement from a reference:

```
drift = value - reference
```

```
120 - 100 = +20   → over
100 - 120 = -20   → under
```

The magnitude alone doesn't tell you enough. **Direction is part of the state.** A value 20 above reference and a value 20 below reference are not the same situation, even though `capacityGate()` — measuring only against zero — would have no way to distinguish "above" from "below" in the first place.

## What it deliberately does not decide

`driftGate()` will not tell you whether positive or negative drift is good.

For a thermostat, positive drift (too hot) and negative drift (too cold) are both undesirable in different directions. For a savings target, negative drift (under target) is the failure mode and positive drift is fine. For a scheduling system, drift ahead of reference might mean you're early; drift behind might mean you're late — and "early" isn't automatically good either.

The primitive has no opinion. It reports:

```js
{ drift, state, side }
```

and stops there. Whatever `over` or `under` *means* — success, failure, danger, margin, slack — belongs entirely to the caller. That's not an omission. It's the design.

## Threshold model

```
   minHard       minSoft             maxSoft       maxHard
      │             │                   │             │
      ▼             ▼                   ▼             ▼
   ─── JAM ─── RESIST ───── OK ───── RESIST ─── JAM ───
      under                          over
```

Five zones, four thresholds, and no requirement that the bounds be symmetric:

```js
{
  minHard: -50,
  minSoft: -10,
  maxSoft: 5,
  maxHard: 10
}
```

A system can tolerate a lot of undershoot and very little overshoot, or the reverse. `driftGate()` doesn't assume the tolerance is the same in both directions, because most real reference-tracking problems aren't symmetric either.

## Examples

**Positive drift**

```js
driftGate(120, 100, { minHard: -30, minSoft: -10, maxSoft: 10, maxHard: 30 });
// { drift: 20, state: 'resist', side: 'over' }
```

**Negative drift**

```js
driftGate(100, 120, { minHard: -30, minSoft: -10, maxSoft: 10, maxHard: 30 });
// { drift: -20, state: 'resist', side: 'under' }
```

**Zero drift**

```js
driftGate(100, 100, { minHard: -30, minSoft: -10, maxSoft: 10, maxHard: 30 });
// { drift: 0, state: 'ok' }
```

## Why `drift` is part of the return value

`capacityGate()` could get away with treating the raw value as the displacement, because its reference is implicitly zero — the value *is* the drift.

`driftGate()` has an explicit, independent reference, so the displacement has to be computed before it can be classified. Returning `drift` alongside `state` and `side` means the caller never has to redo `value - reference` themselves — the gate already did the subtraction it needed to do the classification, so it hands the number back.

## Relationship to CapacityGate

`driftGate()` is the more general primitive. `capacityGate()` is its zero-reference specialization:

```
driftGate(value, reference, bounds)
                 │
          reference = 0
                 ▼
capacityGate(load, bounds)
```

Formally, `driftGate(load, 0, bounds)` has identical threshold mechanics to `capacityGate(load, bounds)`. This doesn't obsolete `capacityGate()` — it remains a clearer, more direct name for the specific case where you're checking load against a fixed capacity and there's no reference to speak of. Not every caller needs to know their problem is a special case of a more general one.

## Design discipline

`driftGate()` contains no domain policy. It does not contain:

- success/failure semantics
- convergence or correction logic
- retry logic
- shutdown logic
- prediction
- memory of previous states

It is stateless — every call is independent, and nothing persists between them. The gate does not try to bring `value` back toward `reference`. It only reports where the two currently stand relative to each other.

That's the same discipline `capacityGate()` was built on: the boundary doesn't need to understand *why* a limit exists to enforce it. `driftGate()` extends that a step further — it doesn't even need the reference to hold still.

## Core idea

> Drift is not inherently bad. It is signed displacement from a reference.

Whether that displacement represents progress, failure, correction, acceleration, danger, or success is determined entirely by the system using the primitive — not by the primitive itself.

---

**Status:** standalone primitive
**Version:** 0.1.0
**Author:** Edmund Sparrow / Gnoke Suite
