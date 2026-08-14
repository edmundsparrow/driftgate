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
