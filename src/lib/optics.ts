export interface LensSettings {
  focus: number;
  aperture: number;
  focalLength: number;
  spacing: number;
  exploded: boolean;
  rays: boolean;
  plane: boolean;
}

export type ViewMode = 'perspective' | 'side' | 'front';

export const DEFAULT_SETTINGS: LensSettings = {
  focus: 3,
  aperture: 2.8,
  focalLength: 50,
  spacing: 0,
  exploded: true,
  rays: true,
  plane: true,
};

export const PRESETS = [
  {
    name: 'Portrait',
    description: 'Soft, beautiful separation',
    aperture: 1.8,
    focus: 3,
    focalLength: 85,
  },
  {
    name: 'Street',
    description: 'A little more of the story',
    aperture: 5.6,
    focus: 5,
    focalLength: 35,
  },
  {
    name: 'Landscape',
    description: 'Clarity from front to back',
    aperture: 11,
    focus: 8,
    focalLength: 24,
  },
] as const;

export function depthOfField(settings: LensSettings) {
  const f = settings.focalLength;
  const distance = settings.focus * 1000;
  const hyperfocal = (f * f) / (settings.aperture * 0.03) + f;
  const near = (hyperfocal * distance) / (hyperfocal + distance - f) / 1000;
  const far =
    hyperfocal > distance - f
      ? (hyperfocal * distance) / (hyperfocal - distance + f) / 1000
      : Infinity;
  return { near, far, hyperfocal: hyperfocal / 1000, total: far - near };
}

export function distanceLabel(value: number): string {
  return Number.isFinite(value) ? `${value.toFixed(2)} m` : '∞';
}
