import React, { useState } from "react";
import { motion } from "framer-motion";
import UniqueBot from "../components/UniqueBot.jsx";
import { useNavigate } from "react-router-dom";
import ProfileInterviewForm from "./profileInterviewForm";
import CheckCameraAndMic from "../components/checkCameraAndMic";

export function MockInterviewLandingPage() {
  const navigate = useNavigate();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showCameraCheck, setShowCameraCheck] = useState(false);

  const features = [
    {
      title: "AI-Powered Questions",
      description: "Get realistic interview questions tailored to your role and experience level",
      icon: "🤖"
    },
    {
      title: "Real-time Feedback",
      description: "Receive instant feedback on your answers and communication skills",
      icon: "📊"
    },
    {
      title: "Practice Anywhere",
      description: "Practice interviews from the comfort of your home, anytime",
      icon: "🏠"
    },
    {
      title: "Detailed Reports",
      description: "Get comprehensive analysis of your performance with improvement suggestions",
      icon: "📈"
    }
  ];

  const handleStartInterview = () => {
    setShowCameraCheck(true);
  };

  const handleCameraCheckComplete = () => {
    setShowCameraCheck(false);
    setShowProfileForm(true);
  };

  const handleProfileComplete = () => {
    navigate('/interviewForm');
  };

  if (showCameraCheck) {
    return (
      <CheckCameraAndMic 
        onComplete={handleCameraCheckComplete}
        onSkip={handleCameraCheckComplete}
      />
    );
  }

  if (showProfileForm) {
    return (
      <ProfileInterviewForm 
        onComplete={handleProfileComplete}
        onBack={() => setShowProfileForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Master Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  {" "}Interview Skills
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Practice with our AI-powered mock interview system. Get personalized 
                questions, real-time feedback, and detailed performance analysis to 
                ace your next interview.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStartInterview}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Start Mock Interview
                </button>
                <button
                  onClick={() => navigate('/interviewForm')}
                  className="border border-gray-600 hover:border-gray-400 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300"
                >
                  Quick Start
                </button>
              </div>
            </motion.div>

            {/* Right Content - Bot Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <UniqueBot />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Mock Interviews?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI-powered platform provides the most realistic interview experience 
              to help you prepare for success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Ace Your Interview?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of candidates who have improved their interview skills 
              with our AI-powered platform.
            </p>
            <button
              onClick={handleStartInterview}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Get Started Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}