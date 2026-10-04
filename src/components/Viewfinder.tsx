import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { disposeScene, showWebGLError } from '../lib/scene';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import type { LensSettings } from '../lib/optics';

interface ViewfinderProps {
  settings: LensSettings;
  captureKey: number;
  onFocus: (distance: number) => void;
}

export function Viewfinder({ settings, captureKey, onFocus }: ViewfinderProps) {
  const host = useRef<HTMLDivElement>(null);
  const live = useRef({ settings, captureKey, onFocus });
  useEffect(() => {
    live.current = { settings, captureKey, onFocus };
  }, [settings, captureKey, onFocus]);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      return showWebGLError(container);
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x263b33);
    scene.fog = new THREE.Fog(0x263b33, 7, 18);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
    camera.position.set(0, 1.1, 0);
    camera.lookAt(0, 0.85, -3);
    scene.add(new THREE.HemisphereLight(0xf7ffda, 0x34453a, 3));
    const light = new THREE.DirectionalLight(0xffecd3, 4);
    light.position.set(-3, 5, 1);
    scene.add(light);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({ color: 0x566c58, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    scene.add(ground);
    const targets: THREE.Object3D[] = [];
    const material = (color: number) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.4 });
    function pedestal(x: number, z: number, color: number) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.65, 48),
        material(0xcfcabb),
      );
      base.position.y = 0.325;
      group.add(base);
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.33, 48, 32),
        material(color),
      );
      orb.position.y = 0.98;
      group.add(orb);
      scene.add(group);
      targets.push(base, orb);
    }
    pedestal(-0.9, -1.8, 0x9bb79d);
    pedestal(0, -3, 0xedb36e);
    pedestal(1.25, -5.5, 0xb7c4bd);
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.19, 24, 64, Math.PI),
      material(0xa5b3a2),
    );
    arch.position.set(-1.55, 0.3, -6);
    scene.add(arch);
    targets.push(arch);
    for (let i = 0; i < 12; i++) {
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.02, 1.2, 8),
        material(0x435c3a),
      );
      stem.position.set(
        1.9 + Math.sin(i * 5) * 0.3,
        0.6,
        -7 + Math.cos(i) * 0.3,
      );
      scene.add(stem);
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 12, 12),
        material(0x78936b),
      );
      leaf.scale.set(0.4, 1.5, 0.8);
      leaf.rotation.z = i;
      leaf.position.copy(stem.position);
      leaf.position.y = 1.2;
      scene.add(leaf);
    }
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 10),
      material(0x354d40),
    );
    wall.position.set(0, 4, -10);
    scene.add(wall);
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bokeh = new BokehPass(scene, camera, {
      focus: 3,
      aperture: 0.006,
      maxblur: 0.025,
    });
    composer.addPass(bokeh);
    composer.addPass(new OutputPass());
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    const raycaster = new THREE.Raycaster();
    const focus = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          (-(event.clientY - rect.top) / rect.height) * 2 + 1,
        ),
        camera,
      );
      const hit = raycaster.intersectObjects(targets)[0];
      if (hit)
        live.current.onFocus(
          Math.max(0.5, Math.min(10, Math.round(-hit.point.z * 10) / 10)),
        );
    };
    renderer.domElement.addEventListener('pointerdown', focus);
    let frame = 0;
    let lastCapture = live.current.captureKey;
    const render = () => {
      const { settings: s, captureKey: key } = live.current;
      const uniforms = bokeh.uniforms as {
        focus: THREE.IUniform<number>;
        aperture: THREE.IUniform<number>;
      };
      const focusUniform = uniforms.focus;
      const apertureUniform = uniforms.aperture;
      if (focusUniform) focusUniform.value = s.focus;
      if (apertureUniform) apertureUniform.value = 0.018 / s.aperture;
      camera.fov = THREE.MathUtils.radToDeg(
        2 * Math.atan(24 / (2 * s.focalLength)),
      );
      camera.updateProjectionMatrix();
      composer.render();
      if (key !== lastCapture) {
        const link = document.createElement('a');
        link.download = `focal-${s.focalLength}mm-f${s.aperture}.png`;
        link.href = renderer.domElement.toDataURL('image/png');
        link.click();
        lastCapture = key;
      }
      frame = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('pointerdown', focus);
      disposeScene(scene);
      bokeh.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
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
