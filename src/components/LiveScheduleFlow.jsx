import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHEDULE } from '../utils/schedule';

function PhaseCountdown({ seconds }) {
  if (seconds == null) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const h = Math.floor(m / 60);
  const rm = m % 60;

  return (
    <span className="tabular-nums font-mono">
      {h > 0 ? `${String(h).padStart(2, '0')}:` : ''}{String(rm).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
}

function FlowNode({ event, status, index, isExpanded, onToggle, phaseTimeRemaining, total }) {
  const isCurrent = status === 'current';
  const isNext = status === 'next';
  const isPast = status === 'past';

  return (
    <motion.div
      className="relative flex items-start gap-4 group"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0 relative" style={{ width: 24 }}>
        {index > 0 && (
          <div className="w-[1px] h-4 dark:bg-white/[0.06] bg-gray-200" />
        )}
        {index === 0 && <div className="h-4" />}

        {/* Dot */}
        <div className="relative">
          {isCurrent && (
            <motion.div
              className="absolute -inset-2 rounded-full dark:bg-cyan-500/20 bg-cyan-500/15"
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          {isNext && (
            <motion.div
              className="absolute -inset-1.5 rounded-full border dark:border-cyan-500/30 border-cyan-500/25"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          <div
            className={`w-2.5 h-2.5 rounded-full relative z-10 transition-all duration-300
              ${isCurrent ? 'bg-cyan-500 dark:shadow-[0_0_12px_rgba(6,182,212,0.5)] shadow-[0_0_8px_rgba(6,182,212,0.3)]' :
                'dark:bg-white/10 bg-gray-300'
              }
            `}
          />
        </div>

        {index < total - 1 && (
          <div className="w-[1px] flex-1 min-h-[16px] dark:bg-white/[0.06] bg-gray-200" />
        )}
      </div>

      {/* Content */}
      <motion.div
        className={`flex-1 mb-2 rounded-xl transition-all duration-500 cursor-pointer overflow-hidden
          ${isCurrent
            ? 'dark:bg-[rgba(6,182,212,0.18)] dark:border-cyan-500/30 bg-[#ECFEFF] border-l-[4px] border-cyan-500 border-t border-r border-b border-t-cyan-100/50 border-r-cyan-100/50 border-b-cyan-100/50 p-3 -ml-1 shadow-glow scale-[1.02]'
            : 'dark:bg-[rgba(6,182,212,0.08)] dark:border-white/[0.06] bg-white border border-gray-100 shadow-sm p-3 -ml-1 hover:border-cyan-500/20'
          }
        `}
        onClick={onToggle}
        whileHover={!isPast ? { scale: isCurrent ? 1.02 : 1.03, x: 4, transition: { duration: 0.2 } } : {}}
        animate={isCurrent ? {
          boxShadow: ['0 0 10px rgba(6,182,212,0.2)', '0 0 20px rgba(6,182,212,0.4)', '0 0 10px rgba(6,182,212,0.2)']
        } : {}}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{event.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-base md:text-lg font-bold truncate
                ${isCurrent ? 'dark:text-cyan-400 text-cyan-700' : 'dark:text-white text-gray-900'}
              `}>
                {event.name}
              </span>
              {isCurrent && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase
                                 dark:bg-cyan-500/20 dark:text-cyan-400
                                 bg-cyan-100 text-cyan-700">
                  Live
                </span>
              )}
              {isNext && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase
                                 dark:bg-amber-500/20 dark:text-amber-400
                                 bg-amber-100 text-amber-700">
                  Next
                </span>
              )}
            </div>
            <span className={`text-xs md:text-sm font-medium ${isCurrent ? 'dark:text-cyan-300/60 text-cyan-600' : 'dark:text-[#CBD5F5] text-gray-500'}`}>
              {event.time}
            </span>
          </div>

          {isCurrent && phaseTimeRemaining != null && (
            <div className="text-right flex-shrink-0">
              <div className="text-[8px] dark:text-gray-500 text-gray-400 font-bold tracking-wider uppercase">Ends in</div>
              <div className="text-xs dark:text-cyan-400 text-cyan-700 font-black">
                <PhaseCountdown seconds={phaseTimeRemaining} />
              </div>
            </div>
          )}

          {!isPast && (
            <motion.span
              className="dark:text-gray-600 text-gray-300 text-[10px] flex-shrink-0"
              animate={{ rotate: isExpanded ? 180 : 0 }}
            >
              ▾
            </motion.span>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && !isPast && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 pt-2 dark:border-white/[0.05] border-gray-100 border-t">
                <p className="text-[11px] dark:text-gray-400 text-gray-500 leading-relaxed">
                  {event.description || `${event.name} — ${event.time}`}
                </p>
                {event.location && (
                  <p className="text-[10px] dark:text-gray-500 text-gray-400 mt-1">📍 {event.location}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function LiveScheduleFlow({ currentPhase, nextPhase, phaseTimeRemaining, overridePhaseId }) {
  const [expandedId, setExpandedId] = useState(null);
  const scrollRef = useRef(null);
  const activeRef = useRef(null);
  const allEvents = SCHEDULE.flatMap(d => d.events.map(e => ({
    ...e,
    description: getDescription(e.id),
    location: getLocation(e.id),
  })));

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const scrollTop = el.offsetTop - container.offsetTop - containerRect.height / 3;
      container.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    }
  }, [currentPhase?.id]);

  const getStatus = (event) => {
    // Manual Admin Override
    if (overridePhaseId && event.id === overridePhaseId) return 'current';
    
    // Automatic Detection
    if (!overridePhaseId && currentPhase && event.id === currentPhase.id) return 'current';
    
    // Next Detection
    if (nextPhase && event.id === nextPhase.id) return 'next';
    
    return 'none';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <h3 className="text-sm font-bold tracking-[0.2em] uppercase dark:text-gray-400 text-gray-500 mb-1">
          Live Schedule
        </h3>
        {currentPhase && (
          <motion.div
            className="flex items-center gap-2"
            key={currentPhase.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-xl">{currentPhase.emoji}</span>
            <div>
              <span className="text-sm font-bold dark:text-cyan-400 text-cyan-700">{currentPhase.name}</span>
              {phaseTimeRemaining != null && (
                <span className="text-xs dark:text-gray-500 text-gray-400 ml-2 font-mono">
                  ends in <PhaseCountdown seconds={phaseTimeRemaining} />
                </span>
              )}
            </div>
          </motion.div>
        )}
        {nextPhase && (
          <div className="text-[11px] dark:text-gray-500 text-gray-400 mt-1 flex items-center gap-1">
            <span>→</span>
            <span>{nextPhase.emoji} {nextPhase.name}</span>
            <span className="dark:text-cyan-500/50 text-cyan-600/60">({nextPhase.time})</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 h-[1px] dark:bg-gradient-to-r dark:from-cyan-500/20 dark:via-cyan-500/10 dark:to-transparent
                      bg-gradient-to-r from-cyan-500/15 via-gray-200 to-transparent" />

      {/* Scrollable timeline */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-0 relative"
        style={{ scrollbarWidth: 'thin' }}
      >
        {allEvents.map((event, index) => {
          const status = getStatus(event);
          const isCurrent = status === 'current';
          return (
            <div key={event.id} ref={isCurrent ? activeRef : undefined}>
              <FlowNode
                event={event}
                status={status}
                index={index}
                total={allEvents.length}
                isExpanded={expandedId === event.id}
                onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
                phaseTimeRemaining={isCurrent ? phaseTimeRemaining : null}
              />
            </div>
          );
        })}
      </div>

      {/* Next Event Indicator (Bottom) — Scaled up for better visibility */}
      {nextPhase && (
        <div className="px-5 py-4 dark:bg-cyan-500/10 bg-cyan-50 border-t dark:border-white/10 border-cyan-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-[0.2em] uppercase dark:text-cyan-500/80 text-cyan-600/80">
              Up Next
            </span>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nextPhase.emoji}</span>
              <div className="flex flex-col items-end">
                <span className="text-sm md:text-base font-black dark:text-white text-gray-900 leading-tight">
                  {nextPhase.name}
                </span>
                <span className="text-[11px] font-bold dark:text-cyan-400 text-cyan-600 tracking-wide uppercase">
                  Starting at {nextPhase.time.split(' – ')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getDescription(id) {
  const map = {
    reg: 'Check in with your team, collect ID cards, swag kits, and workspace assignments.',
    inaug: 'Opening ceremony with keynote speakers, rules overview, and official hackathon kickoff.',
    design: 'Phase I — Brainstorm, design solutions, create wireframes and technical architecture.',
    lunch1: 'Recharge with a freshly prepared meal. Network with other teams.',
    tea1: 'Quick refreshment break with chai, coffee, and snacks.',
    dinner: 'Evening meal break before the intense night coding session.',
    judge1: 'Phase II evaluation — Present your progress and get feedback from judges.',
    latenight: 'Midnight fuel! Hot tea and snacks for the night owls.',
    breakfast: 'Start your final day with a hearty breakfast before the final sprint.',
    final: 'Final evaluation — Present your completed project and demo your working prototype.',
    lunch2: 'Post-judgement lunch. Relax while judges deliberate.',
    vale: 'Closing ceremony — Winner announcements, prizes, certificates, and group photo!',
  };
  return map[id] || '';
}

function getLocation(id) {
  const map = {
    reg: 'Main Entrance Hall', inaug: 'Auditorium', design: 'Hack Arena',
    lunch1: 'Dining Hall', tea1: 'Dining Hall', dinner: 'Dining Hall',
    judge1: 'Judging Arena', latenight: 'Dining Hall', breakfast: 'Dining Hall',
    final: 'Judging Arena', lunch2: 'Dining Hall', vale: 'Auditorium',
  };
  return map[id] || '';
}
