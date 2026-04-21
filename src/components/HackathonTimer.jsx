import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function pad(n) {
  return String(Math.floor(Math.max(0, n))).padStart(2, '0');
}

function formatPhaseTime(seconds) {
  if (seconds == null) return null;
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  return `${pad(m)}:${pad(sec)}`;
}

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
        <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-1">Edit Remaining Time</h3>
        <p className="text-[11px] dark:text-gray-500 text-gray-400 mb-4">
          Sets hackathon elapsed time accordingly. Phase auto-updates.
        </p>
        <div className="flex gap-3 mb-6">
          {[
            { label: 'Hours',   value: h, set: setH, max: 24 },
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
  zoom = 1,
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [isDark, setIsDark]     = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const timerColor   = isDark ? '#FFFFFF' : '#0F172A';
  const colonColor   = isDark ? '#06B6D4' : '#0891B2';
  const mutedColor   = isDark ? 'text-gray-500' : 'text-gray-400';
  const labelColor   = isDark ? 'text-gray-400' : 'text-gray-500';

  const { currentPhase, nextPhase, phaseRemaining, isGap } = phaseInfo || {};

  const phaseTimeStr = formatPhaseTime(phaseRemaining);

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4">

      {/* Label */}
      <div className={`text-center transition-all duration-500 ${zoom > 1 ? 'mb-12' : 'mb-6'}`}>
        <div className="flex items-center gap-2 justify-center mb-1">
          {isRunning && (
            <motion.div
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          <span className={`font-bold tracking-[0.3em] uppercase transition-all duration-500 ${labelColor}
                           ${zoom <= 1.25 ? 'text-[10px] md:text-xs' : zoom <= 1.75 ? 'text-sm md:text-base' : 'text-base md:text-xl'}`}>
            {isRunning ? 'Hackathon Live Timer' : 'Hackathon Timer'}
          </span>
        </div>
      </div>

      {/* Main digits */}
      <div className="flex flex-col items-center justify-center w-full max-w-full">
        <div className="flex items-center justify-center w-full">

          {/* Hours */}
          <span className="font-extrabold tabular-nums leading-none transition-all duration-300"
            style={{
              color: timerColor,
              fontSize: `clamp(${2.5 * zoom}rem, ${9 * zoom}cqw, ${20 * zoom}rem)`,
              textShadow: isDark && isRunning ? `0 0 ${10 * zoom}px rgba(6,182,212,${0.1 * zoom})` : 'none',
              letterSpacing: '-0.02em',
            }}
          >
            {pad(hours)}
          </span>

          <motion.span className="font-extrabold mx-[1%] transition-all duration-300 flex items-center justify-center mb-[1%]"
            style={{ color: colonColor, fontSize: `clamp(${2 * zoom}rem, ${7.5 * zoom}cqw, ${16 * zoom}rem)`, lineHeight: 1 }}
            animate={isRunning ? { opacity: [1, 0.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >:</motion.span>

          {/* Minutes */}
          <span className="font-extrabold tabular-nums leading-none transition-all duration-300"
            style={{
              color: timerColor,
              fontSize: `clamp(${2.5 * zoom}rem, ${9 * zoom}cqw, ${20 * zoom}rem)`,
              textShadow: isDark && isRunning ? `0 0 ${10 * zoom}px rgba(6,182,212,${0.1 * zoom})` : 'none',
              letterSpacing: '-0.02em',
            }}
          >
            {pad(minutes)}
          </span>

          <motion.span className="font-extrabold mx-[1%] transition-all duration-300 flex items-center justify-center mb-[1%]"
            style={{ color: colonColor, fontSize: `clamp(${2 * zoom}rem, ${7.5 * zoom}cqw, ${16 * zoom}rem)`, lineHeight: 1 }}
            animate={isRunning ? { opacity: [1, 0.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          >:</motion.span>

          {/* Seconds */}
          <span className="font-extrabold tabular-nums leading-none transition-all duration-300"
            style={{
              color: timerColor,
              fontSize: `clamp(${2.5 * zoom}rem, ${9 * zoom}cqw, ${20 * zoom}rem)`,
              textShadow: isDark && isRunning ? `0 0 ${10 * zoom}px rgba(6,182,212,${0.1 * zoom})` : 'none',
              letterSpacing: '-0.02em',
            }}
          >
            {pad(seconds)}
          </span>
        </div>

        {/* H / M / S labels */}
        <div className={`flex justify-center transition-all duration-500 w-full
                        ${zoom === 1 ? 'mt-3 gap-[10%]' : zoom === 2 ? 'mt-6 gap-[12%]' : 'mt-10 gap-[15%]'}`}>
          {['Hours', 'Minutes', 'Seconds'].map(l => (
            <span key={l} className={`font-bold tracking-[0.25em] uppercase transition-all duration-500 ${mutedColor}
                                    ${zoom === 1 ? 'text-[8px] md:text-[1.1cqw]' : zoom === 2 ? 'text-xs md:text-[1.3cqw]' : 'text-base md:text-[1.8cqw]'}`}>
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className={`w-full transition-all duration-500 ${zoom === 1 ? 'max-w-[40%] mt-8' : zoom === 2 ? 'max-w-[60%] mt-12' : 'max-w-[80%] mt-16'} mb-2`}>
        <div className={`rounded-full w-full transition-all duration-500 ${zoom === 1 ? 'h-1' : zoom === 2 ? 'h-2' : 'h-3'} ${isDark ? 'bg-white/[0.06]' : 'bg-gray-200'}`}>
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
            style={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className={`font-bold tracking-widest transition-all duration-500 ${mutedColor}
                           ${zoom === 1 ? 'text-[9px] md:text-[1cqw]' : zoom === 2 ? 'text-[11px] md:text-[1.2cqw]' : 'text-sm md:text-[1.5cqw]'}`}>
            {Math.round(progress * 100)}% ELAPSED
          </span>
          <span className={`font-bold tracking-widest transition-all duration-500 ${mutedColor}
                           ${zoom === 1 ? 'text-[9px] md:text-[1cqw]' : zoom === 2 ? 'text-[11px] md:text-[1.2cqw]' : 'text-sm md:text-[1.5cqw]'}`}>
            24:00:00
          </span>
        </div>
      </div>

      {/* Phase info - POLISHED FOR PROJECTOR */}
      <div className={`text-center transition-all duration-500 w-full flex flex-col items-center
                      ${zoom === 1 ? 'mt-8 space-y-4' : zoom === 2 ? 'mt-12 space-y-6' : 'mt-16 space-y-8'}`}>

        {/* GAP banner */}
        {isGap && (
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`transition-all duration-500 ${zoom === 1 ? 'text-2xl' : zoom === 2 ? 'text-4xl' : 'text-5xl'}`}>
              🚀
            </span>
            <motion.span 
              className={`font-black tracking-wide transition-all duration-500 
                         ${isDark ? 'text-[#EAF9FF]' : 'text-cyan-900'}
                         ${zoom === 1 ? 'text-xl' : zoom === 2 ? 'text-3xl' : 'text-4xl'}`}
              style={{
                textShadow: isDark ? '0 0 10px rgba(34, 211, 238, 0.6)' : 'none'
              }}
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              Hackathon in Progress
            </motion.span>
          </motion.div>
        )}

        {/* Current phase */}
        {!isGap && currentPhase && (
          <div className="flex items-center justify-center gap-3">
            <span className={`transition-all duration-500 ${zoom === 1 ? 'text-2xl' : zoom === 2 ? 'text-4xl' : 'text-5xl'}`}>
              {currentPhase.emoji}
            </span>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <span className={`font-black uppercase tracking-wider transition-all duration-500
                               ${isDark ? 'text-[#EAF9FF]' : 'text-gray-900'}
                               ${zoom === 1 ? 'text-xl' : zoom === 2 ? 'text-3xl' : 'text-4xl'}`}>
                CURRENT:
              </span>
              <span className={`font-black tracking-wide transition-all duration-500 
                               ${isDark ? 'text-[#22D3EE]' : 'text-cyan-600'}
                               ${zoom === 1 ? 'text-xl' : zoom === 2 ? 'text-3xl' : 'text-4xl'}`}
                    style={{
                      textShadow: isDark ? '0 0 10px rgba(34, 211, 238, 0.6)' : 'none'
                    }}
              >
                {currentPhase.name}
              </span>
            </div>
            {phaseTimeStr && (
              <span className={`font-mono font-bold transition-all duration-500 ml-2
                               ${isDark ? 'text-gray-300' : 'text-gray-500'}
                               ${zoom === 1 ? 'text-sm' : zoom === 2 ? 'text-xl' : 'text-2xl'}`}>
                (ends in {phaseTimeStr})
              </span>
            )}
          </div>
        )}

        {/* Next phase */}
        {nextPhase && (
          <div className="flex items-center justify-center gap-2">
            <span className={`transition-all duration-500 ${zoom === 1 ? 'text-lg' : zoom === 2 ? 'text-2xl' : 'text-3xl'}`}>
              {nextPhase.emoji}
            </span>
            <span className={`font-bold transition-all duration-500 uppercase tracking-widest
                             ${isDark ? 'text-[#EAF9FF]' : 'text-gray-800'}
                             ${zoom === 1 ? 'text-lg' : zoom === 2 ? 'text-2xl' : 'text-3xl'}`}>
              NEXT: 
            </span>
            <span className={`font-bold transition-all duration-500 tracking-wide ml-1
                             ${isDark ? 'text-[#22D3EE]' : 'text-cyan-600'}
                             ${zoom === 1 ? 'text-lg' : zoom === 2 ? 'text-2xl' : 'text-3xl'}`}
                  style={{
                    textShadow: isDark ? '0 0 10px rgba(34, 211, 238, 0.3)' : 'none'
                  }}
            >
              {nextPhase.name}
            </span>
          </div>
        )}
      </div>

      {/* Edit modal */}
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
