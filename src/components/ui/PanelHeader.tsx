import type { ReactNode } from 'react';

interface PanelHeaderProps {
  title: string;
  leading?: ReactNode;
  badge?: string;
  actions?: ReactNode;
}

export function PanelHeader({
  title,
  leading,
  badge,
  actions,
}: PanelHeaderProps) {
  return (
    <div className="panel-top">
      <div className="panel-title">
        {leading}
        <h2>{title}</h2>
        {badge && <span className="tiny-tag">{badge}</span>}
      </div>
      {actions}
    </div>
  );
}
