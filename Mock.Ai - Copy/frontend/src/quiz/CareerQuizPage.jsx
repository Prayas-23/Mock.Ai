import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuizForm from './CareerQuizForm';
import QuizInterface from './CareerQuizInterface';
import Lottie from 'lottie-react';
import quizAnim from '../assets/animations/quiz.json';

const QuizPage = () => {
  const [quizConfig, setQuizConfig] = useState(null);

  return (
    <div className="min-h-screen w-full text-white bg-gradient-to-b from-[#0a0a0a] via-[#0b0f19] to-[#000000] relative overflow-hidden pt-28 pb-16 px-4">
      {/* Accent glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Title + Animation in glass card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Sharpen your skills with smart quizzes
            </h1>
            <p className="text-white/80">Get targeted questions that match your goals and level.</p>
          </motion.div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center items-center mt-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-2xl" />
              <Lottie animationData={quizAnim} loop className="w-[260px] md:w-[300px] h-auto relative z-10" />
            </div>
          </motion.div>
        </div>

        {/* Right: Form/Quiz in glass card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {!quizConfig ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <QuizForm onSubmit={setQuizConfig} />
                </motion.div>
              ) : (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                >
                  <QuizInterface config={quizConfig} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
export default QuizPage;
