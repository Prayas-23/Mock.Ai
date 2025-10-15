import React from 'react'
import { motion } from "framer-motion";
import AnimatedBot from '../components/AnimatedBot.jsx';
import useConversation from '../stateManage/useConversation.js';

function AssistantPage({ currentQuestion, isLoading }) {
  const { interviewConfig } = useConversation();

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">AI Interviewer</h2>
          <p className="text-gray-400 text-sm">
            {interviewConfig?.role} Interview - {interviewConfig?.topic}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <AnimatedBot />
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        {isLoading ? (
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-gray-400">AI is thinking...</span>
          </motion.div>
        ) : currentQuestion ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white text-lg leading-relaxed">
              {currentQuestion}
            </p>
          </motion.div>
        ) : (
          <p className="text-gray-400">
            Welcome! I'll be conducting your interview today. Let's get started.
          </p>
        )}
      </div>

      {currentQuestion && (
        <div className="mt-4 text-sm text-gray-400">
          <p>💡 Take your time to think through your answer before responding.</p>
        </div>
      )}
    </div>
  );
}

export default AssistantPage;