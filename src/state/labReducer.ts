import { DEFAULT_SETTINGS } from '../lib/optics.ts';
import type {
  LensPreset,
  LensSettings,
  PresetName,
  ViewMode,
} from '../lib/optics.ts';

export interface LabState {
  settings: LensSettings;
  view: ViewMode;
  activePreset: PresetName;
  resetKey: number;
  captureKey: number;
}

export type LabAction =
  | { type: 'change-settings'; patch: Partial<LensSettings> }
  | { type: 'select-preset'; preset: LensPreset }
  | { type: 'change-view'; view: ViewMode }
  | { type: 'reset-view' }
  | { type: 'capture' }
  | { type: 'reset' };

export function createInitialLabState(): LabState {
  return {
    settings: { ...DEFAULT_SETTINGS },
    view: 'perspective',
    activePreset: 'Custom',
    resetKey: 0,
    captureKey: 0,
  };
}

export function labReducer(state: LabState, action: LabAction): LabState {
  switch (action.type) {
    case 'change-settings':
      return {
        ...state,
        activePreset: 'Custom',
        settings: {
          ...state.settings,
          ...action.patch,
          ...(action.patch.spacing !== undefined ? { exploded: true } : {}),
        },
      };
    case 'select-preset': {
      const { focus, aperture, focalLength, name } = action.preset;
      return {
        ...state,
        activePreset: name,
        settings: { ...state.settings, focus, aperture, focalLength },
      };
    }
    case 'change-view':
      return { ...state, view: action.view };
    case 'reset-view':
      return { ...state, resetKey: state.resetKey + 1 };
    case 'capture':
      return { ...state, captureKey: state.captureKey + 1 };
    case 'reset':
      // Keep request counters monotonic so resetting cannot trigger a capture.
      return {
        ...createInitialLabState(),
        resetKey: state.resetKey + 1,
        captureKey: state.captureKey,
      };
  }
}
