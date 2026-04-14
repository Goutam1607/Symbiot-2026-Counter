import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import HackathonTimer from './components/HackathonTimer';
import VoiceActivation from './components/VoiceActivation';
import DecibelMeter from './components/DecibelMeter';
import LiveScheduleFlow from './components/LiveScheduleFlow';
import AdminPanel from './components/AdminPanel';
import FloatingParticles from './components/FloatingParticles';
import ThemeToggle from './components/ThemeToggle';
import PresentationMode from './components/PresentationMode';

import { useHackathonTimer } from './hooks/useCountdown';
import { usePhaseDetection } from './hooks/usePhaseDetection';
import { useAudioAnalyser } from './hooks/useAudioAnalyser';
import { useSoundEffects } from './hooks/useSoundEffects';

// App states
const PHASE_VOICE = 'voice';
const PHASE_DASHBOARD = 'dashboard';

export default function App() {
  const [phase, setPhase] = useState(PHASE_VOICE);
  const [threshold, setThreshold] = useState(80);
  const [overridePhaseId, setOverridePhaseId] = useState(null);

  // Resize Panel State
  const [scheduleWidth, setScheduleWidth] = useState(35); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [lastWidth, setLastWidth] = useState(35);

  // Timer Zoom State
  const [timerZoom, setTimerZoom] = useState(1);

  // Hackathon Timer
  const timer = useHackathonTimer();

  // Phase detection
  const phaseDetection = usePhaseDetection(timer.isRunning, timer.startedAt, timer.elapsed);

  // Audio
  const audio = useAudioAnalyser();

  // Sounds
  const sounds = useSoundEffects();

  // Tick sound
  const prevSecRef = useRef(timer.seconds);
  useEffect(() => {
    if (prevSecRef.current !== timer.seconds && timer.isRunning) {
      sounds.tick();
      prevSecRef.current = timer.seconds;
    }
  }, [timer.seconds, timer.isRunning, sounds]);

  // Voice activation complete
  const handleVoiceComplete = useCallback(() => {
    setPhase(PHASE_DASHBOARD);
    timer.start();
    setTimeout(() => audio.stop(), 3000);
  }, [audio, timer]);

  const handleStartListening = useCallback(() => {
    audio.start();
  }, [audio]);

  const handleSkipVoice = useCallback(() => {
    setPhase(PHASE_DASHBOARD);
    timer.start();
    audio.stop();
  }, [audio, timer]);

  const handleReset = useCallback(() => {
    setPhase(PHASE_VOICE);
    timer.reset();
    audio.stop();
    setOverridePhaseId(null);
  }, [timer, audio]);

  // Resizing Logic
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        const width = 100 - (e.clientX / window.innerWidth) * 100;
        const constrainedWidth = Math.max(0, Math.min(50, width));

        // Magnetic snap to collapse
        if (constrainedWidth < 5) {
          setScheduleWidth(0);
        } else {
          setScheduleWidth(constrainedWidth);
        }
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (scheduleWidth > 0) {
        setLastWidth(scheduleWidth);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, scheduleWidth]);

  const toggleSchedule = useCallback(() => {
    if (scheduleWidth === 0) {
      setScheduleWidth(lastWidth || 35);
    } else {
      setLastWidth(scheduleWidth);
      setScheduleWidth(0);
    }
  }, [scheduleWidth, lastWidth]);

  return (
    <div className="h-screen w-screen overflow-hidden relative transition-colors duration-500"
         style={{ background: 'var(--bg-primary)' }}>
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-[#060612] dark:via-[#0a0f24] dark:to-[#0a1628]
                        bg-[#F8FAFC]" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full dark:bg-cyan-500/[0.03] bg-cyan-500/[0.05] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full dark:bg-cyan-600/[0.03] bg-cyan-600/[0.04] blur-[120px]" />
      </div>

      {/* Particles */}
      <FloatingParticles decibel={audio.decibel} isListening={audio.isListening} />

      {/* Top controls */}
      <ThemeToggle />
      <PresentationMode />

      {/* Voice Activation Phase */}
      <AnimatePresence mode="wait">
        {phase === PHASE_VOICE && (
          <motion.div
            key="voice"
            className="fixed inset-0 z-20 flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <Header />

            <div className="w-full max-w-2xl">
              <VoiceActivation
                decibel={audio.decibel}
                isListening={audio.isListening}
                threshold={threshold}
                onComplete={handleVoiceComplete}
                onStartListening={handleStartListening}
                sounds={sounds}
              />
            </div>

            <AnimatePresence>
              {audio.isListening && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <DecibelMeter
                    decibel={audio.decibel}
                    frequencyData={audio.frequencyData}
                    isListening={audio.isListening}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Phase — Split Layout */}
      {phase === PHASE_DASHBOARD && (
        <motion.div
          className={`fixed inset-0 z-10 flex flex-col lg:flex-row ${isResizing ? 'cursor-col-resize select-none' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* LEFT SIDE — Timer */}
          <motion.div
            className="flex flex-col relative overflow-hidden"
            style={{
              flex: scheduleWidth === 0 ? '1 0 100%' : `calc(100% - ${scheduleWidth}%)`,
              transition: isResizing ? 'none' : 'flex 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          >
            {/* Subtle top branding */}
            <div className="flex items-center gap-3 px-6 pt-4">
              <img src="/logo.png" alt="SYMBIOT" className="w-8 h-8 object-contain" />
              <div>
                <span style={{ fontFamily: "'Vampire Wars', sans-serif" }} className="text-xl md:text-2xl dark:text-cyan-400 text-cyan-700 tracking-wider">SYMBIOT</span>
                <span className="text-sm font-bold dark:text-cyan-400 text-cyan-700 ml-1">2026</span>
                <span className="text-[10px] dark:text-gray-500 text-gray-400 ml-2 tracking-widest uppercase">Mission Control</span>
              </div>
            </div>

            {/* Timer */}
            <div className="flex-1 timer-container">
              <HackathonTimer
                hours={timer.hours}
                minutes={timer.minutes}
                seconds={timer.seconds}
                isRunning={timer.isRunning}
                progress={timer.progress}
                onStart={timer.start}
                onPause={timer.pause}
                onReset={timer.reset}
                onSetTime={timer.setTime}
                zoom={timerZoom}
                phaseInfo={{
                  currentPhase: overridePhaseId
                    ? phaseDetection.allEvents.find(e => e.id === overridePhaseId)
                    : phaseDetection.currentPhase,
                  nextPhase: phaseDetection.nextPhase,
                  phaseTimeRemaining: phaseDetection.phaseTimeRemaining,
                }}
              />
            </div>

            {/* Footer */}
            <div className="px-6 pb-3 text-center lg:text-left">
              <p className="text-[9px] dark:text-gray-700 text-gray-400 tracking-widest uppercase">
                Vidyavardhaka College of Engineering, Mysuru · April 24-25, 2026
              </p>
            </div>
          </motion.div>

          {/* Resizable Divider (shown only on desktop) */}
          <div
            className={`hidden lg:block resize-divider ${isResizing ? 'is-resizing' : ''}`}
            onMouseDown={handleMouseDown}
          />

          {/* Mobile Divider (hidden when resizing) */}
          <div className="lg:hidden h-[1px] dark:bg-gradient-to-r dark:from-transparent dark:via-cyan-500/15 dark:to-transparent
                          bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* RIGHT SIDE — Schedule Flow */}
          <motion.div
            className={`flex flex-col relative overflow-hidden
                       dark:border-l dark:border-white/[0.03] border-l border-gray-100
                       dark:bg-[rgba(6,8,18,0.3)] bg-white`}
            style={{
              width: `${scheduleWidth}%`,
              minWidth: scheduleWidth === 0 ? 0 : '300px',
              display: scheduleWidth === 0 ? 'none' : 'flex',
              transition: isResizing ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            <LiveScheduleFlow
              currentPhase={phaseDetection.currentPhase}
              nextPhase={phaseDetection.nextPhase}
              phaseTimeRemaining={phaseDetection.phaseTimeRemaining}
              overridePhaseId={overridePhaseId}
            />
          </motion.div>

          {/* Collapse/Expand Toggle Button (only when hidden) */}
          <AnimatePresence>
            {scheduleWidth === 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                onClick={toggleSchedule}
                className="fixed bottom-8 right-8 z-50 p-4 rounded-full glass shadow-glow
                           dark:text-cyan-400 text-cyan-600 font-bold text-xs tracking-widest uppercase
                           hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Show Schedule
              </motion.button>
            )}
          </AnimatePresence>

          {/* Small fixed toggle even when visible (optional but nice) */}
          {scheduleWidth > 0 && (
            <button
              onClick={toggleSchedule}
              className="hidden lg:block absolute top-[50%] right-0 z-50 p-1 mr-[-10px]
                         bg-cyan-500 rounded-l-md text-white text-[10px] transition-transform
                         hover:scale-110 active:scale-90"
              style={{ transform: 'translateY(-50%)' }}
            >
              <span className="block rotate-90">CLOSE</span>
            </button>
          )}
        </motion.div>
      )}

      {/* Admin Panel */}
      <AdminPanel
        isRunning={timer.isRunning}
        hours={timer.hours}
        minutes={timer.minutes}
        seconds={timer.seconds}
        onStart={timer.start}
        onPause={timer.pause}
        onReset={handleReset}
        onSetTime={timer.setTime}
        threshold={threshold}
        onSetThreshold={setThreshold}
        onSkipVoice={handleSkipVoice}
        overridePhaseId={overridePhaseId}
        onSetOverridePhase={setOverridePhaseId}
        timerZoom={timerZoom}
        onSetTimerZoom={setTimerZoom}
      />
    </div>
  );
}
