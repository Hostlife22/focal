import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { LENS_RANGES } from '../lib/optics';
import type { LensSettings } from '../lib/optics';
import { disposeScene } from '../lib/scene';
import { createViewfinderModel } from './viewfinderModel';
import { createRenderer, downloadSnapshot, observeViewport } from './runtime';
import type { SceneFactory } from './runtime';

export interface ViewfinderSceneState {
  settings: LensSettings;
  captureKey: number;
  onFocus: (distance: number) => void;
  onCaptured: () => void;
}
interface BokehUniforms {
  focus: THREE.IUniform<number>;
  aperture: THREE.IUniform<number>;
}
const SENSOR_HEIGHT_MM = 24;
const APERTURE_BLUR_SCALE = 0.018;

export const createViewfinderScene: SceneFactory<ViewfinderSceneState> = (
  host,
  initial,
) => {
  const renderer = createRenderer(
    host,
    { antialias: true, preserveDrawingBuffer: true },
    1.5,
  );
  if (!renderer) return null;
  const { scene, targets } = createViewfinderModel();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
  camera.position.set(0, 1.1, 0);
  camera.lookAt(0, 0.85, -3);
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  const bokeh = new BokehPass(scene, camera, {
    focus: initial.settings.focus,
    aperture: 0.006,
    maxblur: 0.025,
  });
  const outputPass = new OutputPass();
  composer.addPass(renderPass);
  composer.addPass(bokeh);
  composer.addPass(outputPass);
  // The upstream declaration omits these documented BokehPass uniforms.
  const uniforms = bokeh.uniforms as BokehUniforms;
  let current = initial;
  let previousSettings: LensSettings | undefined;
  let lastCapture = initial.captureKey;
  const update = (state: ViewfinderSceneState) => {
    current = state;
    if (state.settings !== previousSettings) {
      uniforms.focus.value = state.settings.focus;
      uniforms.aperture.value = APERTURE_BLUR_SCALE / state.settings.aperture;
      if (state.settings.focalLength !== previousSettings?.focalLength) {
        camera.fov = THREE.MathUtils.radToDeg(
          2 * Math.atan(SENSOR_HEIGHT_MM / (2 * state.settings.focalLength)),
        );
        camera.updateProjectionMatrix();
      }
      composer.render();
      previousSettings = state.settings;
    }
    if (state.captureKey !== lastCapture) {
      downloadSnapshot(
        renderer.domElement,
        `focal-${state.settings.focalLength}mm-f${state.settings.aperture}.png`,
      );
      lastCapture = state.captureKey;
      state.onCaptured();
    }
  };
  const stopObserving = observeViewport(
    host,
    renderer,
    camera,
    (width, height) => {
      composer.setSize(width, height);
      composer.render();
    },
  );
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const onPointerDown = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      (-(event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(targets)[0];
    if (hit)
      current.onFocus(
        THREE.MathUtils.clamp(
          Math.round(-hit.point.z * 10) / 10,
          LENS_RANGES.focus.min,
          LENS_RANGES.focus.max,
        ),
      );
  };
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  update(initial);
  return {
    update,
    dispose: () => {
      stopObserving();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      disposeScene(scene);
      renderPass.dispose();
      bokeh.dispose();
      outputPass.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
};
