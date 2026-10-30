# Ender Eye Triangulator

A Bedrock Script API addon project that records two Ender Eye observations and triangulates the target location from the intersection of the two sight lines.

## Included fixes

- Valid Bedrock manifest configuration for a Script API module.
- ES module import structure compatible with modern script runtimes.
- Corrected direction math using yaw/pitch conversion and normalized vectors.
- Triangulation using a robust line-intersection calculation.
- Safe event subscriptions to `itemUse` and `itemUseOn` for Ender Eye observations.

## Files

- `manifest.json` – top-level project manifest.
- `behavior_pack/manifest.json` – actual pack manifest used by the addon.
- `behavior_pack/scripts/triangulator.js` – pure geometry helpers and triangulation logic.
- `behavior_pack/scripts/main.js` – Bedrock event listeners and observation handling.

## Validation

Run:

```bash
npm run check:js
```

This validates the JavaScript syntax and checks the geometry helpers in a local Node environment.
