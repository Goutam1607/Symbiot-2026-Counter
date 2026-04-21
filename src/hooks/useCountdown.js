/**
 * SYMBIOT 2026 — Single Source of Truth Timer Hook
 *
 * Architecture:
 *   hackathonStartTime (ms timestamp) is the ONE source of truth.
 *   elapsedTime  = (Date.now() - hackathonStartTime) / 1000
 *   mainRemaining = TOTAL_SECONDS - elapsedTime
 *
 * Everything else (phase detection, phase countdown) is COMPUTED from elapsedTime.
 * No separate phase timer — it's purely derived math.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { TOTAL_SECONDS } from '../utils/schedule';

export function useHackathonTimer() {
  // The anchor: when did the hackathon start?
  // null = not started yet.
  const [hackathonStartTime, setHackathonStartTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // When paused we freeze elapsedTime at this value
  const frozenElapsedRef = useRef(0);

  // Tick counter to force re-renders every second
  const [tick, setTick] = useState(0);
  const intervalRef = useRef(null);

  // ─── Derived state ───────────────────────────────────────────────────────
  const getElapsed = useCallback(() => {
    if (!hackathonStartTime) return 0;
    if (isPaused) return frozenElapsedRef.current;
    const raw = (Date.now() - hackathonStartTime) / 1000;
    return Math.max(0, Math.min(raw, TOTAL_SECONDS));
  }, [hackathonStartTime, isPaused]);

  const elapsedTime = getElapsed();
  const remainingSeconds = Math.max(0, TOTAL_SECONDS - elapsedTime);
  const progress = elapsedTime / TOTAL_SECONDS; // 0 → 1

  const hours   = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = Math.floor(remainingSeconds % 60);

  // ─── Tick interval ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTick(t => t + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  // Auto-stop when elapsed reaches TOTAL_SECONDS
  useEffect(() => {
    if (isRunning && !isPaused && elapsedTime >= TOTAL_SECONDS) {
      setIsRunning(false);
    }
  }, [elapsedTime, isRunning, isPaused]);

  // ─── Controls ────────────────────────────────────────────────────────────

  /**
   * Start (or resume) the hackathon clock.
   */
  const start = useCallback(() => {
    if (!hackathonStartTime) {
      // First start: anchor to now at elapsedTime=0
      setHackathonStartTime(Date.now());
    } else if (isPaused) {
      // Resume: shift startTime forward so elapsed stays frozen
      const frozen = frozenElapsedRef.current;
      setHackathonStartTime(Date.now() - frozen * 1000);
    }
    setIsPaused(false);
    setIsRunning(true);
  }, [hackathonStartTime, isPaused]);

  /**
   * Pause without losing position.
   */
  const pause = useCallback(() => {
    frozenElapsedRef.current = getElapsed();
    setIsPaused(true);
  }, [getElapsed]);

  /**
   * Full reset back to zero.
   */
  const reset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setHackathonStartTime(null);
    frozenElapsedRef.current = 0;
    setTick(0);
  }, []);

  /**
   * Set main timer to show a specific REMAINING time.
   * elapsedTime = TOTAL_SECONDS - remaining
   * hackathonStartTime = now - elapsedTime
   *
   * This is the CRITICAL fix: editing the timer recomputes start anchor.
   */
  const setTime = useCallback((h, m, s) => {
    const remaining = Math.max(0, Math.min(h * 3600 + m * 60 + s, TOTAL_SECONDS));
    const newElapsed = TOTAL_SECONDS - remaining;
    const newStart = Date.now() - newElapsed * 1000;
    setHackathonStartTime(newStart);
    if (isPaused) {
      frozenElapsedRef.current = newElapsed;
    }
    // Keep running state intact
  }, [isPaused]);

  /**
   * Jump to elapsedTime = targetElapsed seconds.
   * Used by admin phase jump.
   */
  const setElapsed = useCallback((targetElapsed) => {
    const clamped = Math.max(0, Math.min(targetElapsed, TOTAL_SECONDS));
    const newStart = Date.now() - clamped * 1000;
    setHackathonStartTime(newStart);
    if (isPaused) {
      frozenElapsedRef.current = clamped;
    }
  }, [isPaused]);

  return {
    // Display values
    hours,
    minutes,
    seconds: Math.floor(seconds),
    remainingSeconds,
    elapsedTime,
    progress,
    totalSeconds: TOTAL_SECONDS,

    // State
    isRunning,
    isPaused,
    hackathonStartTime,

    // Controls
    start,
    pause,
    reset,
    setTime,
    setElapsed,
  };
}
