import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_SETTINGS,
  PRESETS,
  depthOfField,
  distanceLabel,
} from '../src/lib/optics.ts';

test('50 mm at f/2.8 focused at 3 m matches reference limits', () => {
  const result = depthOfField(DEFAULT_SETTINGS);
  assert.ok(Math.abs(result.near - 2.729867) < 0.00001);
  assert.ok(Math.abs(result.far - 3.329467) < 0.00001);
  assert.ok(Math.abs(result.hyperfocal - 29.811905) < 0.00001);
});

test('stopping down expands the acceptable focus interval', () => {
  const wide = depthOfField({ ...DEFAULT_SETTINGS, aperture: 1.4 });
  const narrow = depthOfField({ ...DEFAULT_SETTINGS, aperture: 16 });
  assert.ok(narrow.near < wide.near);
  assert.ok(narrow.far > wide.far);
  assert.ok(narrow.total > wide.total);
});

test('longer focal length reduces depth at the same focus distance', () => {
  const wide = depthOfField({ ...DEFAULT_SETTINGS, focalLength: 24 });
  const tele = depthOfField({ ...DEFAULT_SETTINGS, focalLength: 85 });
  assert.ok(tele.total < wide.total);
});

test('landscape preset reaches an infinite far limit', () => {
  const landscape = PRESETS.find((preset) => preset.name === 'Landscape');
  assert.ok(landscape);
  const result = depthOfField({ ...DEFAULT_SETTINGS, ...landscape });
  assert.equal(result.far, Infinity);
  assert.equal(result.total, Infinity);
  assert.equal(distanceLabel(result.far), '∞');
});

test('all presets and slider extremes enclose the focus distance', () => {
  const settings = PRESETS.map((preset) => ({
    ...DEFAULT_SETTINGS,
    ...preset,
  }));
  for (const focus of [0.5, 10]) {
    for (const aperture of [1.4, 16]) {
      for (const focalLength of [24, 85]) {
        settings.push({ ...DEFAULT_SETTINGS, focus, aperture, focalLength });
      }
    }
  }
  for (const setting of settings) {
    const result = depthOfField(setting);
    assert.ok(result.near > 0 && result.near <= setting.focus);
    assert.ok(result.far >= setting.focus);
    assert.ok(result.total > 0);
  }
});

test('diagram-only settings do not change numeric optics', () => {
  assert.deepEqual(
    depthOfField({
      ...DEFAULT_SETTINGS,
      spacing: 40,
      exploded: false,
      rays: false,
      plane: false,
    }),
    depthOfField(DEFAULT_SETTINGS),
  );
  assert.equal(distanceLabel(3), '3.00 m');
});
