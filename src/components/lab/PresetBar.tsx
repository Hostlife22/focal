import { Aperture, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { PRESETS } from '../../lib/optics';
import type { LensPreset, PresetName } from '../../lib/optics';

interface PresetBarProps {
  activePreset: PresetName;
  onSelect: (preset: LensPreset) => void;
}

export function PresetBar({ activePreset, onSelect }: PresetBarProps) {
  return (
    <section className="presets-bar">
      <div className="presets-intro">
        <Aperture size={22} />
        <div>
          <h2>A place to start</h2>
          <p>Borrow a setup. Make it yours.</p>
        </div>
      </div>
      <div className="preset-options">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            className={`preset ${activePreset === preset.name ? 'selected' : ''}`}
            onClick={() => onSelect(preset)}
          >
            <span>
              {preset.name}
              {activePreset === preset.name ? (
                <Check size={13} />
              ) : (
                <ArrowUpRight size={13} />
              )}
            </span>
            <small>
              {preset.focalLength}mm <span>·</span> ƒ/{preset.aperture}
            </small>
          </button>
        ))}
      </div>
      <div className="custom-label">
        <span className="status-dot" />
        {activePreset} setup
        <ChevronDown size={14} />
      </div>
    </section>
  );
}
