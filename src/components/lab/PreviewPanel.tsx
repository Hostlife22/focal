import { PanelHeader } from '../ui/PanelHeader';
import { Camera, Crosshair } from 'lucide-react';
import { Viewfinder } from '../Viewfinder';
import type { LensSettings } from '../../lib/optics';

interface PreviewPanelProps {
  settings: LensSettings;
  captureKey: number;
  onFocus: (value: number) => void;
  onCapture: () => void;
  onCaptured: () => void;
}

export function PreviewPanel({
  settings,
  captureKey,
  onFocus,
  onCapture,
  onCaptured,
}: PreviewPanelProps) {
  return (
    <section className="preview-panel">
      <PanelHeader
        title="Through the viewfinder"
        leading={<span className="panel-number">02</span>}
        actions={
          <span className="live-status">
            <span /> LIVE
          </span>
        }
      />
      <Viewfinder
        settings={settings}
        captureKey={captureKey}
        onFocus={onFocus}
        onCaptured={onCaptured}
      />
      <div className="preview-footer">
        <Crosshair size={14} />
        <span>Click an object to bring it into focus</span>
        <button className="capture-button" onClick={onCapture}>
          <Camera size={15} /> Capture
        </button>
      </div>
    </section>
  );
}
