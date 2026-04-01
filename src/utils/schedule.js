// SYMBIOT 2026 Event Schedule — April 24-25, 2026
export const SCHEDULE = [
  {
    day: 'Friday',
    date: '2026-04-24',
    events: [
      { id: 'reg', emoji: '📝', name: 'Registration', time: '8:30 AM', dateTime: '2026-04-24T08:30:00' },
      { id: 'inaug', emoji: '🎤', name: 'Inauguration', time: '9:30 – 10:30 AM', dateTime: '2026-04-24T09:30:00', endTime: '2026-04-24T10:30:00' },
      { id: 'design', emoji: '🧠', name: 'Design Phase', time: '11:00 AM – 1:00 PM', dateTime: '2026-04-24T11:00:00', endTime: '2026-04-24T13:00:00' },
      { id: 'lunch1', emoji: '🍽️', name: 'Lunch', time: '1:00 – 2:00 PM', dateTime: '2026-04-24T13:00:00', endTime: '2026-04-24T14:00:00' },
      { id: 'tea1', emoji: '☕', name: 'High Tea', time: '4:30 PM', dateTime: '2026-04-24T16:30:00' },
      { id: 'dinner', emoji: '🍛', name: 'Dinner', time: '7:00 – 8:00 PM', dateTime: '2026-04-24T19:00:00', endTime: '2026-04-24T20:00:00' },
      { id: 'judge1', emoji: '⚖️', name: 'Phase II Judgement', time: '8:00 PM', dateTime: '2026-04-24T20:00:00' },
      { id: 'latenight', emoji: '🌙', name: 'Late Night Tea', time: '12:00 AM', dateTime: '2026-04-25T00:00:00' },
    ]
  },
  {
    day: 'Saturday',
    date: '2026-04-25',
    events: [
      { id: 'breakfast', emoji: '🥐', name: 'Breakfast', time: '8:00 AM', dateTime: '2026-04-25T08:00:00' },
      { id: 'final', emoji: '🏆', name: 'Final Judgement', time: '11:00 AM – 1:00 PM', dateTime: '2026-04-25T11:00:00', endTime: '2026-04-25T13:00:00' },
      { id: 'lunch2', emoji: '🍽️', name: 'Lunch', time: '1:00 PM', dateTime: '2026-04-25T13:00:00' },
      { id: 'vale', emoji: '🎓', name: 'Valedictory & Tea', time: '3:00 PM', dateTime: '2026-04-25T15:00:00' },
    ]
  }
];

export const DEFAULT_TARGET_DATE = '2026-04-24T09:30:00';
