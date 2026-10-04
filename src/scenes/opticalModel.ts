import * as THREE from 'three';
import type { LensSettings } from '../lib/optics';

const COLORS = {
  mint: 0xa2edc8,
  glass: 0x75c6c5,
  metal: 0x313b3a,
  edge: 0x8d9991,
  grid: 0x293632,
  background: 0x141b19,
};

function createEnvironment() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.background, 14, 30);
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

  return scene;
}

function createLensAssembly() {
  const assembly = new THREE.Group();
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
  const ribGeometry = new THREE.BoxGeometry(0.36, 0.032, 0.055);
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
        const rib = new THREE.Mesh(ribGeometry, metal);
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

  return { assembly, elements, barrel };
}

function createSensor() {
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

  return sensor;
}

function createFocalPlane() {
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

  return plane;
}

function createLightRays() {
  const rays = new THREE.Group();
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

  return { rays, rayLines };
}

function createOpticalAxis() {
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

  return axis;
}

export function createOpticalModel() {
  const scene = createEnvironment();
  const { assembly, elements, barrel } = createLensAssembly();
  const plane = createFocalPlane();
  const { rays, rayLines } = createLightRays();
  scene.add(assembly, createSensor(), plane, rays, createOpticalAxis());

  function update(settings: LensSettings): void {
    elements.forEach((element, i) => {
      element.position.x = settings.exploded
        ? -2.3 + i * (0.72 + settings.spacing / 100)
        : -1.2 + i * 0.43;
    });
    const focusRing = elements[0];
    if (focusRing) focusRing.rotation.x = settings.focus * 0.4;
    barrel.visible = !settings.exploded;
    plane.position.x = -3.7 - settings.focus * 0.18;
    rayLines.forEach((line, i) => {
      const a = (i / 10) * Math.PI * 2;
      const y = Math.cos(a) * 0.87;
      const z = Math.sin(a) * 0.87;
      const apertureScale = Math.min(1, 2.8 / settings.aperture);
      line.geometry.setFromPoints([
        new THREE.Vector3(plane.position.x, y * 1.8, z * 1.8),
        new THREE.Vector3(-2.3, y, z),
        new THREE.Vector3(0, y * apertureScale, z * apertureScale),
        new THREE.Vector3(1.3, y * 0.55, z * 0.55),
        new THREE.Vector3(3.2, 0, 0),
      ]);
    });

    rays.visible = settings.rays;
    plane.visible = settings.plane;
  }
  return { scene, update };
}
