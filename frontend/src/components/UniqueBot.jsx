import React from 'react';
import AnimatedBot from './AnimatedBot.jsx';

/**
 * UniqueBot: A distinctive framed bot with orbital glow effects.
 * - Uses AnimatedBot under the hood but adds layered gradients, rings, and motion.
 */
export default function UniqueBot({ className = 'w-[280px] md:w-[320px] h-auto', variant = 'assistant2', random = false }) {
  return (
    <div className={"relative flex items-center justify-center " + className}>
      {/* Orbital glow rings */}
      <div className="absolute -z-10 inset-0 flex items-center justify-center">
        <div className="w-full h-full max-w-[420px] max-h-[420px] rounded-full blur-2xl opacity-40 bg-gradient-to-tr from-fuchsia-500/40 via-cyan-400/40 to-indigo-500/40 animate-pulse" />
      </div>

      {/* Rotating accent ring */}
      <div className="absolute -z-10 w-[115%] h-[115%] rounded-full border border-white/10 animate-spin slow-spin" />

      {/* Gradient halo */}
      <div className="absolute -z-10 w-[85%] h-[85%] rounded-full bg-gradient-to-br from-fuchsia-400/20 via-violet-400/10 to-cyan-400/20 blur-2xl" />

      {/* Floating sparkles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-6 right-10 size-2 rounded-full bg-fuchsia-300/80 animate-ping" />
        <div className="absolute bottom-6 left-12 size-1.5 rounded-full bg-cyan-300/80 animate-bounce" style={{ animationDuration: '2.2s' }} />
        <div className="absolute top-1/2 left-2 size-1 rounded-full bg-indigo-300/80 animate-pulse" style={{ animationDuration: '3s' }} />
      </div>

      {/* Glass card frame */}
      <div className="absolute inset-0 rounded-[24px] backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_8px_40px_rgba(79,70,229,0.35)]" />

      {/* The bot itself */}
      <AnimatedBot variant={variant} random={random} className="relative z-10 w-full h-auto" />

      <style>{`
        .slow-spin { animation-duration: 12s; }
      `}</style>
    </div>
  );
}
