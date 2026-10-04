import { Aperture, ArrowUpRight, CircleHelp } from 'lucide-react';
import type { RefObject } from 'react';

interface SiteHeaderProps {
  onHelp: () => void;
  helpTrigger: RefObject<HTMLButtonElement | null>;
}

export function SiteHeader({ onHelp, helpTrigger }: SiteHeaderProps) {
  return (
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
        <button ref={helpTrigger} className="help-button" onClick={onHelp}>
          <CircleHelp size={17} /> How it works <ArrowUpRight size={15} />
        </button>
      </div>
    </header>
  );
}
