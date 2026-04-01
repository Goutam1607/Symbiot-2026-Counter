import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function FlipDigit({ value, label, color, delay = 0 }) {
  const displayValue = String(value).padStart(2, '0');

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: 'spring' }}
    >
      {/* Digit container */}
      <div className="relative">
        <motion.div
          className="relative flex items-center justify-center
                     w-20 h-24 md:w-28 md:h-36 lg:w-36 lg:h-44
                     rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(15,25,50,0.9) 0%, rgba(8,15,35,0.95) 49.5%, rgba(6,10,25,0.98) 50.5%, rgba(10,20,40,0.9) 100%)',
            boxShadow: `0 0 30px ${color}15, 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
            border: `1px solid rgba(255,255,255,0.06)`,
          }}
        >
          {/* Center divider line */}
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/40 z-10" />
          <div className="absolute left-0 right-0 top-1/2 mt-[1px] h-[1px] bg-white/[0.03] z-10" />
          
          {/* Side notches */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 rounded-r-full bg-black/50 z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3 rounded-l-full bg-black/50 z-10" />

          {/* Number */}
          <motion.span
            key={displayValue}
            className="text-5xl md:text-7xl lg:text-8xl font-black tabular-nums relative z-5"
            style={{
              color: '#ffffff',
              textShadow: `0 0 40px ${color}40, 0 2px 4px rgba(0,0,0,0.3)`,
            }}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {displayValue}
          </motion.span>
        </motion.div>

        {/* Reflection/glow underneath */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl opacity-30"
          style={{ background: color }}
        />
      </div>

      {/* Label */}
      <span
        className="mt-3 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase"
        style={{ color: `${color}cc` }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function Separator({ delay = 0 }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 md:gap-3 self-start mt-6 md:mt-10 lg:mt-12 mx-1 md:mx-2"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <motion.div
        className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary-500"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        style={{ boxShadow: '0 0 10px rgba(0,194,194,0.5)' }}
      />
      <motion.div
        className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary-500"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{ boxShadow: '0 0 10px rgba(0,194,194,0.5)' }}
      />
    </motion.div>
  );
}

export default function CountdownTimer({ days, hours, minutes, seconds }) {
  return (
    <motion.div
      className="relative flex flex-col items-center py-6 md:py-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] bg-primary-500/[0.04] rounded-full blur-[80px]" />
      </div>

      {/* Timer digits */}
      <div className="flex items-start gap-2 md:gap-3 lg:gap-4 relative z-10">
        <FlipDigit value={days} label="Days" color="#00C2C2" delay={0.1} />
        <Separator delay={0.2} />
        <FlipDigit value={hours} label="Hours" color="#00AEEF" delay={0.2} />
        <Separator delay={0.3} />
        <FlipDigit value={minutes} label="Minutes" color="#0EA5E9" delay={0.3} />
        <Separator delay={0.4} />
        <FlipDigit value={seconds} label="Seconds" color="#38BDF8" delay={0.4} />
      </div>

      {/* Total hours countdown below */}
      <motion.div
        className="mt-8 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary-500/30" />
        <span className="text-xs md:text-sm dark:text-gray-500 text-gray-400 font-medium tracking-wider">
          {days * 24 + hours}h {minutes}m {seconds}s remaining
        </span>
        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary-500/30" />
      </motion.div>
    </motion.div>
  );
}
