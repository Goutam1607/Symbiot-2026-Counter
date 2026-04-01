import { useCallback, useRef } from 'react';
import { playTick, playSuccess, playCheer, playActivation } from '../utils/sounds';

export function useSoundEffects() {
  const enabledRef = useRef(true);

  const tick = useCallback(() => {
    if (enabledRef.current) playTick();
  }, []);

  const success = useCallback(() => {
    if (enabledRef.current) playSuccess();
  }, []);

  const cheer = useCallback(() => {
    if (enabledRef.current) playCheer();
  }, []);

  const activation = useCallback(() => {
    if (enabledRef.current) playActivation();
  }, []);

  const toggle = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    return enabledRef.current;
  }, []);

  return { tick, success, cheer, activation, toggle, enabled: enabledRef };
}
