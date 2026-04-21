import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const WORDS = ['DESIGN', 'BUILD', 'DEPLOY'];

const WORD_COLORS = {
  DESIGN: '#00C2C2',
  BUILD: '#00AEEF',
  DEPLOY: '#0EA5E9',
};

export default function VoiceActivation({ 
  decibel, 
  isListening, 
  threshold, 
  onComplete, 
  onStartListening,
  sounds 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [locked, setLocked] = useState([false, false, false]);
  const [isComplete, setIsComplete] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const holdStartRef = useRef(null);
  const HOLD_DURATION = 1500; // ms to hold above threshold

  // Track sustained noise above threshold
  useEffect(() => {
    if (isComplete || !isListening) return;

    if (decibel >= threshold) {
      if (!holdStartRef.current) {
        holdStartRef.current = Date.now();
      }
      
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        // Lock current word
        sounds.activation();
        const newLocked = [...locked];
        newLocked[currentIndex] = true;
        setLocked(newLocked);
        holdStartRef.current = null;
        setHoldProgress(0);

        if (currentIndex >= 2) {
          // All words locked!
          setIsComplete(true);
          setTimeout(() => {
            sounds.cheer();
            fireConfetti();
            onComplete();
          }, 600);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }
    } else {
      holdStartRef.current = null;
      setHoldProgress(prev => Math.max(0, prev - 0.05));
    }
  }, [decibel, threshold, isListening, currentIndex, locked, isComplete]);

  const fireConfetti = () => {
    const colors = ['#00C2C2', '#00AEEF', '#0EA5E9', '#38BDF8', '#ffffff'];
    
    confetti({ 
      particleCount: 150, 
      spread: 100, 
      origin: { y: 0.6 },
      colors,
    });
    
    setTimeout(() => {
      confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 }, colors });
    }, 300);
  };

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setLocked([false, false, false]);
    setIsComplete(false);
    setHoldProgress(0);
    holdStartRef.current = null;
  }, []);

  const skip = useCallback(() => {
    setIsComplete(true);
    setLocked([true, true, true]);
    setTimeout(() => {
      sounds.cheer();
      fireConfetti();
      onComplete();
    }, 300);
  }, [onComplete, sounds]);

  if (isComplete) {
    return (
      <motion.div
        className="flex flex-col items-center py-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="flex gap-3 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {WORDS.map((word, i) => (
            <motion.span
              key={word}
              className="text-2xl md:text-4xl font-black"
              style={{ color: WORD_COLORS[word] }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.15, type: 'spring' }}
            >
              {word}
              {i < 2 && <span className="dark:text-gray-600 text-gray-300 mx-1">·</span>}
            </motion.span>
          ))}
        </motion.div>
        <motion.p
          className="mt-4 text-sm dark:text-gray-400 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ✅ Crowd Activation Complete!
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center py-2 md:py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg md:text-xl lg:text-2xl font-bold dark:text-white text-gray-800">
          🎤 Crowd Activation Mode
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-4 mb-6">
        {WORDS.map((word, i) => (
          <motion.div
            key={word}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-2xl text-base font-bold
              transition-all duration-300
              ${locked[i]
                ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                : i === currentIndex
                ? 'glass border-primary-500/30'
                : 'glass opacity-40'
              }
            `}
            animate={locked[i] ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <span className={`w-3 h-3 rounded-full ${locked[i] ? 'bg-primary-500' : 'bg-gray-500'}`} />
            <span style={{ color: locked[i] ? WORD_COLORS[word] : undefined }} className="tracking-widest">{word}</span>
            {locked[i] && <span className="text-primary-500">✓</span>}
          </motion.div>
        ))}
      </div>

      {/* Current word to scream */}
      {!isListening ? (
        <motion.button
          onClick={onStartListening}
          className="px-12 py-6 rounded-3xl bg-gradient-to-r from-primary-500 to-primary-600 
                     text-white font-bold text-2xl shadow-glow hover:shadow-glow-xl
                     transition-all duration-300 border border-white/10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎤 Enable Microphone to Start
        </motion.button>
      ) : (
        <div className="scream-container pt-4">
          <p className="text-base font-medium dark:text-gray-500 text-gray-400 mb-4 tracking-widest uppercase text-center w-full">
            Scream together:
          </p>
          
          <div className="scream-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={WORDS[currentIndex]}
                className="scream-text font-black"
                style={{ color: WORD_COLORS[WORDS[currentIndex]] }}
                initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 1.5, opacity: 0, y: -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {WORDS[currentIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Hold progress bar */}
          <div className="w-full max-w-2xl h-3 rounded-full bg-gray-800/50 mt-6 overflow-hidden border border-white/5 flex-shrink-0">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${WORD_COLORS[WORDS[currentIndex]]}, ${WORD_COLORS[WORDS[currentIndex]]}dd)`,
                width: `${holdProgress * 100}%`,
                boxShadow: holdProgress > 0.5 ? `0 0 30px ${WORD_COLORS[WORDS[currentIndex]]}` : 'none',
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="mt-2 text-xs font-bold tracking-widest dark:text-gray-400 text-gray-500 uppercase">
            {holdProgress > 0 ? 'KEEP GOING!' : 'GET LOUDER!'}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={reset}
          className="px-4 py-2 text-xs rounded-xl glass dark:text-gray-400 text-gray-500 
                     hover:border-primary-500/30 transition-all"
        >
          ↺ Reset
        </button>
        <button
          onClick={skip}
          className="px-4 py-2 text-xs rounded-xl glass dark:text-gray-400 text-gray-500 
                     hover:border-primary-500/30 transition-all"
        >
          ⏭ Skip
        </button>
      </div>
    </motion.div>
  );
}
