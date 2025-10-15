import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuizForm from './QuizForm';
import QuizInterface from './QuizInterface';
import Lottie from 'lottie-react';
import quizAnim from '../assets/animations/quiz.json';

const QuizPage = () => {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'form', 'quiz'
  const [quizConfig, setQuizConfig] = useState(null);

  const handleStartQuiz = () => {
    setCurrentView('form');
  };

  const handleConfigSubmit = (config) => {
    setQuizConfig(config);
    setCurrentView('quiz');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setQuizConfig(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'form':
        return (
          <QuizForm 
            onSubmit={handleConfigSubmit}
            onBack={handleBackToLanding}
          />
        );
      case 'quiz':
        return (
          <QuizInterface 
            config={quizConfig}
            onBack={handleBackToLanding}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                    Test Your
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                      {" "}Knowledge
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    Challenge yourself with our AI-generated quizzes. Choose from various 
                    topics and difficulty levels to test and improve your skills.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleStartQuiz}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Start Quiz
                    </button>
                    <button
                      onClick={handleStartQuiz}
                      className="border border-gray-600 hover:border-gray-400 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300"
                    >
                      Quick Start
                    </button>
                  </div>
                </motion.div>

                {/* Right Content - Animation */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex justify-center"
                >
                  <Lottie 
                    animationData={quizAnim} 
                    loop={true} 
                    className="w-96 h-96"
                  />
                </motion.div>
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
                  <h2 className="text-4xl font-bold mb-4">Why Take Our Quizzes?</h2>
                  <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    Our AI-powered quizzes adapt to your skill level and provide 
                    instant feedback to help you learn effectively.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Adaptive Difficulty",
                      description: "Questions adjust to your skill level for optimal learning",
                      icon: "🎯"
                    },
                    {
                      title: "Instant Feedback",
                      description: "Get immediate explanations for correct and incorrect answers",
                      icon: "⚡"
                    },
                    {
                      title: "Progress Tracking",
                      description: "Monitor your improvement over time with detailed analytics",
                      icon: "📊"
                    }
                  ].map((feature, index) => (
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
                  <h2 className="text-4xl font-bold mb-6">Ready to Test Your Skills?</h2>
                  <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Start your learning journey today with our comprehensive quiz platform.
                  </p>
                  <button
                    onClick={handleStartQuiz}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg"
                  >
                    Begin Quiz
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderContent()}
    </AnimatePresence>
  );
};

export default QuizPage;