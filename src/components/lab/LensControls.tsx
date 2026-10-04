import { PanelHeader } from '../ui/PanelHeader';
import {
  Crosshair,
  Focus,
  Layers3,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { Slider } from '../Slider';
import { LENS_RANGES } from '../../lib/optics';
import type { LensSettings } from '../../lib/optics';

interface LensControlsProps {
  settings: LensSettings;
  onChange: <K extends keyof LensSettings>(
    key: K,
    value: LensSettings[K],
  ) => void;
  onReset: () => void;
}

export function LensControls({
  settings,
  onChange,
  onReset,
}: LensControlsProps) {
  return (
    <aside className="controls-panel">
      <PanelHeader
        title="Lens controls"
        leading={<SlidersHorizontal size={17} />}
        actions={
          <button className="text-button" onClick={onReset}>
            Reset <RotateCcw size={13} />
          </button>
        }
      />
      <div className="controls-body">
        <div className="control-section-title">
          <Focus size={16} />
          <span>THE FOCUS RING</span>
        </div>
        <Slider
          label="Focus distance"
          value={settings.focus}
          display={`${settings.focus.toFixed(1)} m`}
          min={LENS_RANGES.focus.min}
          max={LENS_RANGES.focus.max}
          step={LENS_RANGES.focus.step}
          start="0.5 m"
          end="10 m"
          onChange={(value) => onChange('focus', value)}
        />
        <Slider
          label="Aperture"
          value={settings.aperture}
          display={`ƒ / ${settings.aperture.toFixed(1)}`}
          min={LENS_RANGES.aperture.min}
          max={LENS_RANGES.aperture.max}
          step={LENS_RANGES.aperture.step}
          start="ƒ/1.4 · wide"
          end="ƒ/16 · narrow"
          onChange={(value) => onChange('aperture', value)}
        />
        <Slider
          label="Focal length"
          value={settings.focalLength}
          display={`${settings.focalLength} mm`}
          min={LENS_RANGES.focalLength.min}
          max={LENS_RANGES.focalLength.max}
          step={LENS_RANGES.focalLength.step}
          start="24 mm"
          end="85 mm"
          onChange={(value) => onChange('focalLength', value)}
        />
        <div className="control-divider" />
        <div className="control-section-title">
          <Layers3 size={16} />
          <span>LENS ELEMENTS</span>
        </div>
        <Slider
          label="Element separation"
          value={settings.spacing}
          display={`${settings.spacing} mm`}
          min={LENS_RANGES.spacing.min}
          max={LENS_RANGES.spacing.max}
          step={LENS_RANGES.spacing.step}
          start="Together"
          end="Apart"
          onChange={(value) => onChange('spacing', value)}
        />
        <div className="toggle-row">
          <span>
            <span className="ray-icon" /> Light rays
          </span>
          <button
            className="switch"
            role="switch"
            aria-checked={settings.rays}
            aria-label="Show light rays"
            onClick={() => onChange('rays', !settings.rays)}
          >
            <span />
          </button>
        </div>
        <div className="toggle-row">
          <span>
            <Crosshair size={16} /> Focal plane
          </span>
          <button
            className="switch"
            role="switch"
            aria-checked={settings.plane}
            aria-label="Show focal plane"
            onClick={() => onChange('plane', !settings.plane)}
          >
            <span />
          </button>
        </div>
      </div>
      <div className="control-tip">
        <Sparkles size={17} />
        <p>
          Small changes. Big difference.
          <br />
          <span>Try a wider aperture to soften the background.</span>
        </p>
      </div>
    </aside>
  );
}
