import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SETTINGS, PRESETS } from '../src/lib/optics.ts';
import { createInitialLabState, labReducer } from '../src/state/labReducer.ts';

const portrait = PRESETS[0];

test('applying presets only changes optical values, not diagram controls', () => {
  const initial = createInitialLabState();
  initial.settings.rays = false;
  initial.settings.spacing = 12;
  const next = labReducer(initial, { type: 'select-preset', preset: portrait });
  assert.equal(next.activePreset, 'Portrait');
  assert.equal(next.settings.focalLength, 85);
  assert.equal(next.settings.rays, false);
  assert.equal(next.settings.spacing, 12);
  assert.deepEqual(
    Object.keys(next.settings).sort(),
    Object.keys(DEFAULT_SETTINGS).sort(),
  );
  assert.equal(initial.settings.focalLength, 50);
});

test('changing separation opens the assembly and marks a preset as custom', () => {
  let state = labReducer(createInitialLabState(), {
    type: 'select-preset',
    preset: portrait,
  });
  state = labReducer(state, {
    type: 'change-settings',
    patch: { exploded: false },
  });
  state = labReducer(state, {
    type: 'change-settings',
    patch: { spacing: 20 },
  });
  assert.equal(state.settings.exploded, true);
  assert.equal(state.settings.spacing, 20);
  assert.equal(state.activePreset, 'Custom');
});

test('reset restores settings and viewpoint without triggering a snapshot', () => {
  let state = labReducer(createInitialLabState(), { type: 'capture' });
  state = labReducer(state, { type: 'change-view', view: 'side' });
  state = labReducer(state, { type: 'select-preset', preset: portrait });
  const reset = labReducer(state, { type: 'reset' });
  assert.deepEqual(reset.settings, DEFAULT_SETTINGS);
  assert.equal(reset.view, 'perspective');
  assert.equal(reset.activePreset, 'Custom');
  assert.equal(reset.captureKey, state.captureKey);
  assert.equal(reset.resetKey, state.resetKey + 1);
});

test('view reset preserves the selected viewpoint and all lens settings', () => {
  const state = labReducer(createInitialLabState(), {
    type: 'change-view',
    view: 'front',
  });
  const next = labReducer(state, { type: 'reset-view' });
  assert.equal(next.view, 'front');
  assert.strictEqual(next.settings, state.settings);
  assert.equal(next.resetKey, state.resetKey + 1);
});

test('initial states do not share mutable settings', () => {
  const first = createInitialLabState();
  first.settings.focus = 8;
  assert.equal(createInitialLabState().settings.focus, 3);
  assert.equal(DEFAULT_SETTINGS.focus, 3);
});
