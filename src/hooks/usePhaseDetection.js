/**
 * SYMBIOT 2026 — Phase Detection Hook
 *
 * Receives elapsedTime (seconds) and returns the current/next phase.
 * 100% derived from elapsedTime — NO real-world clock used.
 */

import { useMemo } from 'react';
import { computePhase, SCHEDULE } from '../utils/schedule';

export function usePhaseDetection(elapsedTime) {
  return useMemo(() => {
    return computePhase(elapsedTime);
  }, [elapsedTime]);
}
