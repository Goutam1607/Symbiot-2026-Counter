import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function MiniCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Happening Now');
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      if (h > 24) {
        const d = Math.floor(h / 24);
        setTimeLeft(`${d}d ${h % 24}h ${m}m`);
      } else if (h > 0) {
        setTimeLeft(`${h}h ${m}m ${s}s`);
      } else {
        setTimeLeft(`${m}m ${s}s`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="tabular-nums">{timeLeft}</span>;
}

// Descriptions for each event
const EVENT_DETAILS = {
  reg: { description: 'Check in at the registration desk with your team. Collect your ID cards, swag kits, and workspace assignments.', location: 'H KempeGowda Sports Complex' },
  inaug: { description: 'Opening ceremony featuring keynote speakers, event rules overview, and the official hackathon kickoff.', location: 'H KempeGowda Sports Complex' },
  design: { description: 'Phase I — Brainstorm, design your solution, create wireframes and technical architecture. Mentors available for guidance.', location: 'H KempeGowda Sports Complex' },
  lunch1: { description: 'Recharge with a freshly prepared meal. Network with other teams and mentors.', location: 'H KempeGowda Sports Complex' },
  tea1: { description: 'Quick refreshment break. Chai, coffee, and snacks to keep you energized.', location: 'H KempeGowda Sports Complex' },
  dinner: { description: 'Evening meal break. Take a breather before the intense night coding session.', location: 'H KempeGowda Sports Complex' },
  judge1: { description: 'Phase II evaluation — Present your progress to the judges. Get feedback and refine your project.', location: 'H KempeGowda Sports Complex' },
  latenight: { description: 'Midnight fuel! Hot tea and snacks to keep the night owls coding through the night.', location: 'H KempeGowda Sports Complex' },
  breakfast: { description: 'Start your final day with a hearty breakfast. Last chance to fuel up before the final sprint.', location: 'H KempeGowda Sports Complex' },
  final: { description: 'Final evaluation — Present your completed project to the panel of judges. Demo your working prototype.', location: 'H KempeGowda Sports Complex' },
  lunch2: { description: 'Post-judgement lunch. Relax while the judges deliberate on the results.', location: 'H KempeGowda Sports Complex' },
  vale: { description: 'Closing ceremony — Winner announcements, prize distribution, certificates, and farewell. Group photo!', location: 'H KempeGowda Sports Complex' },
};

const STATUS_STYLES = {
  past: {
    border: 'border-gray-700/30',
    bg: 'from-gray-800/40 to-gray-900/30',
    badge: 'bg-gray-700/50 text-gray-400',
    badgeText: '✓ Done',
  },
  current: {
    border: 'border-primary-500/50',
    bg: 'from-primary-500/10 to-primary-600/5',
    badge: 'bg-primary-500/20 text-primary-400',
    badgeText: '● LIVE',
  },
  next: {
    border: 'border-primary-500/25',
    bg: 'from-[#0f1d3a]/80 to-[#0a1428]/70',
    badge: 'bg-amber-500/15 text-amber-400',
    badgeText: '⏭ Up Next',
  },
  future: {
    border: 'border-white/[0.06]',
    bg: 'from-[#0f1d3a]/60 to-[#0a1428]/50',
    badge: 'bg-white/5 text-gray-500',
    badgeText: '',
  },
};

function EventCard({ event, status, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const isPast = status === 'past';
  const isCurrent = status === 'current';
  const isNext = status === 'next';
  const styles = STATUS_STYLES[status];
  const details = EVENT_DETAILS[event.id] || {};

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
    >
      {/* Main card */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full text-left rounded-2xl p-4 md:p-5 transition-all duration-300 cursor-pointer
          bg-gradient-to-br ${styles.bg}
          border ${styles.border}
          ${isCurrent ? 'shadow-[0_0_30px_rgba(0,194,194,0.12)]' : ''}
          ${isPast ? 'opacity-60' : ''}
          group relative overflow-hidden
        `}
        whileHover={{ scale: isPast ? 1 : 1.01, y: isPast ? 0 : -2 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Hover glow overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        bg-gradient-to-br from-primary-500/[0.04] to-transparent pointer-events-none" />

        {/* Current event animated border */}
        {isCurrent && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ border: '1px solid rgba(0,194,194,0.3)' }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Next event pulse */}
        {isNext && (
          <motion.div
            className="absolute -inset-[1px] rounded-2xl pointer-events-none"
            style={{ border: '1px solid rgba(0,194,194,0.15)' }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        <div className="flex items-center gap-4 relative z-10">
          {/* Emoji icon */}
          <div className={`
            w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0
            ${isCurrent
              ? 'bg-primary-500/15 shadow-[0_0_15px_rgba(0,194,194,0.15)]'
              : isNext
                ? 'bg-primary-500/10'
                : isPast
                  ? 'bg-gray-800/30'
                  : 'bg-white/[0.04]'
            }
          `}>
            {event.emoji}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-bold text-sm md:text-base truncate
                ${isPast ? 'line-through text-gray-500' : 'text-white'}`}>
                {event.name}
              </h4>
              {styles.badgeText && (
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}>
                  {styles.badgeText}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-medium">
              🕐 {event.time}
            </p>
          </div>

          {/* Countdown / status on the right */}
          <div className="flex-shrink-0 text-right">
            {isPast ? (
              <span className="text-xs text-gray-600">Completed</span>
            ) : (
              <span className={`text-xs font-bold ${isCurrent ? 'text-primary-400' : 'text-primary-500/80'}`}>
                <MiniCountdown targetDate={event.dateTime} />
              </span>
            )}
          </div>

          {/* Expand arrow */}
          <motion.div
            className="flex-shrink-0 text-gray-500 ml-1"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded details */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`
              mx-2 p-4 rounded-b-2xl border border-t-0 ${styles.border}
              bg-gradient-to-b ${styles.bg}
            `}>
              {details.description && (
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  {details.description}
                </p>
              )}
              {details.location && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>📍</span>
                  <span className="font-medium">{details.location}</span>
                </div>
              )}
              {!isPast && (
                <div className="mt-3 pt-3 border-t border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-primary-400 animate-pulse' : 'bg-primary-600'}`} />
                    <span className="text-xs text-primary-400 font-semibold">
                      {isCurrent ? 'Happening Now' : <><MiniCountdown targetDate={event.dateTime} /> until start</>}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ScheduleTimeline({ schedule, editableSchedule }) {
  const [now, setNow] = useState(new Date());
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getEventStatus = (event, allEvents, eventIndex) => {
    const eventTime = new Date(event.dateTime).getTime();
    const endTime = event.endTime ? new Date(event.endTime).getTime() : null;
    const currentTime = now.getTime();

    if (endTime && currentTime >= eventTime && currentTime < endTime) return 'current';
    if (!endTime && eventIndex < allEvents.length - 1) {
      const nextEvent = allEvents[eventIndex + 1];
      const nextTime = new Date(nextEvent.dateTime).getTime();
      if (currentTime >= eventTime && currentTime < nextTime) return 'current';
    }
    if (currentTime >= eventTime) return 'past';

    const allFlat = (editableSchedule || schedule).flatMap(d => d.events);
    const firstFuture = allFlat.find(e => new Date(e.dateTime).getTime() > currentTime);
    if (firstFuture && firstFuture.id === event.id) return 'next';

    return 'future';
  };

  const data = editableSchedule || schedule;

  return (
    <motion.section
      className="py-12 px-4 md:px-8 max-w-3xl mx-auto relative z-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
    >
      {/* Section header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl md:text-3xl font-black dark:text-white text-gray-800">
          📅 Event Schedule
        </h3>
        <p className="text-sm dark:text-gray-500 text-gray-400 mt-2">
          Tap any event to see details
        </p>
      </motion.div>

      {/* Day tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {data.map((dayData, i) => (
          <motion.button
            key={dayData.day}
            onClick={() => setActiveDay(i)}
            className={`
              px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
              ${activeDay === i
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow'
                : 'bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:text-white hover:border-primary-500/20'
              }
            `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {dayData.day}
            <span className="ml-2 text-xs opacity-60">{dayData.date.slice(5)}</span>
          </motion.button>
        ))}
      </div>

      {/* Events list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay}
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {data[activeDay].events.map((event, index) => {
            const status = getEventStatus(event, data[activeDay].events, index);
            return (
              <EventCard
                key={event.id}
                event={event}
                status={status}
                index={index}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Bottom info */}
      <motion.p
        className="text-center text-xs dark:text-gray-600 text-gray-400 mt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {data[activeDay].events.length} events · {data[activeDay].day}, April {activeDay === 0 ? '24' : '25'}, 2026
      </motion.p>
    </motion.section>
  );
}
