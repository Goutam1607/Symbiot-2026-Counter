import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHEDULE } from '../utils/schedule';

function pad(n) {
  return String(Math.floor(Math.max(0, n))).padStart(2, '0');
}

function formatTime(seconds) {
  if (seconds == null) return '';
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  return `${pad(m)}:${pad(sec)}`;
}

function FlowNode({ phase, status, index, total, isExpanded, onToggle, phaseRemaining, zoom = 1 }) {
  const isCurrent = status === 'current';
  const isNext    = status === 'next';
  const isPast    = status === 'past';

  // GAP phase: never show as current (no highlight)
  const showAsActive = isCurrent && !phase.isGap;

  return (
    <motion.div
      className="relative flex items-start gap-4 group"
      style={{ paddingBottom: `${0.5 * zoom}rem` }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0 relative" style={{ width: 24 * zoom }}>
        {index > 0 && <div className="w-[1px] h-4 dark:bg-white/[0.06] bg-gray-200" />}
        {index === 0 && <div className="h-4" />}

        <div className="relative">
          {showAsActive && (
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
              ${showAsActive
                ? 'bg-cyan-500 dark:shadow-[0_0_12px_rgba(6,182,212,0.5)] shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'dark:bg-white/10 bg-gray-300'
              }`}
            style={{ width: 8 * zoom, height: 8 * zoom }}
          />
        </div>

        {index < total - 1 && (
          <div className="w-[1px] flex-1 min-h-[16px] dark:bg-white/[0.06] bg-gray-200" />
        )}
      </div>

      {/* Content card */}
      <motion.div
        className={`flex-1 mb-2 rounded-xl transition-all duration-500 cursor-pointer overflow-hidden
          ${showAsActive
            ? 'dark:bg-[rgba(6,182,212,0.18)] dark:border-cyan-500/30 bg-[#ECFEFF] border-l-[4px] border-cyan-500 border-t border-r border-b border-t-cyan-100/50 border-r-cyan-100/50 border-b-cyan-100/50 shadow-glow scale-[1.02]'
            : phase.isGap && isCurrent
            ? 'dark:bg-white/[0.04] dark:border-white/[0.04] bg-gray-50 border border-gray-100 opacity-60'
            : 'dark:bg-[rgba(6,182,212,0.08)] dark:border-white/[0.06] bg-white border border-gray-100 shadow-sm hover:border-cyan-500/20'
          }
        `}
        style={{ padding: `${0.75 * zoom}rem`, marginLeft: '-4px' }}
        onClick={onToggle}
        whileHover={!isPast ? { scale: showAsActive ? 1.02 : 1.03, x: 4, transition: { duration: 0.2 } } : {}}
        animate={showAsActive ? {
          boxShadow: ['0 0 10px rgba(6,182,212,0.2)', '0 0 20px rgba(6,182,212,0.4)', '0 0 10px rgba(6,182,212,0.2)']
        } : {}}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5" style={{ fontSize: `${1.2 * zoom}rem` }}>{phase.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold truncate ${showAsActive ? 'dark:text-cyan-400 text-cyan-700' : 'dark:text-white text-gray-900'}`}
                  style={{ fontSize: `${1.1 * zoom}rem` }}
                >
                  {phase.name}
                </span>
                {showAsActive && (
                  <span
                    className="px-2 py-0.5 rounded font-black tracking-wider uppercase dark:bg-cyan-500/20 dark:text-cyan-400 bg-cyan-100 text-cyan-700"
                    style={{ fontSize: `${8 * zoom}px` }}
                  >
                    Live
                  </span>
                )}
                {isNext && (
                  <span
                    className="px-2 py-0.5 rounded font-black tracking-wider uppercase dark:bg-amber-500/20 dark:text-amber-400 bg-amber-100 text-amber-700"
                    style={{ fontSize: `${8 * zoom}px` }}
                  >
                    Next
                  </span>
                )}
                {phase.isGap && isCurrent && (
                  <span
                    className="px-2 py-0.5 rounded font-black tracking-wider uppercase dark:bg-gray-500/20 dark:text-gray-400 bg-gray-100 text-gray-500"
                    style={{ fontSize: `${8 * zoom}px` }}
                  >
                    Hackathon in Progress
                  </span>
                )}
              </div>

              {/* Phase countdown — inline with title */}
              {showAsActive && phaseRemaining != null && (
                <div className="flex items-center gap-1.5 flex-shrink-0" style={{ fontSize: `${0.85 * zoom}rem` }}>
                  <span className="dark:text-gray-400 text-gray-500 font-bold uppercase tracking-wider text-[9px] mt-0.5">
                    ⏱ Ends in:
                  </span>
                  <span
                    className="font-black tabular-nums dark:text-[#22D3EE] text-cyan-700"
                    style={{
                      textShadow: '0 0 8px rgba(34, 211, 238, 0.6)'
                    }}
                  >
                    {formatTime(phaseRemaining)}
                  </span>
                </div>
              )}
            </div>
            
            {/* Show real time range */}
            <div className="flex items-center justify-between mt-1">
              <span
                className="font-bold tracking-wide dark:text-[#A5F3FC] text-cyan-700"
                style={{ fontSize: `${0.95 * zoom}rem` }}
              >
                {phase.time}
              </span>

              {!isPast && (
                <motion.span
                  className="dark:text-gray-600 text-gray-300 flex-shrink-0 cursor-pointer"
                  style={{ fontSize: `${12 * zoom}px` }}
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                >
                  ▾
                </motion.span>
              )}
            </div>
          </div>
        </div>

        {/* Expanded detail */}
        <AnimatePresence>
          {isExpanded && !isPast && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 dark:border-white/[0.05] border-gray-100 border-t">
                <p
                  className="dark:text-gray-300 text-gray-600 leading-relaxed font-medium"
                  style={{ fontSize: `${0.85 * zoom}rem` }}
                >
                  {phase.description || phase.name}
                </p>
                {phase.location && (
                  <p
                    className="dark:text-cyan-500/70 text-cyan-600/70 mt-1.5 font-bold tracking-wide"
                    style={{ fontSize: `${0.75 * zoom}rem` }}
                  >
                    📍 {phase.location}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function LiveScheduleFlow({
  elapsedTime,
  currentPhase,
  nextPhase,
  phaseRemaining,
  zoom = 1,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const scrollRef  = useRef(null);
  const activeRef  = useRef(null);

  // Filter out GAPs for the timeline view so they don't clutter the display
  // Wait, if we filter them out, we won't see them on the timeline. 
  // Let's keep them so the timeline makes sense, or maybe user wants them?
  // User just says: "Each event should show: Event Name, Time Range (clearly visible)".
  const displayEvents = SCHEDULE.filter(phase => !phase.isGap);

  // Auto-scroll to active phase
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const scrollTop = el.offsetTop - container.offsetTop - container.getBoundingClientRect().height / 3;
      container.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    }
  }, [currentPhase?.id]);

  const getStatus = (phase) => {
    if (currentPhase && phase.id === currentPhase.id) return 'current';
    if (nextPhase    && phase.id === nextPhase.id)    return 'next';
    return 'none';
  };

  const isGap        = currentPhase?.isGap;
  const displayCurrent = isGap ? null : currentPhase;
  const displayNext    = nextPhase;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h3 className="text-sm font-bold tracking-[0.2em] uppercase dark:text-gray-400 text-gray-500 mb-2">
          Live Schedule
        </h3>

        {isGap && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-xl">🚀</span>
            <span className="text-sm font-bold dark:text-gray-300 text-gray-600">Hackathon in Progress</span>
          </motion.div>
        )}

        {displayCurrent && (
          <motion.div
            className="flex items-center gap-3"
            key={displayCurrent.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-2xl">{displayCurrent.emoji}</span>
            <div>
              <span className="text-base font-black dark:text-cyan-400 text-cyan-700 tracking-wide">{displayCurrent.name}</span>
              {phaseRemaining != null && (
                <span className="text-sm dark:text-gray-400 text-gray-500 ml-2 font-mono tabular-nums font-bold">
                  ends in {formatTime(phaseRemaining)}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {displayNext && (
          <div className="text-xs font-bold tracking-wide dark:text-cyan-200/50 text-cyan-600/60 mt-1 flex items-center gap-2">
            <span>→</span>
            <span>{displayNext.emoji} {displayNext.name}</span>
            <span className="dark:text-[#A5F3FC]/70 text-cyan-700/70">({displayNext.time})</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-5 h-[1px] dark:bg-gradient-to-r dark:from-cyan-500/30 dark:via-cyan-500/10 dark:to-transparent
                      bg-gradient-to-r from-cyan-500/20 via-gray-200 to-transparent" />

      {/* Scrollable phase list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-0 relative"
        style={{ scrollbarWidth: 'thin' }}
      >
        {displayEvents.map((phase, index) => {
          const status = getStatus(phase);
          const isCurrent = status === 'current';
          return (
            <div key={phase.id} ref={isCurrent ? activeRef : undefined}>
              <FlowNode
                phase={phase}
                status={status}
                index={index}
                total={displayEvents.length}
                isExpanded={expandedId === phase.id}
                onToggle={() => setExpandedId(expandedId === phase.id ? null : phase.id)}
                phaseRemaining={isCurrent ? phaseRemaining : null}
                zoom={zoom}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom: Up Next banner */}
      {displayNext && (
        <div
          className="px-6 py-5 dark:bg-cyan-500/10 bg-cyan-50 border-t dark:border-white/10 border-cyan-100 shadow-[0_-4px_25px_rgba(0,0,0,0.15)]"
          style={{ padding: `${1.25 * zoom}rem ${1.5 * zoom}rem` }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-black tracking-[0.2em] uppercase dark:text-cyan-500/80 text-cyan-600/80"
              style={{ fontSize: `${0.85 * zoom}rem` }}
            >
              Up Next
            </span>
            <div className="flex items-center gap-4">
              <span style={{ fontSize: `${1.8 * zoom}rem` }}>{displayNext.emoji}</span>
              <div className="flex flex-col items-end">
                <span
                  className="font-black dark:text-white text-gray-900 leading-tight mb-0.5"
                  style={{ fontSize: `${1.1 * zoom}rem` }}
                >
                  {displayNext.name}
                </span>
                <span
                  className="font-black dark:text-[#A5F3FC] text-cyan-600 tracking-wide uppercase"
                  style={{ fontSize: `${0.8 * zoom}rem` }}
                >
                  {displayNext.time}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
