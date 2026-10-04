import { useSceneController } from '../hooks/useSceneController';
import { createViewfinderScene } from '../scenes/createViewfinderScene';
import type { ViewfinderSceneState } from '../scenes/createViewfinderScene';

export function Viewfinder(props: ViewfinderSceneState) {
  const host = useSceneController(createViewfinderScene, props);
  const { settings } = props;
  return (
    <div
      ref={host}
      className="viewfinder-canvas"
      role="img"
      aria-label="Live depth-of-field preview. Click a sphere to focus on it."
    >
      <span className="viewfinder-corner top-left" />
      <span className="viewfinder-corner top-right" />
      <span className="viewfinder-corner bottom-left" />
      <span className="viewfinder-corner bottom-right" />
      <span className="focus-reticle" />
      <span className="preview-label">LIVE VIEW</span>
      <span className="preview-spec">
        {settings.focalLength}mm · ƒ/{settings.aperture.toFixed(1)} ·{' '}
        {settings.focus.toFixed(1)}m
      </span>
    </div>
  );
}
