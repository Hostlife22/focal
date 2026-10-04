import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { disposeScene } from '../lib/scene';
import type { LensSettings, ViewMode } from '../lib/optics';
import { createOpticalModel } from './opticalModel';
import { createRenderer, observeViewport, startAnimation } from './runtime';
import type { SceneFactory } from './runtime';

export interface OpticalSceneState {
  settings: LensSettings;
  view: ViewMode;
  resetKey: number;
}
const VIEW_POSITIONS: Record<ViewMode, [number, number, number]> = {
  perspective: [-7.5, 4.4, 8],
  side: [0, 0.7, 15],
  front: [-15, 0.2, 0.1],
};

export const createOpticalScene: SceneFactory<OpticalSceneState> = (
  host,
  initial,
) => {
  const renderer = createRenderer(host, { antialias: true, alpha: true }, 2);
  if (!renderer) return null;
  renderer.setClearColor(0x141b19, 0);
  const model = createOpticalModel();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 7;
  controls.maxDistance = 25;
  controls.maxPolarAngle = Math.PI * 0.85;
  let previous: OpticalSceneState | undefined;
  const update = (state: OpticalSceneState) => {
    if (
      !previous ||
      state.view !== previous.view ||
      state.resetKey !== previous.resetKey
    ) {
      camera.position.set(...VIEW_POSITIONS[state.view]);
      controls.target.set(0, 0, 0);
    }
    if (state.settings !== previous?.settings) model.update(state.settings);
    previous = state;
  };
  update(initial);
  const stopObserving = observeViewport(host, renderer, camera);
  const stopAnimation = startAnimation(() => {
    controls.update();
    renderer.render(model.scene, camera);
  });
  return {
    update,
    dispose: () => {
      stopAnimation();
      stopObserving();
      controls.dispose();
      disposeScene(model.scene);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
};
