import { useEffect, useRef } from 'react';
import { Aperture, X } from 'lucide-react';

interface HelpDialogProps {
  onClose: () => void;
}

export function HelpDialog({ onClose }: HelpDialogProps) {
  const closeHelp = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeHelp.current?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        event.preventDefault();
        closeHelp.current?.focus();
      }
    };
    window.addEventListener('keydown', handle);
    return () => {
      window.removeEventListener('keydown', handle);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
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
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <Aperture size={32} />
        <h2 id="help-title">A new way to see.</h2>
        <p>
          Drag the lens to explore it from every angle. Scroll or pinch to get
          closer.
        </p>
        <p>
          <strong>Focus distance</strong> moves the sharpest part of the image.
          Click a sphere in the viewfinder to focus on it.
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
          An educational visualization. Depth limits use the thin-lens model;
          the exploded assembly illustrates ray paths.
        </p>
      </section>
    </div>
  );
}
