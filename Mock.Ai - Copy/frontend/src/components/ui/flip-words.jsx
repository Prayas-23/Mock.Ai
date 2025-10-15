import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils.js";

export const FlipWords = ({ words, duration = 3000, className }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const startAnimation = useCallback(() => {
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    const interval = setInterval(startAnimation, duration);
    return () => clearInterval(interval);
  }, [startAnimation, duration]);

  return (
    <div className={cn("relative inline-block", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWordIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            {words[currentWordIndex]}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};