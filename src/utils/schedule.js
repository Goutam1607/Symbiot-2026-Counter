/**
 * SYMBIOT 2026 — Hackathon Schedule
 *
 * ARCHITECTURE: All phases are defined by RELATIVE durations in seconds from
 * hackathon start (t=0). NO absolute date/time is used anywhere.
 *
 * The "GAP" phase is a silent gap — nothing highlighted, no phase timer shown.
 */

export const TOTAL_SECONDS = 24 * 60 * 60; // 24 hours main timer (schedule goes beyond)

export const SCHEDULE = [
  { id: 'design', emoji: '🧠', name: 'Design Phase', duration: 1 * 60 * 60, time: '11:00 AM – 12:00 PM', description: 'Phase I — Brainstorm, design solutions, create wireframes and technical architecture.', location: 'Hack Arena' },
  { id: 'judge1', emoji: '⚖️', name: 'Judgement Round 1', duration: 1 * 60 * 60, time: '12:00 PM – 1:00 PM', description: 'Phase II evaluation — Present your progress and get feedback from judges.', location: 'Judging Arena' },
  { id: 'lunch1', emoji: '🍽️', name: 'Lunch', duration: 1 * 60 * 60, time: '1:00 PM – 2:00 PM', description: 'Recharge with a freshly prepared meal. Network with other teams.', location: 'Dining Hall' },

  { id: 'gap1', emoji: '⏳', name: 'GAP', duration: 2.5 * 60 * 60, time: '2:00 PM – 4:30 PM', isGap: true },

  { id: 'tea1', emoji: '☕', name: 'High Tea', duration: 30 * 60, time: '4:30 PM – 5:00 PM', description: 'Quick refreshment break with chai, coffee, and snacks.', location: 'Dining Hall' },

  { id: 'gap2', emoji: '⏳', name: 'GAP', duration: 2 * 60 * 60, time: '5:00 PM – 7:00 PM', isGap: true },

  { id: 'dinner', emoji: '🍛', name: 'Dinner', duration: 1 * 60 * 60, time: '7:00 PM – 8:00 PM', description: 'Evening meal break before the intense night coding session.', location: 'Dining Hall' },
  { id: 'judge2', emoji: '⚖️', name: 'Judgement Round 2', duration: 1 * 60 * 60, time: '7:30 PM – 8:30 PM', description: 'Night evaluation round — demo your working build to the judges.', location: 'Judging Arena' },

  { id: 'gap3', emoji: '⏳', name: 'GAP', duration: 3 * 60 * 60, time: '8:30 PM – 12:00 AM', isGap: true },

  { id: 'midtea', emoji: '🌙', name: 'Midnight Tea', duration: 30 * 60, time: '12:00 AM – 12:30 AM', description: 'Midnight fuel! Hot tea and snacks for the night owls.', location: 'Dining Hall' },

  { id: 'gap4', emoji: '⏳', name: 'GAP', duration: 7.5 * 60 * 60, time: '12:30 AM – 8:00 AM', isGap: true },

  { id: 'breakfast', emoji: '🥐', name: 'Breakfast', duration: 1 * 60 * 60, time: '8:00 AM – 9:00 AM', description: 'Start your final day with a hearty breakfast before the final sprint.', location: 'Dining Hall' },

  { id: 'gap5', emoji: '⏳', name: 'GAP', duration: 0.5 * 60 * 60, time: '9:00 AM – 9:30 AM', isGap: true },

  { id: 'final', emoji: '🏆', name: 'Final Judgement', duration: 3.5 * 60 * 60, time: '9:30 AM – 1:00 PM', description: 'Final evaluation — Present your completed project and demo your working prototype.', location: 'Judging Arena' },
  { id: 'lunch2', emoji: '🍽️', name: 'Lunch', duration: 1 * 60 * 60, time: '1:00 PM – 2:00 PM', description: 'Post-judgement lunch. Relax while judges deliberate.', location: 'Dining Hall' },

  { id: 'gap6', emoji: '⏳', name: 'GAP', duration: 1 * 60 * 60, time: '2:00 PM – 3:00 PM', isGap: true },

  { id: 'vale', emoji: '🎓', name: 'Valedictory', duration: 1.5 * 60 * 60, time: '3:00 PM – 4:30 PM', description: 'Closing ceremony — Winner announcements, prizes, certificates, and group photo!', location: 'Auditorium' },
  { id: 'tea2', emoji: '☕', name: 'Tea', duration: 30 * 60, time: '4:30 PM – 5:00 PM', description: 'Final wrap-up tea. Congratulations to all participants!', location: 'Dining Hall' },
];

/**
 * Given elapsedTime (seconds since hackathon start), return:
 *  - currentPhase: the phase object currently active (null if after scheduled time)
 *  - nextPhase:    the next non-gap phase object (null if none)
 *  - phaseElapsed: seconds elapsed within current phase
 *  - phaseRemaining: seconds remaining in current phase
 *  - phaseIndex:   index of currentPhase in SCHEDULE
 */
export function computePhase(elapsedTime) {
  let timeCursor = 0;

  for (let i = 0; i < SCHEDULE.length; i++) {
    const phase = SCHEDULE[i];
    const phaseStart = timeCursor;
    const phaseEnd = timeCursor + phase.duration;

    if (elapsedTime >= phaseStart && elapsedTime < phaseEnd) {
      const phaseElapsed = elapsedTime - phaseStart;
      const phaseRemaining = phase.duration - phaseElapsed;

      // Find the next phase that is NOT a gap
      let nextPhase = null;
      for (let j = i + 1; j < SCHEDULE.length; j++) {
        if (!SCHEDULE[j].isGap) {
          nextPhase = SCHEDULE[j];
          break;
        }
      }

      return {
        currentPhase: phase,
        nextPhase,
        phaseElapsed,
        phaseRemaining,
        phaseIndex: i,
        phaseStart,
      };
    }

    timeCursor += phase.duration;
  }

  return {
    currentPhase: null,
    nextPhase: null,
    phaseElapsed: 0,
    phaseRemaining: 0,
    phaseIndex: -1,
    phaseStart: 0,
  };
}

/**
 * Return the cumulative start time (in seconds) for a phase by its index.
 */
export function getPhaseStartTime(index) {
  let timeCursor = 0;
  for (let i = 0; i < index; i++) {
    timeCursor += SCHEDULE[i].duration;
  }
  return timeCursor;
}
