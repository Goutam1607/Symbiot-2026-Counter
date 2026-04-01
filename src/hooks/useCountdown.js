import { useState, useEffect, useCallback, useRef } from 'react';

const TOTAL_SECONDS = 24 * 60 * 60; // 24 hours

export function useHackathonTimer() {
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const intervalRef = useRef(null);
  const remainingAtPauseRef = useRef(TOTAL_SECONDS);

  // Derived values
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const progress = 1 - (remainingSeconds / TOTAL_SECONDS); // 0 → 1
  const elapsed = TOTAL_SECONDS - remainingSeconds;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => {
    if (remainingSeconds > 0) {
      setIsRunning(true);
      if (!startedAt) {
        setStartedAt(new Date());
      }
    }
  }, [remainingSeconds, startedAt]);

  const pause = useCallback(() => {
    setIsRunning(false);
    remainingAtPauseRef.current = remainingSeconds;
  }, [remainingSeconds]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(TOTAL_SECONDS);
    setStartedAt(null);
    remainingAtPauseRef.current = TOTAL_SECONDS;
  }, []);

  const setTime = useCallback((h, m, s) => {
    const total = h * 3600 + m * 60 + s;
    setRemainingSeconds(Math.max(0, Math.min(total, TOTAL_SECONDS)));
    remainingAtPauseRef.current = total;
  }, []);

  const addTime = useCallback((deltaSeconds) => {
    setRemainingSeconds(prev => Math.max(0, Math.min(prev + deltaSeconds, TOTAL_SECONDS)));
  }, []);

  return {
    hours,
    minutes,
    seconds,
    remainingSeconds,
    totalSeconds: TOTAL_SECONDS,
    progress,
    elapsed,
    isRunning,
    startedAt,
    start,
    pause,
    reset,
    setTime,
    addTime,
  };
}
