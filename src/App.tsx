import { useCallback, useRef, useState } from 'react';
import { useCameraLab } from './hooks/useCameraLab';
import { useNotice } from './hooks/useNotice';
import { SiteHeader } from './components/layout/SiteHeader';
import { PageHeading } from './components/layout/PageHeading';
import { SiteFooter } from './components/layout/SiteFooter';
import { LensExplorer } from './components/lab/LensExplorer';
import { LensControls } from './components/lab/LensControls';
import { PreviewPanel } from './components/lab/PreviewPanel';
import { DepthOfFieldPanel } from './components/lab/DepthOfFieldPanel';
import { PresetBar } from './components/lab/PresetBar';
import { HelpDialog } from './components/ui/HelpDialog';
import { Toast } from './components/ui/Toast';

export default function App() {
  const lab = useCameraLab();
  const { message, notify } = useNotice();
  const [helpOpen, setHelpOpen] = useState(false);
  const helpTrigger = useRef<HTMLButtonElement>(null);
  const closeHelp = useCallback(() => setHelpOpen(false), []);
  const resetLab = () => {
    lab.reset();
    notify('Lab reset to its starting position');
  };
  return (
    <div className="app-shell">
      <a className="skip-link" href="#lab">
        Skip to the camera lab
      </a>
      <SiteHeader helpTrigger={helpTrigger} onHelp={() => setHelpOpen(true)} />
      <main id="lab">
        <PageHeading />
        <div className="workspace">
          <LensExplorer
            settings={lab.settings}
            view={lab.view}
            resetKey={lab.resetKey}
            onViewChange={lab.changeView}
            onExplodedChange={(value) => lab.changeSetting('exploded', value)}
            onResetView={lab.resetView}
            onNotice={notify}
          />
          <LensControls
            settings={lab.settings}
            onChange={lab.changeSetting}
            onReset={resetLab}
          />
          <PreviewPanel
            settings={lab.settings}
            captureKey={lab.captureKey}
            onFocus={(value) => lab.changeSetting('focus', value)}
            onCapture={lab.capture}
            onCaptured={() => notify('Snapshot saved as a PNG')}
          />
          <DepthOfFieldPanel settings={lab.settings} />
        </div>
        <PresetBar
          activePreset={lab.activePreset}
          onSelect={lab.selectPreset}
        />
      </main>
      <SiteFooter />
      <Toast message={message} />
      {helpOpen && <HelpDialog onClose={closeHelp} />}
    </div>
  );
}
