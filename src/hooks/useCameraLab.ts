import { useCallback, useReducer } from 'react';
import { createInitialLabState, labReducer } from '../state/labReducer';
import type { LensPreset, LensSettings, ViewMode } from '../lib/optics';

export function useCameraLab() {
  const [state, dispatch] = useReducer(
    labReducer,
    undefined,
    createInitialLabState,
  );
  const changeSetting = useCallback(
    <K extends keyof LensSettings>(key: K, value: LensSettings[K]) => {
      dispatch({ type: 'change-settings', patch: { [key]: value } });
    },
    [],
  );
  const selectPreset = useCallback(
    (preset: LensPreset) => dispatch({ type: 'select-preset', preset }),
    [],
  );
  const changeView = useCallback(
    (view: ViewMode) => dispatch({ type: 'change-view', view }),
    [],
  );
  const resetView = useCallback(() => dispatch({ type: 'reset-view' }), []);
  const capture = useCallback(() => dispatch({ type: 'capture' }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);
  return {
    ...state,
    changeSetting,
    selectPreset,
    changeView,
    resetView,
    capture,
    reset,
  };
}
