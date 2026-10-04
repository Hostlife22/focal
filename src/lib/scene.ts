import * as THREE from 'three';

function isBufferGeometry(value: unknown): value is THREE.BufferGeometry {
  return value instanceof THREE.BufferGeometry;
}

/** Dispose shared GPU resources once, including line and grid resources. */
export function disposeScene(scene: THREE.Scene): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Line)) return;
    const geometry: unknown = object.geometry;
    if (isBufferGeometry(geometry)) geometries.add(geometry);
    const material: unknown = object.material;
    const candidates: unknown[] = Array.isArray(material)
      ? material
      : [material];
    candidates.forEach((candidate) => {
      if (candidate instanceof THREE.Material) materials.add(candidate);
    });
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

export function showWebGLError(host: HTMLElement): () => void {
  const message = document.createElement('p');
  message.className = 'webgl-error';
  message.textContent =
    'WebGL is unavailable. Enable hardware acceleration in your browser to explore this scene.';
  host.appendChild(message);
  return () => message.remove();
}
