import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHEDULE } from '../utils/schedule';

export default function AdminPanel({
  isRunning,
  hours, minutes, seconds,
  onStart, onPause, onReset, onSetTime,
  threshold, onSetThreshold,
  onSkipVoice,
  overridePhaseId, onSetOverridePhase,
  timerZoom, onSetTimerZoom,
  scheduleZoom, onSetScheduleZoom,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const allEvents = SCHEDULE.flatMap(d => d.events);

  return (
    <>
      {/* Hidden toggle */}
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

                {/* Timer Controls */}
                <Section title="⏱ Timer Controls">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      onClick={isRunning ? onPause : onStart}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isRunning
                          ? 'dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                      }`}
                    >
                      {isRunning ? '⏸ Pause' : '▶ Start'}
                    </button>
                    <button
                      onClick={onReset}
                      className="py-2.5 rounded-xl text-xs font-bold transition-all
                                 dark:bg-white/5 dark:text-gray-400 dark:border-white/10
                                 bg-gray-50 text-gray-500 border border-gray-200
                                 hover:border-red-300 dark:hover:border-red-500/20"
                    >
                      ↺ Reset
                    </button>
                    <button
                      onClick={() => {
                        const h = parseInt(prompt('Hours:', hours));
                        const m = parseInt(prompt('Minutes:', minutes));
                        const s = parseInt(prompt('Seconds:', seconds));
                        if (!isNaN(h) && !isNaN(m) && !isNaN(s)) onSetTime(h, m, s);
                      }}
                      className="py-2.5 rounded-xl text-xs font-bold transition-all
                                 dark:bg-white/5 dark:text-gray-400 dark:border-white/10
                                 bg-gray-50 text-gray-500 border border-gray-200
                                 hover:border-cyan-300 dark:hover:border-cyan-500/20"
                    >
                      ✏️ Edit
                    </button>
                  </div>

                  {/* Quick time adjustments */}
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { label: '-5m', delta: -300 },
                      { label: '-1m', delta: -60 },
                      { label: '+1m', delta: 60 },
                      { label: '+5m', delta: 300 },
                      { label: '+30m', delta: 1800 },
                      { label: '+1h', delta: 3600 },
                    ].map(({ label, delta }) => (
                      <button
                        key={label}
                        onClick={() => {
                          const total = hours * 3600 + minutes * 60 + seconds + delta;
                          const h = Math.floor(Math.max(0, total) / 3600);
                          const m = Math.floor((Math.max(0, total) % 3600) / 60);
                          const s = Math.max(0, total) % 60;
                          onSetTime(h, m, s);
                        }}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
                                   dark:bg-white/5 dark:text-gray-400 dark:border-white/[0.06] dark:hover:border-cyan-500/20 dark:hover:text-cyan-400
                                   bg-gray-50 text-gray-500 border border-gray-200 hover:border-cyan-300 hover:text-cyan-600"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Section>

                {/* Phase Override */}
                <Section title="🎯 Phase Override">
                  <p className="text-[10px] dark:text-gray-500 text-gray-400 mb-3">
                    Manually select the current phase. Select "Auto" for automatic detection.
                  </p>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    <PhaseOption
                      selected={!overridePhaseId}
                      onClick={() => onSetOverridePhase(null)}
                      label="🤖 Auto Detect"
                    />
                    {allEvents.map((event) => (
                      <PhaseOption
                        key={event.id}
                        selected={overridePhaseId === event.id}
                        onClick={() => onSetOverridePhase(event.id)}
                        label={`${event.emoji} ${event.name}`}
                        time={event.time}
                      />
                    ))}
                  </div>
                </Section>

                {/* Voice Activation */}
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
                        onChange={(e) => onSetThreshold(Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <button
                      onClick={onSkipVoice}
                      className="w-full py-2.5 rounded-xl text-xs font-bold transition-all
                                 dark:bg-white/5 dark:text-gray-400 dark:border-white/[0.06] dark:hover:border-cyan-500/20
                                 bg-gray-50 text-gray-500 border border-gray-200 hover:border-cyan-300"
                    >
                      ⏭ Skip Voice Activation
                    </button>
                  </div>
                </Section>

                {/* Display Settings */}
                <Section title="📺 Display Settings">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] dark:text-gray-500 text-gray-400 font-bold tracking-wider uppercase mb-2 block">
                        Timer Zoom Level
                      </label>
                      <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-xl border border-gray-100 dark:border-white/10 gap-1 overflow-x-auto">
                        {[1, 1.25, 1.5, 1.75, 2].map((num) => (
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
                        Schedule Zoom Level
                      </label>
                      <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-xl border border-gray-100 dark:border-white/10 gap-1 overflow-x-auto">
                        {[0.8, 1, 1.2, 1.4, 1.6].map((num) => (
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
                      <p className="text-[9px] dark:text-gray-600 text-gray-400 mt-2 px-1">
                        Adjust schedule font size if it looks too large/small on your screen.
                      </p>
                    </div>
                  </div>
                </Section>

                {/* Info */}
                <div className="mt-6 p-3 rounded-xl dark:bg-white/[0.02] dark:border-white/[0.04]
                                bg-gray-50 border border-gray-100">
                  <p className="text-[10px] dark:text-gray-600 text-gray-400 leading-relaxed">
                    💡 Admin controls for the event organizer. Changes apply in real-time.
                    Phase override will be reflected on the live schedule display.
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

function PhaseOption({ selected, onClick, label, time }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2
        ${selected
          ? 'dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20 bg-cyan-50 text-cyan-700 border border-cyan-200'
          : 'dark:bg-white/[0.02] dark:text-gray-400 dark:hover:bg-white/5 bg-white text-gray-500 hover:bg-gray-50 border border-transparent'
        }`}
    >
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${selected ? 'border-cyan-500' : 'dark:border-gray-600 border-gray-300'}`}>
        {selected && <span className="w-2 h-2 rounded-full bg-cyan-500" />}
      </span>
      {label}
      {time && <span className="ml-auto text-[9px] dark:text-gray-600 text-gray-300">{time}</span>}
    </button>
  );
}
