import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function DecibelMeter({ decibel, frequencyData, isListening }) {
  const normalizedDb = Math.min(decibel / 180, 1); // Normalize to 0-1
  
  const meterColor = useMemo(() => {
    if (normalizedDb < 0.3) return '#1a4fd4';
    if (normalizedDb < 0.6) return '#00C2C2';
    return '#00ffff';
  }, [normalizedDb]);

  const bars = useMemo(() => {
    if (!frequencyData || frequencyData.length === 0) {
      return Array(32).fill(0);
    }
    // Sample 32 bars from frequency data
    const step = Math.floor(frequencyData.length / 32);
    return Array.from({ length: 32 }, (_, i) => {
      const value = frequencyData[i * step] || 0;
      return value / 255;
    });
  }, [frequencyData]);

  if (!isListening) return null;

  return (
    <motion.div
      className="flex flex-col items-center py-2"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Radial meter */}
      <div className="relative w-40 h-40 md:w-56 md:h-56">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 20 90 A 45 45 0 1 1 100 90"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <motion.path
            d="M 20 90 A 45 45 0 1 1 100 90"
            fill="none"
            stroke={meterColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="220"
            animate={{ strokeDashoffset: 220 * (1 - normalizedDb) }}
            transition={{ duration: 0.15 }}
            style={{ filter: `drop-shadow(0 0 8px ${meterColor}60)` }}
          />
          
          <text
            x="60"
            y="55"
            textAnchor="middle"
            className="fill-current dark:text-white text-gray-800"
            style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Inter' }}
          >
            {Math.round(decibel)}
          </text>
          <text
            x="60"
            y="75"
            textAnchor="middle"
            className="fill-current dark:text-gray-500 text-gray-400"
            style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em' }}
          >
            DECIBELS
          </text>
        </svg>

        {/* Glow effect at high levels */}
        {normalizedDb > 0.6 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${meterColor}15 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Waveform bars */}
      <div className="flex items-end justify-center gap-[3px] h-12 md:h-20 mt-2">
        {bars.map((value, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: window.innerWidth < 768 ? 4 : 6,
              background: `linear-gradient(180deg, ${meterColor} 0%, ${meterColor}40 100%)`,
              boxShadow: value > 0.5 ? `0 0 10px ${meterColor}40` : 'none',
            }}
            animate={{ height: Math.max(4, value * (window.innerWidth < 768 ? 64 : 96)) }}
            transition={{ duration: 0.08 }}
          />
        ))}
      </div>

      {/* Label */}
      <p className="mt-2 text-xs dark:text-gray-500 text-gray-400 font-medium tracking-wider">
        LIVE AUDIO
      </p>
    </motion.div>
  );
}
