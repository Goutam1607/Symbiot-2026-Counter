import { useMemo } from 'react';
import { SCHEDULE } from '../utils/schedule';

export function usePhaseDetection(isTimerRunning, startedAt, elapsed, overridePhaseId) {
  const allEvents = useMemo(() => {
    return SCHEDULE.flatMap(day => day.events);
  }, []);

  const result = useMemo(() => {
    // 1. Establish the "Hackathon Timeline"
    // Starts at 11:00 AM on Day 1 (Design Phase)
    const HACK_START_STR = '2026-04-24T11:00:00';
    const hackStartTime = new Date(HACK_START_STR).getTime();
    const currentHackTime = hackStartTime + (elapsed * 1000);
    const now = currentHackTime;

    let current = null;
    let next = null;
    let timeRemaining = null;

    // 2. Identify Current & Next Phase
    if (overridePhaseId) {
      const idx = allEvents.findIndex(e => e.id === overridePhaseId);
      if (idx !== -1) {
        current = allEvents[idx];
        next = allEvents[idx + 1] || null;
      }
    }

    // Auto-detect if no override or override not found
    if (!current) {
      for (let i = 0; i < allEvents.length; i++) {
        const event = allEvents[i];
        const eventStart = new Date(event.dateTime).getTime();
        
        // Calculate effective end time for this phase
        const eventEnd = event.endTime
          ? new Date(event.endTime).getTime()
          : (allEvents[i + 1] ? new Date(allEvents[i + 1].dateTime).getTime() : eventStart + 3600000);

        if (now >= eventStart && now < eventEnd) {
          current = event;
          next = allEvents[i + 1] || null;
          break;
        }
      }
    }

    // Fallback if still no current (before any phase started)
    if (!current && allEvents.length > 0) {
      // Find the next upcoming event in the timeline
      for (let i = 0; i < allEvents.length; i++) {
        const eStart = new Date(allEvents[i].dateTime).getTime();
        if (now < eStart) {
          next = allEvents[i];
          break;
        }
      }
    }

    return { currentPhase: current, nextPhase: next };
  }, [allEvents, elapsed, overridePhaseId]);

  return { ...result, allEvents };
}
