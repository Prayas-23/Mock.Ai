import React, { useState } from 'react';
import Lottie from 'lottie-react';
import resumeAnim from '../assets/animations/resume.json';
import { useNavigate } from 'react-router-dom';
import ResumeModal from './resumeModal';

function ResumeLandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#0a0a0a] via-[#0b0f19] to-[#000000] text-white pt-28 pb-16 px-4 relative overflow-hidden">
        {/* Accent glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Title + Animation in glass card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Build a resume that stands out
            </h1>
            <div className="relative flex items-center justify-center py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-cyan-500/10 rounded-full blur-2xl" />
              <Lottie
                animationData={resumeAnim}
                loop
                className="w-[220px] sm:w-[280px] md:w-[320px] h-auto relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right: Call to action in glass card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl flex items-center justify-center">
            <div className="w-full max-w-md text-center space-y-6">
              <h2 className="text-2xl font-semibold">Start with a template</h2>
              <p className="text-white/70 text-sm">Pick a layout, add your details, and export with one click.</p>
              <button
                onClick={() => navigate('/resume/selectResume')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 transition-colors font-semibold shadow-lg"
              >
                Create Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeLandingPage;
