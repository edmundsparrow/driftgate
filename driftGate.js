/**
 * DriftGate — signed deviation boundary primitive.
 *
 * Compares a value against a reference and classifies the signed
 * drift as ok, resist, or jam on the under/over side.
 *
 * The primitive contains no domain semantics:
 * positive/negative drift is not inherently good or bad.
 */

function driftGate(value, reference, {
  minHard,
  minSoft,
  maxSoft,
  maxHard
}) {
  const drift = value - reference;

  // Same guard as capacityGate.js: Infinity/-Infinity is the documented
  // way to disable a side (e.g. the 'projected' quorum sensor sets
  // maxSoft/maxHard: Infinity to mean "never trigger on the over side").
  // Without this, drift === Infinity too makes `Infinity >= Infinity`
  // true in JS and misfires jam even though the check was meant to be
  // off. Guard on the threshold being the disabling sentinel, not on
  // the value of `drift` -- a finite threshold must still correctly
  // jam against an Infinity drift.
  if (minHard !== -Infinity && drift <= minHard) {
    return { drift, state: 'jam', side: 'under' };
  }

  if (minSoft !== -Infinity && drift <= minSoft) {
    return { drift, state: 'resist', side: 'under' };
  }

  if (maxHard !== Infinity && drift >= maxHard) {
    return { drift, state: 'jam', side: 'over' };
  }

  if (maxSoft !== Infinity && drift >= maxSoft) {
    return { drift, state: 'resist', side: 'over' };
  }

  return { drift, state: 'ok' };
}

// Zero-dependency export: works as a plain <script> tag (attaches to
// window.driftGate) or as a CommonJS require — no build step needed.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.driftGate = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  return driftGate;
});
