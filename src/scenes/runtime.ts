import * as THREE from 'three';

export interface SceneController<State> {
  update: (state: State) => void;
  dispose: () => void;
}
export type SceneFactory<State> = (
  host: HTMLDivElement,
  state: State,
) => SceneController<State> | null;

export function createRenderer(
  host: HTMLDivElement,
  options: THREE.WebGLRendererParameters,
  maxPixelRatio: number,
): THREE.WebGLRenderer | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer(options);
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  host.appendChild(renderer.domElement);
  return renderer;
}

export function observeViewport(
  host: HTMLElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  onResize?: (width: number, height: number) => void,
): () => void {
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    renderer.setSize(safeWidth, safeHeight);
    camera.aspect = safeWidth / safeHeight;
    camera.updateProjectionMatrix();
    onResize?.(safeWidth, safeHeight);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  return () => observer.disconnect();
}

export function startAnimation(render: () => void): () => void {
  let frame = 0;
  const animate = () => {
    render();
    frame = requestAnimationFrame(animate);
  };
  animate();
  return () => cancelAnimationFrame(frame);
}

export function downloadSnapshot(
  canvas: HTMLCanvasElement,
  filename: string,
): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
