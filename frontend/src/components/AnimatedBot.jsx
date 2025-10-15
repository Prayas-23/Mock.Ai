import React, { useMemo } from 'react';
import Lottie from 'lottie-react';

// Available robot/assistant animations
import aiAssistant from '../assets/animations/aiAssistant.json';
import aiAssistant2 from '../assets/animations/aiAssistant2.json';
import aiInterview from '../assets/animations/aiInterview.json';
import thinking from '../assets/animations/thinking.json';
import mockInterview from '../assets/animations/mockInterview.json';

const variants = {
  assistant: aiAssistant,
  assistant2: aiAssistant2,
  interview: aiInterview,
  thinking,
  mock: mockInterview,
};

/**
 * AnimatedBot
 * Props:
 * - variant: one of 'assistant' | 'assistant2' | 'interview' | 'thinking' | 'mock'
 * - random: boolean (if true, pick a random variant)
 * - className: string for sizing/styling
 * - loop: boolean
 */
export default function AnimatedBot({ variant = 'assistant2', random = false, className = 'w-[260px] h-auto', loop = true }) {
  const animationData = useMemo(() => {
    if (random) {
      const keys = Object.keys(variants);
      const idx = Math.floor(Math.random() * keys.length);
      return variants[keys[idx]];
    }
    return variants[variant] || variants.assistant2;
  }, [variant, random]);

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      className={className + ' relative z-10 drop-shadow-2xl'}
    />
  );
}
