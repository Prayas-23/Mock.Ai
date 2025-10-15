import React, { useState } from 'react';
import Lottie from 'lottie-react';
import resumeAnim from '../assets/animations/resume.json';
import { useNavigate } from 'react-router-dom';
import ResumeModal from './resumeModal';

function ResumeLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Lottie 
            animationData={resumeAnim} 
            loop={true} 
            className="w-64 h-64 mx-auto"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Build Your Perfect Resume
        </h1>
        
        <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
          Create professional resumes with our AI-powered builder. Choose from modern templates and let our system optimize your content.
        </p>
        
        <div className="space-y-4 max-w-md mx-auto">
          <button
            onClick={() => navigate('/resume/selectResume')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 transition-colors font-semibold shadow-lg"
          >
            Start Building Resume
          </button>
          
          <p className="text-white/70 text-sm">Pick a layout, add your details, and export with one click.</p>
        </div>
      </div>
    </div>
  );
}

export default ResumeLandingPage;