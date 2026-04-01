import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function PresentationMode() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  }, []);

  return (
    <motion.button
      onClick={toggleFullscreen}
      className="fixed top-6 right-[4.5rem] z-50 w-10 h-10 rounded-xl
                 flex items-center justify-center text-base transition-all duration-300
                 dark:bg-white/[0.04] dark:border dark:border-white/[0.08] dark:text-gray-400
                 bg-white border border-gray-200 text-gray-500 shadow-sm
                 hover:border-cyan-500/30"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isFullscreen ? 'Exit Presentation Mode' : 'Presentation Mode'}
    >
      {isFullscreen ? '⊡' : '⛶'}
    </motion.button>
  );
}
