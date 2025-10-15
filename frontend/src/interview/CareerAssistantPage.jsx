import React from 'react'
import { motion } from "framer-motion";
import AnimatedBot from '../components/AnimatedBot.jsx';
import useConversation from '../stateManage/useConversation.js';

function AssistantPage() {
  const { assistantContent } = useConversation();

  return (
    <div className="relative bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-xl w-[400px] h-[420px] p-6 flex flex-col items-center justify-start overflow-hidden">
      {/* Blob background */}
      <div className="absolute -z-10 -top-16 -left-20 w-72 h-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,#38bdf8_0%,transparent_60%)] opacity-40" />
      <div className="absolute -z-10 -bottom-24 -right-24 w-80 h-80 rounded-full bg-[radial-gradient(circle_at_70%_70%,#6366f1_0%,transparent_60%)] opacity-30" />

      {/* Bot */}
      <div className="w-full h-48 mb-4 relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-white/5" />
        {/* Changed from random to variant="assistant2" to use specific animation */}
        <AnimatedBot variant="assistant2" className="h-full w-auto" />
      </div>

      <div className="text-lg font-semibold text-sky-200 mb-3">Virtual Interview Coach</div>

      {/* Assistant text */}
      <div className="flex-1 w-full p-4 bg-white/5 border border-white/10 rounded-xl overflow-auto">
        {assistantContent ? (
          <p className="text-sm text-white/90 leading-relaxed">
            {typeof assistantContent === 'string' ? assistantContent : JSON.stringify(assistantContent)}
          </p>
        ) : (
          <p className="text-sm text-white/70 italic">I’ll ask the first question when you start the session.</p>
        )}
      </div>
    </div>
  )
}

export default AssistantPage