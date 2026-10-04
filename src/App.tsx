import { useEffect, useRef, useState } from 'react';
import {
  Aperture,
  ArrowUpRight,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  Crosshair,
  Expand,
  Focus,
  Layers3,
  MoveHorizontal,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { OpticalScene } from './components/OpticalScene';
import { Viewfinder } from './components/Viewfinder';
import { Slider } from './components/Slider';
import {
  DEFAULT_SETTINGS,
  PRESETS,
  depthOfField,
  distanceLabel,
} from './lib/optics';
import type { LensSettings, ViewMode } from './lib/optics';

export default function App() {
  const [settings, setSettings] = useState<LensSettings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<ViewMode>('perspective');
  const [resetKey, setResetKey] = useState(0);
  const [captureKey, setCaptureKey] = useState(0);
  const [help, setHelp] = useState(false);
  const [notice, setNotice] = useState('');
  const [activePreset, setActivePreset] = useState<string>('Custom');
  const stage = useRef<HTMLElement>(null);
  const closeHelp = useRef<HTMLButtonElement>(null);
  const helpTrigger = useRef<HTMLButtonElement>(null);
  const dof = depthOfField(settings);
  function update<K extends keyof LensSettings>(
    key: K,
    value: LensSettings[K],
  ) {
    setSettings((previous) => ({ ...previous, [key]: value }));
    setActivePreset('Custom');
  }
  function reset() {
    setSettings({ ...DEFAULT_SETTINGS });
    setView('perspective');
    setResetKey((key) => key + 1);
    setActivePreset('Custom');
    setNotice('Lab reset to its starting position');
  }
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    if (!help) return;
    closeHelp.current?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setHelp(false);
        helpTrigger.current?.focus();
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        closeHelp.current?.focus();
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [help]);
  const fullscreen = () => {
    if (!stage.current?.requestFullscreen) {
      setNotice('Fullscreen is unavailable in this browser');
      return;
    }
    void stage.current
      .requestFullscreen()
      .catch(() => setNotice('Fullscreen could not be opened'));
  };
  return (
    <div className="app-shell">
      <a className="skip-link" href="#lab">
        Skip to the camera lab
      </a>
      <header className="site-header">
        <a
          href={import.meta.env.BASE_URL}
          className="brand"
          aria-label="Focal home"
        >
          <Aperture size={30} strokeWidth={1.5} />
          <span>
            focal<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="header-divider" />
        <span className="header-tagline">
          A little curiosity. A new perspective.
        </span>
        <div className="header-right">
          <span className="lab-pill">
            <span /> INTERACTIVE LAB
          </span>
          <button
            ref={helpTrigger}
            className="help-button"
            onClick={() => setHelp(true)}
          >
            <CircleHelp size={17} /> How it works <ArrowUpRight size={15} />
          </button>
        </div>
      </header>
      <main id="lab">
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" /> THE ART & SCIENCE OF SEEING
            </div>
            <h1>
              Find your focus<span>.</span>
            </h1>
            <p>Go inside the lens. Play with light. See what changes.</p>
          </div>
          <div className="heading-note">
            <span className="status-dot" /> A hands-on camera playground
            <br />
            <span>No gear needed. Just curiosity.</span>
          </div>
        </section>
        <div className="workspace">
          <section
            className="scene-panel"
            ref={stage}
            aria-label="3D lens explorer"
          >
            <div className="panel-top">
              <div className="panel-title">
                <span className="panel-number">01</span>
                <h2>Inside the lens</h2>
                <span className="tiny-tag">3D EXPLORER</span>
              </div>
              <button
                className="icon-button"
                onClick={fullscreen}
                aria-label="Expand 3D explorer"
              >
                <Expand size={17} />
              </button>
            </div>
            <div className="scene-content">
              <OpticalScene
                settings={settings}
                view={view}
                resetKey={resetKey}
              />
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
                <MoveHorizontal size={15} /> Drag to orbit <span>·</span> Scroll
                to zoom
              </div>
            </div>
            <div className="scene-toolbar">
              <div className="view-tabs" aria-label="Scene viewpoint">
                {(['perspective', 'side', 'front'] as const).map((mode) => (
                  <button
                    key={mode}
                    className={view === mode ? 'active' : ''}
                    aria-pressed={view === mode}
                    onClick={() => setView(mode)}
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
                  onClick={() => update('exploded', !settings.exploded)}
                >
                  <Layers3 size={15} /> Exploded view{' '}
                  <span className="mini-switch" />
                </button>
                <button
                  className="icon-button"
                  aria-label="Reset scene viewpoint"
                  onClick={() => setResetKey((key) => key + 1)}
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </section>
          <aside className="controls-panel">
            <div className="panel-top">
              <div className="panel-title">
                <SlidersHorizontal size={17} />
                <h2>Lens controls</h2>
              </div>
              <button className="text-button" onClick={reset}>
                Reset <RotateCcw size={13} />
              </button>
            </div>
            <div className="controls-body">
              <div className="control-section-title">
                <Focus size={16} />
                <span>THE FOCUS RING</span>
              </div>
              <Slider
                label="Focus distance"
                value={settings.focus}
                display={`${settings.focus.toFixed(1)} m`}
                min={0.5}
                max={10}
                step={0.1}
                start="0.5 m"
                end="10 m"
                onChange={(value) => update('focus', value)}
              />
              <Slider
                label="Aperture"
                value={settings.aperture}
                display={`ƒ / ${settings.aperture.toFixed(1)}`}
                min={1.4}
                max={16}
                step={0.1}
                start="ƒ/1.4 · wide"
                end="ƒ/16 · narrow"
                onChange={(value) => update('aperture', value)}
              />
              <Slider
                label="Focal length"
                value={settings.focalLength}
                display={`${settings.focalLength} mm`}
                min={24}
                max={85}
                step={1}
                start="24 mm"
                end="85 mm"
                onChange={(value) => update('focalLength', value)}
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
                min={0}
                max={40}
                step={1}
                start="Together"
                end="Apart"
                onChange={(value) => {
                  setSettings((previous) => ({
                    ...previous,
                    spacing: value,
                    exploded: true,
                  }));
                }}
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
                  onClick={() => update('rays', !settings.rays)}
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
                  onClick={() => update('plane', !settings.plane)}
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
          <section className="preview-panel">
            <div className="panel-top">
              <div className="panel-title">
                <span className="panel-number">02</span>
                <h2>Through the viewfinder</h2>
              </div>
              <span className="live-status">
                <span /> LIVE
              </span>
            </div>
            <Viewfinder
              settings={settings}
              captureKey={captureKey}
              onFocus={(value) => update('focus', value)}
            />
            <div className="preview-footer">
              <Crosshair size={14} />
              <span>Click an object to bring it into focus</span>
              <button
                className="capture-button"
                onClick={() => {
                  setCaptureKey((key) => key + 1);
                  setNotice('Snapshot saved as a PNG');
                }}
              >
                <Camera size={15} /> Capture
              </button>
            </div>
          </section>
          <section className="depth-panel">
            <div className="panel-top">
              <div className="panel-title">
                <span className="panel-number">03</span>
                <h2>Your depth of field</h2>
              </div>
              <span className="tiny-tag">IN REAL TIME</span>
            </div>
            <div className="depth-values">
              <div>
                <span>NEAR LIMIT</span>
                <strong>{distanceLabel(dof.near)}</strong>
              </div>
              <div className="depth-main">
                <span>IN FOCUS</span>
                <strong>
                  {Number.isFinite(dof.total)
                    ? `${dof.total.toFixed(2)} m`
                    : '∞'}
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
                  left: `${Math.min(100, dof.near * 10)}%`,
                  width: `${Math.max(0, Math.min(10, dof.far) - dof.near) * 10}%`,
                }}
              >
                <span />
                <span />
              </div>
              <div
                className="focus-marker"
                style={{ left: `${settings.focus * 10}%` }}
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
        </div>
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
                onClick={() => {
                  setSettings((previous) => ({ ...previous, ...preset }));
                  setActivePreset(preset.name);
                }}
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
      </main>
      <footer>
        <span>Made for the wonderfully curious.</span>
        <span>
          EXPLORE. EXPERIMENT. SEE DIFFERENTLY.
          <Aperture size={14} />
        </span>
      </footer>
      {notice && (
        <div className="toast" role="status">
          <Check size={16} />
          {notice}
        </div>
      )}
      {help && (
        <div
          className="modal-backdrop"
          onClick={() => {
            setHelp(false);
            helpTrigger.current?.focus();
          }}
        >
          <section
            className="help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeHelp}
              className="icon-button modal-close"
              aria-label="Close help"
              onClick={() => {
                setHelp(false);
                helpTrigger.current?.focus();
              }}
            >
              <X size={20} />
            </button>
            <Aperture size={32} />
            <h2 id="help-title">A new way to see.</h2>
            <p>
              Drag the lens to explore it from every angle. Scroll or pinch to
              get closer.
            </p>
            <p>
              <strong>Focus distance</strong> moves the sharpest part of the
              image. Click a sphere in the viewfinder to focus on it.
            </p>
            <p>
              <strong>Aperture</strong> controls depth of field. Lower numbers
              create a softer background; higher numbers keep more in focus.
            </p>
            <p>
              <strong>Exploded view</strong> reveals the glass elements. Adjust
              their separation to explore the assembly.
            </p>
            <p className="help-footnote">
              An educational visualization. Depth limits use the thin-lens
              model; the exploded assembly illustrates ray paths.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
