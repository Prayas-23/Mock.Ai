import React, { useState } from "react";
import { motion } from "framer-motion";
import UniqueBot from "../components/UniqueBot.jsx";
import { useNavigate } from "react-router-dom";
import ProfileInterviewForm from "./ProfileCareerForm";
import CheckCameraAndMic from "../components/checkCameraAndMic";

export function MockInterviewLandingPage() {
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState(false);
  const [topicForm, setTopicForm] = useState(false);

  if(profileForm){
    return(
      <CheckCameraAndMic onContinue={() => navigate("/profileInterviewForm")}/>
    )
  }

  if(topicForm){
    return(
      <CheckCameraAndMic onContinue={() => navigate("/interviewForm")}/>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-6 py-10 flex flex-col md:flex-row items-center justify-center gap-40 relative overflow-hidden">
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/6 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -100, rotateY: -30 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        className="w-[250px] md:w-[350px] lg:w-[400px] relative z-10"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
          {/* Changed from random to variant="assistant2" to use specific animation */}
          <UniqueBot variant="assistant2" className="relative z-10 w-full h-auto" />
        </div>
      </motion.div>

      {/* Text + Buttons on the Right */}
      <div className="text-center md:text-left max-w-xl relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-xl">
            Ace Your Interview With AI
          </span>
          <br />
          <span className="text-white drop-shadow-lg hover:text-purple-200 transition-colors duration-300">
            Practice smarter. Improve faster.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-4 text-lg md:text-xl text-gray-300 hover:text-white transition-colors duration-300"
        >
          Practice real questions and get instant coaching tailored to your role.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
        >
          <button
            onClick={() => setTopicForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Topic practice
          </button>
          <button
            onClick={() => setProfileForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Resume-based practice
          </button>
        </motion.div>
      </div>
    </div>
  );
}