import { PanelHeader } from '../ui/PanelHeader';
import { useRef } from 'react';
import { Expand, Layers3, MoveHorizontal, RotateCcw } from 'lucide-react';
import { OpticalScene } from '../OpticalScene';
import type { LensSettings, ViewMode } from '../../lib/optics';

interface LensExplorerProps {
  settings: LensSettings;
  view: ViewMode;
  resetKey: number;
  onViewChange: (view: ViewMode) => void;
  onExplodedChange: (value: boolean) => void;
  onResetView: () => void;
  onNotice: (message: string) => void;
}

export function LensExplorer({
  settings,
  view,
  resetKey,
  onViewChange,
  onExplodedChange,
  onResetView,
  onNotice,
}: LensExplorerProps) {
  const stage = useRef<HTMLElement>(null);
  const fullscreen = () => {
    if (!stage.current?.requestFullscreen) {
      onNotice('Fullscreen is unavailable in this browser');
      return;
    }
    void stage.current
      .requestFullscreen()
      .catch(() => onNotice('Fullscreen could not be opened'));
  };
  return (
    <section className="scene-panel" ref={stage} aria-label="3D lens explorer">
      <PanelHeader
        title="Inside the lens"
        leading={<span className="panel-number">01</span>}
        badge="3D EXPLORER"
        actions={
          <button
            className="icon-button"
            onClick={fullscreen}
            aria-label="Expand 3D explorer"
          >
            <Expand size={17} />
          </button>
        }
      />
      <div className="scene-content">
        <OpticalScene settings={settings} view={view} resetKey={resetKey} />
        <div className="scene-caption">
          <span className="lens-title">
            {settings.focalLength}mm prime lens
          </span>
          <span>6 elements · full-frame sensor</span>
        </div>
        <div className="plane-label">
          <span /> FOCAL PLANE
        </div>
        <div className="sensor-label">
          SENSOR <span />
        </div>
        <div className="scene-axis">
          <span>Y</span>
          <span>Z</span>
          <span>X</span>
        </div>
        <div className="scene-hint">
          <MoveHorizontal size={15} /> Drag to orbit <span>·</span> Scroll to
          zoom
        </div>
      </div>
      <div className="scene-toolbar">
        <div className="view-tabs" aria-label="Scene viewpoint">
          {(['perspective', 'side', 'front'] as const).map((mode) => (
            <button
              key={mode}
              className={view === mode ? 'active' : ''}
              aria-pressed={view === mode}
              onClick={() => onViewChange(mode)}
            >
              {mode === 'perspective' ? <Layers3 size={15} /> : null}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <div className="scene-tools">
          <button
            className={
              settings.exploded ? 'tool-button enabled' : 'tool-button'
            }
            aria-pressed={settings.exploded}
            onClick={() => onExplodedChange(!settings.exploded)}
          >
            <Layers3 size={15} /> Exploded view <span className="mini-switch" />
          </button>
          <button
            className="icon-button"
            aria-label="Reset scene viewpoint"
            onClick={onResetView}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
