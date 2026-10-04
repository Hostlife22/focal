import { useEffect, useRef } from 'react';
import type { SceneController, SceneFactory } from '../scenes/runtime';
import { showWebGLError } from '../lib/scene';

/** Keep GPU resources mounted while propagating committed React state updates. */
export function useSceneController<State>(
  factory: SceneFactory<State>,
  state: State,
) {
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef(state);
  const controller = useRef<SceneController<State> | null>(null);
  useEffect(() => {
    latest.current = state;
    controller.current?.update(state);
  }, [state]);
  useEffect(() => {
    if (!host.current) return;
    const instance = factory(host.current, latest.current);
    if (!instance) return showWebGLError(host.current);
    controller.current = instance;
    return () => {
      controller.current = null;
      instance.dispose();
    };
  }, [factory]);
  return host;
}
