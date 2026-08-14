# DriftSpring3D

A 3D demo of `driftGate()` — value and reference as two points on a rail,
with a spring between them whose stretch/color reflects the current
`ok` / `resist` / `jam` state.

## Files

- `submission.md` — the actual DEV Weekend Challenge post, in the required
  template format (What I Built / Demo / Code / How I Built It). This is
  the one to paste into the challenge submission.
- `index.html` — the demo. `driftGate.js` is loaded as a plain classic
  script (`<script src="./driftGate.js"></script>`) so the primitive stays a
  separate, inspectable file rather than being pasted inline. View source
  or check the network tab and you'll see it loaded as its own request.
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

`driftGate.js` is a plain classic script, so `index.html` can be opened
directly (`file://...`) with no local server required. You can also serve
it via GitHub Pages, matching capacityGate:
https://edmundsparrow.github.io/driftgate/

## What it shows

- **Value** and **Reference** are independently adjustable.
- **Drift** = value − reference, computed by `driftGate()`, not the UI.
- The zone bands (jam/resist/ok/resist/jam) are drawn relative to the
  reference and move with it — the tolerance window travels, it isn't fixed.
- The spring's stretch and color are a pure readout. Nothing in the scene
  pulls the weight back toward the reference automatically.

## Relationship to capacityGate

`capacityGate(load, bounds)` is the zero-reference specialization of
`driftGate(load, 0, bounds)`. Same license, same author, same lineage.

## Author

Edmund Sparrow / Gnoke Suite
