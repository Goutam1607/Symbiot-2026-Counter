import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function TimeEditModal({ hours, minutes, seconds, onSave, onClose }) {
  const [h, setH] = useState(hours);
  const [m, setM] = useState(minutes);
  const [s, setS] = useState(seconds);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="p-6 rounded-3xl max-w-sm w-full mx-4
                   dark:bg-[#0f1932] dark:border-white/10
                   bg-white border border-gray-200 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-4">Edit Timer</h3>
        <div className="flex gap-3 mb-6">
          {[
            { label: 'Hours', value: h, set: setH, max: 24 },
            { label: 'Minutes', value: m, set: setM, max: 59 },
            { label: 'Seconds', value: s, set: setS, max: 59 },
          ].map(({ label, value, set, max }) => (
            <div key={label} className="flex-1">
              <label className="block text-[10px] dark:text-gray-500 text-gray-400 font-bold tracking-widest uppercase mb-1">{label}</label>
              <input
                type="number"
                min={0}
                max={max}
                value={value}
                onChange={e => set(Math.max(0, Math.min(max, parseInt(e.target.value) || 0)))}
                className="w-full px-3 py-3 rounded-xl text-center text-2xl font-black outline-none transition-all
                           dark:bg-white/5 dark:border-white/10 dark:text-white
                           bg-gray-50 border border-gray-200 text-gray-900
                           focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all
                       dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5
                       border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(h, m, s); onClose(); }}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-bold
                       hover:shadow-glow transition-all"
          >
            Set Time
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HackathonTimer({
  hours, minutes, seconds,
  isRunning, progress,
  onStart, onPause, onReset, onSetTime,
  phaseInfo,
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Detect theme
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  const timerColor = isDark ? '#FFFFFF' : '#0F172A';
  const colonColor = isDark ? '#06B6D4' : '#0891B2';
  const mutedColor = isDark ? 'text-gray-500' : 'text-gray-400';
  const labelColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const phaseTextColor = isDark ? 'text-cyan-400' : 'text-cyan-700';

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4">
      {/* Label */}
      <div className="mb-6 text-center">
        <div className="flex items-center gap-2 justify-center mb-1">
          {isRunning && (
            <motion.div
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          <span className={`text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase ${labelColor}`}>
            {isRunning ? 'Hackathon Live Timer' : 'Hackathon Timer'}
          </span>
        </div>
      </div>

      {/* Main time display — clean, no animations on digits */}
      <div className="text-center">
        <div className="flex items-baseline justify-center">
          {/* Hours */}
          <span
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold tabular-nums leading-none"
            style={{
              color: timerColor,
              textShadow: isDark && isRunning ? '0 0 30px rgba(6,182,212,0.15)' : 'none',
              letterSpacing: '-0.02em',
            }}
          >
            {pad(hours)}
          </span>

          {/* Colon 1 */}
          <motion.span
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mx-1 md:mx-2 self-center"
            style={{ color: colonColor }}
            animate={isRunning ? { opacity: [1, 0.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            :
          </motion.span>

          {/* Minutes */}
          <span
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold tabular-nums leading-none"
            style={{
              color: timerColor,
              textShadow: isDark && isRunning ? '0 0 30px rgba(6,182,212,0.15)' : 'none',
              letterSpacing: '-0.02em',
            }}
          >
            {pad(minutes)}
          </span>

          {/* Colon 2 */}
          <motion.span
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mx-1 md:mx-2 self-center"
            style={{ color: colonColor }}
            animate={isRunning ? { opacity: [1, 0.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          >
            :
          </motion.span>

          {/* Seconds */}
          <span
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold tabular-nums leading-none"
            style={{
              color: timerColor,
              textShadow: isDark && isRunning ? '0 0 30px rgba(6,182,212,0.15)' : 'none',
              letterSpacing: '-0.02em',
            }}
          >
            {pad(seconds)}
          </span>
        </div>

        {/* Labels underneath */}
        <div className="flex justify-center mt-3 gap-16 md:gap-20 lg:gap-24">
          <span className={`text-[9px] font-bold tracking-[0.25em] uppercase ${mutedColor}`}>Hours</span>
          <span className={`text-[9px] font-bold tracking-[0.25em] uppercase ${mutedColor}`}>Minutes</span>
          <span className={`text-[9px] font-bold tracking-[0.25em] uppercase ${mutedColor}`}>Seconds</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mt-8 mb-2">
        <div className={`h-1 rounded-full w-full ${isDark ? 'bg-white/[0.06]' : 'bg-gray-200'}`}>
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
            style={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className={`text-[9px] font-bold tracking-widest ${mutedColor}`}>
            {Math.round(progress * 100)}% ELAPSED
          </span>
          <span className={`text-[9px] font-bold tracking-widest ${mutedColor}`}>
            24:00:00
          </span>
        </div>
      </div>

      {/* Phase info */}
      {phaseInfo && (
        <div className="mt-4 text-center space-y-1">
          {phaseInfo.currentPhase && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">{phaseInfo.currentPhase.emoji}</span>
              <span className={`text-xs font-bold ${phaseTextColor}`}>
                CURRENT: {phaseInfo.currentPhase.name}
              </span>
              {phaseInfo.phaseTimeRemaining != null && (
                <span className={`text-[10px] font-mono ${mutedColor}`}>
                  ends in {Math.floor(phaseInfo.phaseTimeRemaining / 60)}m {phaseInfo.phaseTimeRemaining % 60}s
                </span>
              )}
            </div>
          )}
          {phaseInfo.nextPhase && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm">{phaseInfo.nextPhase.emoji}</span>
              <span className={`text-[11px] ${mutedColor}`}>
                NEXT: {phaseInfo.nextPhase.name}
                {phaseInfo.phaseTimeRemaining != null && !phaseInfo.currentPhase && (
                  <span className="ml-1 text-cyan-600 dark:text-cyan-500/70">
                    in {Math.floor(phaseInfo.phaseTimeRemaining / 60)}m
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      )}

      {/* NO buttons here — controls moved to admin panel */}

      {/* Edit modal (can still be triggered from admin) */}
      <AnimatePresence>
        {showEdit && (
          <TimeEditModal
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            onSave={onSetTime}
            onClose={() => setShowEdit(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
