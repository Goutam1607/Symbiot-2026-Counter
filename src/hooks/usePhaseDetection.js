import { useMemo } from 'react';
import { SCHEDULE } from '../utils/schedule';

export function usePhaseDetection(isTimerRunning, startedAt, elapsed) {
  const allEvents = useMemo(() => {
    return SCHEDULE.flatMap(day => day.events);
  }, []);

  const { currentPhase, nextPhase, phaseTimeRemaining } = useMemo(() => {
    if (!isTimerRunning && !startedAt) {
      // Timer hasn't started yet — first event is "next"
      return {
        currentPhase: null,
        nextPhase: allEvents[0] || null,
        phaseTimeRemaining: null,
      };
    }

    // Calculate "hackathon time" — what time it would be in the hackathon
    // Hackathon starts at 8:30 AM on Day 1
    const hackathonStartTime = new Date('2026-04-24T08:30:00').getTime();
    const currentHackathonTime = hackathonStartTime + (elapsed * 1000);
    const now = currentHackathonTime;

    let current = null;
    let next = null;
    let timeRemaining = null;

    for (let i = 0; i < allEvents.length; i++) {
      const event = allEvents[i];
      const eventStart = new Date(event.dateTime).getTime();
      const eventEnd = event.endTime
        ? new Date(event.endTime).getTime()
        : (i < allEvents.length - 1 ? new Date(allEvents[i + 1].dateTime).getTime() : eventStart + 3600000);

      if (now >= eventStart && now < eventEnd) {
        current = event;
        timeRemaining = Math.max(0, Math.floor((eventEnd - now) / 1000));
        next = allEvents[i + 1] || null;
        break;
      }
    }

    // If no current found, find the next upcoming
    if (!current) {
      for (let i = 0; i < allEvents.length; i++) {
        const eventStart = new Date(allEvents[i].dateTime).getTime();
        if (now < eventStart) {
          next = allEvents[i];
          timeRemaining = Math.max(0, Math.floor((eventStart - now) / 1000));
          break;
        }
      }
    }

    return { currentPhase: current, nextPhase: next, phaseTimeRemaining: timeRemaining };
  }, [allEvents, isTimerRunning, startedAt, elapsed]);

  return { currentPhase, nextPhase, phaseTimeRemaining, allEvents };
}
