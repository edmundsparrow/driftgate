# DriftGate(): This is not a weekend challenge

This started with a weekend challenge about a dog.

It isn't really about the dog.

The dog is the **agent**.

The challenge gave me a small, ordinary environment in which to watch an agentic activity unfold. I wanted to see what happened when the agent's activity moved relative to something it was expected to be relative to.

That turned out to be the interesting part.

## The dog is the agent

A dog is useful here because it makes the idea visible without needing a complicated simulation.

The dog wants something. It moves. It encounters boundaries. Its activity can be observed relative to a reference: where it is expected to be, where it started, where it should remain, or where the system expects it to be.

The dog doesn't need to understand the model we're using.

Neither does an agent.

What matters is that **activity can move away from a reference**.

That is drift.

## The eye-opener

The weekend challenge was supposed to be a small game.

But while looking at the dog's activity, I started thinking less about the game and more about what the activity represented.

An agent can be active without being stationary.

Its current value can be above or below a reference. It can move farther away, move back toward it, or cross a tolerance boundary.

And once I started looking at agentic activity that way, a question appeared:

> What is the smallest primitive that can report how far an activity has drifted from a reference without deciding what that drift means?

That became the thesis.

**Drift should be measured before it is interpreted.**

## DriftGate

`driftGate()` is a small, stateless primitive for classifying signed deviation from a reference.

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
```

No classes. No state held between calls. No async. Give it two numbers and a bounds object, and it returns a classification.

That is the entire surface area.

## What it measures

Drift is signed displacement from a reference:

```text
drift = value - reference
```

Therefore:

```text
120 - 100 = +20  → over
100 - 120 = -20  → under
```

The magnitude alone is not enough. **Direction is part of the state.**

A value 20 above the reference and a value 20 below it are different situations.

## What DriftGate does not decide

`driftGate()` does not decide whether positive or negative drift is good or bad.

For one system:

```text
positive drift → success
negative drift → failure
```

For another:

```text
positive drift → failure
negative drift → success
```

The primitive only reports the signed displacement and its threshold state.

Domain-specific meaning belongs to the caller.

That is deliberate.

For an agentic system, this separation matters. The primitive can tell the surrounding system that activity is `over`, `under`, `resist`, or `jam` without pretending to know whether the agent's movement is desirable.

## Threshold model

```text
minHard       minSoft             maxSoft       maxHard
    │             │                   │             │
    ▼             ▼                   ▼             ▼
 ─── JAM ─── RESIST ───── OK ───── RESIST ─── JAM ───
    under                         over
```

The bounds may be asymmetric.

For example:

```js
{
  minHard: -50,
  minSoft: -10,
  maxSoft: 5,
  maxHard: 10
}
```

No assumption of symmetry is built into the primitive.

## Examples

### Positive drift

```js
driftGate(120, 100, {
  minHard: -30,
  minSoft: -10,
  maxSoft: 10,
  maxHard: 30
});
```

Result:

```js
{
  drift: 20,
  state: 'resist',
  side: 'over'
}
```

### Negative drift

```js
driftGate(100, 120, {
  minHard: -30,
  minSoft: -10,
  maxSoft: 10,
  maxHard: 30
});
```

Result:

```js
{
  drift: -20,
  state: 'resist',
  side: 'under'
}
```

### Zero drift

```js
driftGate(100, 100, {
  minHard: -30,
  minSoft: -10,
  maxSoft: 10,
  maxHard: 30
});
```

Result:

```js
{
  drift: 0,
  state: 'ok'
}
```

## Why `drift` is returned

`capacityGate()` can treat the measured value itself as the displacement because its reference is implicitly zero.

`driftGate()` has an explicit reference:

```text
value - reference
```

Returning `drift` means the caller does not have to recompute the deviation.

## Relationship to CapacityGate

`driftGate()` can be viewed as the more general primitive.

`capacityGate()` is its zero-reference specialization:

```text
driftGate(value, reference, bounds)
                 │
          reference = 0
                 ▼
capacityGate(load, bounds)
```

Formally:

```js
driftGate(load, 0, bounds)
```

has the same threshold mechanics as:

```js
capacityGate(load, bounds)
```

This does not require `capacityGate()` to be replaced or refactored. It remains a useful, named application-level specialization for load-versus-capacity problems.

## The thesis

The dog is the model.

The activity is the observation.

The reference is the point of comparison.

The drift is the signed displacement.

**DriftGate is the primitive for reporting that displacement before the system decides what it means.**

That distinction is the point.

An agent can be probabilistic. Its activity can be unpredictable. The measurement of its displacement from a reference does not have to carry the same ambiguity.

The primitive does not need to understand the agent.

It only needs to report where the activity currently stands relative to the reference.

## Design discipline

DriftGate intentionally contains no domain policy.

It does not contain:

- success/failure semantics
- convergence logic
- correction logic
- retry logic
- shutdown logic
- prediction
- memory of previous states

It is stateless.

The caller decides what to do with:

```js
{
  drift,
  state,
  side
}
```

That keeps the primitive reusable across different domains.

## The dog was just the beginning

So yes, this is a weekend challenge submission.

There is a dog. There is a game. There is an artifact at the end of it.

But the thing I actually walked away with was not another dog game.

It was a way of looking at agentic activity:

```text
agent
  ↓
activity
  ↓
reference
  ↓
signed drift
  ↓
DriftGate
  ↓
domain interpretation
```

The challenge supplied the dog.

The dog supplied the experiment.

The experiment exposed the drift.

And the drift led to the primitive.

---

**Status:** standalone primitive / weekend challenge experiment  
**Version:** 0.1.0  
**Author:** Edmund Sparrow / Gnoke Suite
