import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      className="flex flex-col items-center pt-2 md:pt-4 pb-0 px-4 relative z-10"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Logo */}
      <motion.img
        src="/logo.png"
        alt="SYMBIOT 2026 Logo"
        className="w-16 h-16 md:w-24 lg:w-28 object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.15)]"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05, rotate: 3 }}
      />

      {/* Title */}
      <motion.h1
        className="mt-2 text-2xl md:text-3xl lg:text-4xl tracking-wide flex items-baseline justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <span style={{ fontFamily: "'Vampire Wars', sans-serif" }} className="text-3xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">SYMBIOT</span>
        <span className="font-bold ml-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">2026</span>
      </motion.h1>

      {/* Subtitle badge */}
      <motion.div
        className="mt-1 px-4 py-1 rounded-full text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase
                   bg-gradient-to-r from-primary-500/10 to-primary-600/10 
                   border border-primary-500/20 text-primary-500"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        A National Level 24-Hour Hardware Hackathon
      </motion.div>

      {/* Tagline with glow */}
      <motion.h2
        className="mt-4 text-4xl md:text-6xl lg:text-[6rem] font-black tracking-tighter text-center leading-[0.9]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <span className="dark:text-white text-gray-900">Design. </span>
        <span className="dark:text-white text-gray-900">Build. </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
          Deploy.
        </span>
      </motion.h2>

      {/* Subtext */}
      <motion.p
        className="mt-4 text-xs md:text-sm dark:text-gray-400 text-gray-500 text-center max-w-xl leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        Join 500+ innovators for a 24-hour deep tech build challenge at <br/>
        <span className="font-bold dark:text-gray-300 text-gray-700">Vidyavardhaka College of Engineering, Mysuru.</span>
      </motion.p>

      {/* Date */}
      <motion.p
        className="mt-2 text-xs md:text-sm font-bold dark:text-cyan-500/80 text-cyan-600/80 tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        April 24th – 25th, 2026
      </motion.p>
    </motion.header>
  );
}
