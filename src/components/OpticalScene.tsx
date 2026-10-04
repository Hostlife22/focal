import { useSceneController } from '../hooks/useSceneController';
import { createOpticalScene } from '../scenes/createOpticalScene';
import type { OpticalSceneState } from '../scenes/createOpticalScene';

export function OpticalScene(props: OpticalSceneState) {
  const host = useSceneController(createOpticalScene, props);
  return (
    <div
      className="optical-canvas"
      ref={host}
      role="img"
      aria-label="Interactive 3D lens assembly. Drag to orbit and scroll to zoom."
    />
  );
}
