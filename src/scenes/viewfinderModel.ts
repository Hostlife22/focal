import * as THREE from 'three';

export function createViewfinderModel() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x263b33);
  scene.fog = new THREE.Fog(0x263b33, 7, 18);
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
    stem.position.set(1.9 + Math.sin(i * 5) * 0.3, 0.6, -7 + Math.cos(i) * 0.3);
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

  return { scene, targets };
}
