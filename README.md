# driftGate

A tiny primitive for one question: **is this value drifting toward, away
from, or past a reference — and how far?**

```js
function driftGate(value, reference, { minHard, minSoft, maxSoft, maxHard }) {
  const drift = value - reference;
  if (drift <= minHard) return { drift, state: 'jam', side: 'under' };
  if (drift <= minSoft) return { drift, state: 'resist', side: 'under' };
  if (drift >= maxHard) return { drift, state: 'jam', side: 'over' };
  if (drift >= maxSoft) return { drift, state: 'resist', side: 'over' };
  return { drift, state: 'ok' };
}
```

Two numbers in, a state out. No dependencies. Not a correction mechanism —
an observability primitive that gives an application a vocabulary for how
far its activity has drifted from a reference, before anything decides
whether that drift is good or bad.

## Demo

**`demo.html`** — a 3D fenced yard: a dog, three plain walls, and one gate
wall. The dog attempts to move in any of four directions; every attempt
calls `driftGate()` against whichever boundary it's actually crossing —
`ok` / `resist` / `jam` — and the demo enforces exactly that. The three
plain walls have no resist zone at all (straight `ok` → `jam`, no
warning); only the gate wall gets a graduated `resist` zone and an
open/closed state. Opening or closing the gate only changes the bounds
object passed into `driftGate()` — the primitive itself never changes.

**`index.html`** (DriftSpring3D) — the original 3D value/reference demo:
value and reference as two points on a rail, with a spring between them
whose stretch/color reflects the current `ok` / `resist` / `jam` state.
Kept as a second, non-narrative demo of the primitive alone.

## Files

- `submission.md` — the actual DEV Weekend Challenge post, in the required
  template format (What I Built / Demo / Code / How I Built It). This is
  the one to paste into the challenge submission. Its Demo section points
  at `demo.html`.
- `demo.html` — the dog/fence/gate demo. Loads `driftGate.js` as a plain
  `<script src="./driftGate.js"></script>` and calls `driftGate()` on every
  attempted move — not just imported for show.
- `index.html` — the DriftSpring3D demo. Also loads `driftGate.js` as a
  plain classic script.
- `driftGate.js` — the standalone primitive, UMD-wrapped like `capacityGate.js`:
  works as a plain `<script>` (attaches `window.driftGate`) or via
  `require()` — no `export`, no build step.
- `preview.png` — OG/social-card image for the repo, matching `capacityGate`'s
  card layout (title, tagline, code excerpt, state strip, footer credit).
- `dog-gate.jpg` — cover photo used for `og:image`/`twitter:image` on the demo page.
- `dog.md` — the longer write-up connecting the DEV Weekend Challenge dog
  demo to the discovery of driftGate as a general primitive.
- `driftgate-post.md` — a separate, standalone technical post for
  `driftGate()` alone (not the challenge submission itself).
- `LICENSE` — MIT, same terms as capacityGate.

## Running it

`driftGate.js` is a plain classic script, so `demo.html` and `index.html`
can both be opened directly (`file://...`) with no local server required.
You can also serve it via GitHub Pages, matching capacityGate:
https://edmundsparrow.github.io/driftgate/

## What it shows

- `demo.html`: Three walls (west, north, south) are `jam`-only — no resist
  zone, no warning, straight refusal. The east wall is the **gate**:
  closed, it goes `ok` → `resist` → `jam` on approach, from either
  direction (re-entering from outside re-triggers the same check as
  leaving); open, the identical move reads `ok` well past where it used to
  jam. **Make Uncertain** demonstrates the one thing `driftGate()`
  deliberately doesn't do — escalate to a human — which lives at the
  application layer instead. On touch devices you can drag to orbit the
  camera; the on-screen controls rotate to match so they keep pointing
  where they actually move. On a mouse-only desktop the camera stays fixed
  and the controls never need to move.
- `index.html`: **Value** and **Reference** are independently adjustable;
  **Drift** = value − reference, computed by `driftGate()`, not the UI. The
  zone bands move with the reference — the tolerance window travels, it
  isn't fixed. The spring's stretch/color is a pure readout; nothing in the
  scene pulls the weight back toward the reference automatically.

## Relationship to capacityGate

`capacityGate(load, bounds)` is the zero-reference specialization of
`driftGate(load, 0, bounds)`. Same license, same author, same lineage.

## Author

Edmund Sparrow / Gnoke Suite