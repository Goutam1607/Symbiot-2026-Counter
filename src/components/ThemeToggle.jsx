import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('symbiot-theme');
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('symbiot-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('symbiot-theme', 'light');
    }
  };

  return (
    <motion.button
      onClick={toggle}
      className="fixed top-6 right-6 z-50 w-10 h-10 rounded-xl
                 flex items-center justify-center text-lg transition-all duration-300
                 dark:bg-white/[0.04] dark:border dark:border-white/[0.08] dark:text-yellow-300
                 bg-white border border-gray-200 text-gray-600 shadow-sm
                 hover:border-cyan-500/30"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, rotate: 180 }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </motion.button>
  );
}
