import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { disposeScene, showWebGLError } from '../lib/scene';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { LensSettings, ViewMode } from '../lib/optics';

interface OpticalSceneProps {
  settings: LensSettings;
  view: ViewMode;
  resetKey: number;
}
const COLORS = {
  mint: 0xa2edc8,
  glass: 0x75c6c5,
  metal: 0x313b3a,
  edge: 0x8d9991,
  grid: 0x293632,
  background: 0x141b19,
};
export function OpticalScene({ settings, view, resetKey }: OpticalSceneProps) {
  const container = useRef<HTMLDivElement>(null);
  const live = useRef({ settings, view, resetKey });
  useEffect(() => {
    live.current = { settings, view, resetKey };
  }, [settings, view, resetKey]);
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return showWebGLError(host);
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(COLORS.background, 0);
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(COLORS.background, 14, 30);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(10, 6.5, 11);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 7;
    controls.maxDistance = 25;
    controls.target.set(0.3, 0, 0);
    controls.maxPolarAngle = Math.PI * 0.85;
    scene.add(new THREE.HemisphereLight(0xe5fff2, 0x26322d, 2));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(0, 8, 6);
    scene.add(key);
    const rim = new THREE.PointLight(COLORS.mint, 50);
    rim.position.set(-3, 3, -4);
    scene.add(rim);
    const grid = new THREE.GridHelper(26, 52, COLORS.grid, COLORS.grid);
    grid.position.y = -1.55;
    scene.add(grid);
    const assembly = new THREE.Group();
    scene.add(assembly);
    const elements: THREE.Group[] = [];
    const metal = new THREE.MeshStandardMaterial({
      color: COLORS.metal,
      metalness: 0.85,
      roughness: 0.32,
    });
    const edge = new THREE.MeshStandardMaterial({
      color: COLORS.edge,
      metalness: 0.9,
      roughness: 0.25,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: COLORS.glass,
      transparent: true,
      opacity: 0.3,
      metalness: 0.1,
      roughness: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    function ring(radius: number, tube: number, material: THREE.Material) {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 16, 96),
        material,
      );
      mesh.rotation.y = Math.PI / 2;
      return mesh;
    }
    for (let i = 0; i < 6; i++) {
      const group = new THREE.Group();
      const radius = i === 0 ? 1.18 : i === 5 ? 0.93 : 1.03;
      group.add(ring(radius, i === 0 ? 0.14 : 0.075, metal));
      const trim = ring(radius + 0.025, 0.018, edge);
      trim.position.x = 0.08;
      group.add(trim);
      const lens = new THREE.Mesh(
        new THREE.SphereGeometry(radius - 0.07, 48, 32),
        glass,
      );
      lens.scale.set(0.105, 1, 1);
      group.add(lens);
      if (i === 0 || i === 3) {
        for (let j = 0; j < 80; j++) {
          const rib = new THREE.Mesh(
            new THREE.BoxGeometry(0.36, 0.032, 0.055),
            metal,
          );
          const angle = (j / 80) * Math.PI * 2;
          rib.position.set(
            0,
            Math.cos(angle) * (radius + 0.09),
            Math.sin(angle) * (radius + 0.09),
          );
          rib.rotation.x = angle;
          group.add(rib);
        }
      }
      elements.push(group);
      assembly.add(group);
    }
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 2.9, 64, 1, true),
      metal,
    );
    barrel.rotation.z = Math.PI / 2;
    assembly.add(barrel);
    const sensor = new THREE.Group();
    const sensorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 1.4, 1.85),
      new THREE.MeshStandardMaterial({
        color: 0x597965,
        metalness: 0.7,
        roughness: 0.3,
      }),
    );
    sensor.add(sensorMesh);
    const frame = new THREE.LineSegments(
      new THREE.EdgesGeometry(sensorMesh.geometry),
      new THREE.LineBasicMaterial({ color: COLORS.mint }),
    );
    sensor.add(frame);
    sensor.position.x = 3.25;
    scene.add(sensor);
    const plane = new THREE.Group();
    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.9, 3.2),
      new THREE.MeshBasicMaterial({
        color: COLORS.mint,
        opacity: 0.07,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    planeMesh.rotation.y = Math.PI / 2;
    plane.add(planeMesh);
    const planeEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.01, 3.2, 3.9)),
      new THREE.LineBasicMaterial({
        color: COLORS.mint,
        transparent: true,
        opacity: 0.4,
      }),
    );
    plane.add(planeEdges);
    scene.add(plane);
    const rays = new THREE.Group();
    scene.add(rays);
    const rayLines: THREE.Line[] = [];
    for (let i = 0; i < 10; i++) {
      const line = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({
          color: COLORS.mint,
          transparent: true,
          opacity: i % 2 ? 0.28 : 0.55,
        }),
      );
      rayLines.push(line);
      rays.add(line);
    }
    const axis = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-7, 0, 0),
        new THREE.Vector3(4.2, 0, 0),
      ]),
      new THREE.LineDashedMaterial({
        color: COLORS.edge,
        dashSize: 0.12,
        gapSize: 0.12,
        transparent: true,
        opacity: 0.4,
      }),
    );
    axis.computeLineDistances();
    scene.add(axis);
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    let lastView: ViewMode | undefined;
    let lastReset = -1;
    let lastGeometry = '';
    let animation = 0;
    const animate = () => {
      const { settings: s, view: v, resetKey: r } = live.current;
      if (v !== lastView || r !== lastReset) {
        if (v === 'side') camera.position.set(0, 0.7, 15);
        else if (v === 'front') camera.position.set(-15, 0.2, 0.1);
        else camera.position.set(-7.5, 4.4, 8);
        controls.target.set(0, 0, 0);
        lastView = v;
        lastReset = r;
      }
      const signature = `${s.exploded}-${s.spacing}-${s.focus}-${s.aperture}-${s.focalLength}`;
      if (signature !== lastGeometry) {
        elements.forEach((element, i) => {
          element.position.x = s.exploded
            ? -2.3 + i * (0.72 + s.spacing / 100)
            : -1.2 + i * 0.43;
        });
        const focusRing = elements[0];
        if (focusRing) focusRing.rotation.x = s.focus * 0.4;
        barrel.visible = !s.exploded;
        plane.position.x = -3.7 - s.focus * 0.18;
        rayLines.forEach((line, i) => {
          const a = (i / 10) * Math.PI * 2;
          const y = Math.cos(a) * 0.87;
          const z = Math.sin(a) * 0.87;
          const apertureScale = Math.min(1, 2.8 / s.aperture);
          line.geometry.dispose();
          line.geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(plane.position.x, y * 1.8, z * 1.8),
            new THREE.Vector3(-2.3, y, z),
            new THREE.Vector3(0, y * apertureScale, z * apertureScale),
            new THREE.Vector3(1.3, y * 0.55, z * 0.55),
            new THREE.Vector3(3.2, 0, 0),
          ]);
        });
        lastGeometry = signature;
      }
      rays.visible = s.rays;
      plane.visible = s.plane;
      controls.update();
      renderer.render(scene, camera);
      animation = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animation);
      observer.disconnect();
      controls.dispose();
      disposeScene(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div
      className="optical-canvas"
      ref={container}
      role="img"
      aria-label="Interactive 3D lens assembly. Drag to orbit and scroll to zoom."
    ></div>
  );
}
