import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHEDULE, TOTAL_SECONDS } from '../utils/schedule';

export default function AdminPanel({
  isRunning, isPaused,
  hours, minutes, seconds, elapsedTime,
  onStart, onPause, onReset, onSetTime,
  onJumpToPhase, currentPhaseIndex,
  threshold, onSetThreshold,
  onSkipVoice,
  timerZoom, onSetTimerZoom,
  scheduleZoom, onSetScheduleZoom,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Local state for the set-time inputs
  const [editH, setEditH] = useState('');
  const [editM, setEditM] = useState('');
  const [editS, setEditS] = useState('');

  const handleSetTime = () => {
    const h = parseInt(editH) || 0;
    const m = parseInt(editM) || 0;
    const s = parseInt(editS) || 0;
    onSetTime(h, m, s);
    setEditH(''); setEditM(''); setEditS('');
  };

  const adjustTime = (delta) => {
    // delta in seconds applied to remaining time
    const remaining = TOTAL_SECONDS - elapsedTime;
    const newRemaining = Math.max(0, Math.min(remaining + delta, TOTAL_SECONDS));
    const newH = Math.floor(newRemaining / 3600);
    const newM = Math.floor((newRemaining % 3600) / 60);
    const newS = Math.floor(newRemaining % 60);
    onSetTime(newH, newM, newS);
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 w-8 h-8 rounded-lg
                   flex items-center justify-center text-xs
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-gray-500
                   bg-white/80 border border-gray-200 text-gray-400 shadow-sm
                   hover:border-cyan-500/30 hover:text-cyan-600 dark:hover:text-cyan-400
                   transition-all opacity-40 hover:opacity-100"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Admin Controls"
      >
        ⚙
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 dark:bg-black/50 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-80 md:w-96 z-50 overflow-y-auto
                         dark:bg-[#0a0f1e] dark:border-r dark:border-white/[0.06]
                         bg-white border-r border-gray-200 shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-base font-bold dark:text-white text-gray-900 flex items-center gap-2">
                    <span className="text-cyan-500">⚙</span> Admin Controls
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs
                               dark:bg-white/5 dark:text-gray-500 dark:hover:text-white
                               bg-gray-100 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* ── Timer Controls ── */}
                <Section title="⏱ Main Timer">
                  {/* Current time badge */}
                  <div className="text-center mb-3 font-black tabular-nums dark:text-white text-gray-900 text-2xl">
                    {pad(hours)}:{pad(minutes)}:{pad(seconds)}
                    <span className="text-xs dark:text-gray-500 text-gray-400 font-normal ml-2 tracking-widest">remaining</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={isRunning && !isPaused ? onPause : onStart}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isRunning && !isPaused
                          ? 'dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                      }`}
                    >
                      {isRunning && !isPaused ? '⏸ Pause' : '▶ Start'}
                    </button>
                    <button
                      onClick={onReset}
                      className="py-2.5 rounded-xl text-xs font-bold transition-all
                                 dark:bg-white/5 dark:text-gray-400 dark:border-white/10
                                 bg-gray-50 text-gray-500 border border-gray-200
                                 hover:border-red-300 dark:hover:border-red-500/20"
                    >
                      ↺ Full Reset
                    </button>
                  </div>

                  {/* Quick adjustments */}
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {[
                      { label: '-30m', delta: -1800 },
                      { label: '-5m',  delta: -300  },
                      { label: '-1m',  delta: -60   },
                      { label: '+1m',  delta: 60    },
                      { label: '+5m',  delta: 300   },
                      { label: '+30m', delta: 1800  },
                      { label: '+1h',  delta: 3600  },
                    ].map(({ label, delta }) => (
                      <button
                        key={label}
                        onClick={() => adjustTime(delta)}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
                                   dark:bg-white/5 dark:text-gray-400 dark:border-white/[0.06] dark:hover:border-cyan-500/20 dark:hover:text-cyan-400
                                   bg-gray-50 text-gray-500 border border-gray-200 hover:border-cyan-300 hover:text-cyan-600"
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* End time input */}
                  <div className="dark:bg-white/[0.02] bg-gray-50 rounded-xl p-3 border dark:border-white/[0.05] border-gray-100">
                    <p className="text-[10px] dark:text-gray-500 text-gray-400 font-bold tracking-wider uppercase mb-2">
                      Set End Date & Time
                    </p>
                    <div className="flex gap-2 flex-col xl:flex-row items-center">
                      <input
                        type="datetime-local"
                        value={editH}
                        onChange={e => setEditH(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs font-black outline-none
                                   dark:bg-white/5 dark:border-white/10 dark:text-white
                                   bg-white border border-gray-200 text-gray-900
                                   focus:border-cyan-500"
                      />
                      <button
                        onClick={() => {
                          if (!editH) return;
                          const targetDate = new Date(editH);
                          const remainingMs = targetDate.getTime() - Date.now();
                          if (remainingMs <= 0) {
                            alert('End time must be in the future!');
                            return;
                          }
                          const remainingSeconds = Math.floor(remainingMs / 1000);
                          const newH = Math.floor(remainingSeconds / 3600);
                          const newM = Math.floor((remainingSeconds % 3600) / 60);
                          const newS = Math.floor(remainingSeconds % 60);
                          onSetTime(newH, newM, newS);
                          setEditH('');
                        }}
                        className="w-full xl:w-auto px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500 text-white hover:bg-cyan-400 transition-all whitespace-nowrap"
                      >
                        Set End Time
                      </button>
                    </div>
                    <p className="text-[9px] dark:text-gray-600 text-gray-400 mt-1.5">
                      Automatically calculates remaining time to precisely hit 00:00:00 at the target date.
                    </p>
                  </div>
                </Section>

                {/* ── Phase Jump ── */}
                <Section title="🎯 Jump to Phase">
                  <p className="text-[10px] dark:text-gray-500 text-gray-400 mb-3">
                    Instantly set elapsed time to the start of any phase. All timers sync automatically.
                  </p>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {SCHEDULE.map((phase, index) => {
                      const isActive = index === currentPhaseIndex;
                      return (
                        <button
                          key={phase.id}
                          onClick={() => { onJumpToPhase(index); setIsOpen(false); }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2
                            ${isActive
                              ? 'dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20 bg-cyan-50 text-cyan-700 border border-cyan-200'
                              : 'dark:bg-white/[0.02] dark:text-gray-400 dark:hover:bg-white/5 bg-white text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-100'
                            }`}
                        >
                          <span className="text-base">{phase.emoji}</span>
                          <span className="flex-1">{phase.name}</span>
                          {phase.isGap && (
                            <span className="text-[9px] dark:text-gray-600 text-gray-300 font-bold uppercase tracking-wider">gap</span>
                          )}
                          {isActive && (
                            <span className="text-[9px] dark:text-cyan-500 text-cyan-600 font-black uppercase tracking-wider">● live</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Section>

                {/* ── Voice Activation ── */}
                <Section title="🎤 Voice Activation">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] dark:text-gray-500 text-gray-400 font-bold tracking-wider uppercase mb-1 block">
                        Decibel Threshold: {threshold}
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={threshold}
                        onChange={e => onSetThreshold(Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <button
                      onClick={() => { onSkipVoice(); setIsOpen(false); }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold transition-all
                                 dark:bg-white/5 dark:text-gray-400 dark:border-white/[0.06] dark:hover:border-cyan-500/20
                                 bg-gray-50 text-gray-500 border border-gray-200 hover:border-cyan-300"
                    >
                      ⏭ Skip Voice Activation
                    </button>
                  </div>
                </Section>

                {/* ── Display Settings ── */}
                <Section title="📺 Display Settings">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] dark:text-gray-500 text-gray-400 font-bold tracking-wider uppercase mb-2 block">
                        Timer Zoom
                      </label>
                      <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-xl border border-gray-100 dark:border-white/10 gap-1 overflow-x-auto">
                        {[1, 1.25, 1.5, 1.75, 2].map(num => (
                          <button
                            key={num}
                            onClick={() => onSetTimerZoom(num)}
                            className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap
                              ${timerZoom === num
                                ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                              }`}
                          >
                            {num}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] dark:text-gray-500 text-gray-400 font-bold tracking-wider uppercase mb-2 block">
                        Schedule Zoom
                      </label>
                      <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-xl border border-gray-100 dark:border-white/10 gap-1 overflow-x-auto">
                        {[0.8, 1, 1.2, 1.4, 1.6].map(num => (
                          <button
                            key={num}
                            onClick={() => onSetScheduleZoom(num)}
                            className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap
                              ${scheduleZoom === num
                                ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                              }`}
                          >
                            {num}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Section>

                {/* Info */}
                <div className="mt-2 p-3 rounded-xl dark:bg-white/[0.02] dark:border-white/[0.04] bg-gray-50 border border-gray-100">
                  <p className="text-[10px] dark:text-gray-600 text-gray-400 leading-relaxed">
                    💡 Single source of truth: all timers are derived from <code className="font-mono">elapsedTime</code>.
                    Editing the main timer automatically syncs phase detection. No drift possible.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function pad(n) {
  return String(Math.floor(Math.max(0, n))).padStart(2, '0');
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold dark:text-gray-300 text-gray-700 mb-3 flex items-center gap-2">
        {title}
      </h4>
      {children}
    </div>
  );
}
