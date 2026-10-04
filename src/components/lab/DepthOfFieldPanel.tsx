import { PanelHeader } from '../ui/PanelHeader';
import { depthOfField, distanceLabel, LENS_RANGES } from '../../lib/optics';
import type { LensSettings } from '../../lib/optics';

interface DepthOfFieldPanelProps {
  settings: LensSettings;
}

export function DepthOfFieldPanel({ settings }: DepthOfFieldPanelProps) {
  const dof = depthOfField(settings);
  const scaleMax = LENS_RANGES.focus.max;
  const percent = (distance: number) =>
    Math.min(100, Math.max(0, (distance / scaleMax) * 100));
  return (
    <section className="depth-panel">
      <PanelHeader
        title="Your depth of field"
        leading={<span className="panel-number">03</span>}
        actions={<span className="tiny-tag">IN REAL TIME</span>}
      />
      <div className="depth-values">
        <div>
          <span>NEAR LIMIT</span>
          <strong>{distanceLabel(dof.near)}</strong>
        </div>
        <div className="depth-main">
          <span>IN FOCUS</span>
          <strong>
            {Number.isFinite(dof.total) ? `${dof.total.toFixed(2)} m` : '∞'}
            <span> depth</span>
          </strong>
        </div>
        <div>
          <span>FAR LIMIT</span>
          <strong>{distanceLabel(dof.far)}</strong>
        </div>
      </div>
      <div className="depth-diagram">
        <div className="depth-line" />
        <div
          className="depth-zone"
          style={{
            left: `${percent(dof.near)}%`,
            width: `${percent(dof.far) - percent(dof.near)}%`,
          }}
        >
          <span />
          <span />
        </div>
        <div
          className="focus-marker"
          style={{ left: `${percent(settings.focus)}%` }}
        >
          <span />
          <small>{settings.focus.toFixed(1)} m</small>
        </div>
        <div className="depth-scale">
          <span>0 m</span>
          <span>2 m</span>
          <span>4 m</span>
          <span>6 m</span>
          <span>8 m</span>
          <span>10 m</span>
        </div>
      </div>
      <div className="depth-legend">
        <span>
          <i /> In-focus area
        </span>
        <span>Full frame · 0.03 mm circle of confusion</span>
      </div>
    </section>
  );
}
