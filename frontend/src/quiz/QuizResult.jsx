import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext.jsx';
import { saveQuizResult } from '../lib/analysisStore.js';
import useConversation from '../stateManage/useConversation.js';

const QuizResult = ({ score, totalQuestions, answers = [], questions = [] }) => {
  const navigate = useNavigate();
  const { config } = useQuiz();
  const { quizData } = useConversation();
  
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    if (score >= 80) return 'Excellent work!';
    if (score >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  // Save quiz result to localStorage
  useEffect(() => {
    if (config && score !== undefined && totalQuestions > 0) {
      const correctAnswers = Math.round((score / 100) * totalQuestions);
      
      // Create detailed results if we have answers and questions
      const details = [];
      if (answers.length > 0 && (questions.length > 0 || quizData.length > 0)) {
        const questionData = questions.length > 0 ? questions : quizData;
        answers.forEach((answer, index) => {
          const question = questionData[index];
          if (question) {
            details.push({
              question: question.question || `Question ${index + 1}`,
              selectedAnswer: question.options ? question.options[answer] : answer,
              correctAnswer: question.options ? question.options[question.correct] : question.correct,
              isCorrect: answer === question.correct
            });
          }
        });
      }

      const quizResult = {
        name: `${config.subject || 'Quiz'} Quiz`,
        subject: config.subject || 'General',
        level: config.level || 'medium',
        when: new Date().toISOString(),
        score: correctAnswers,
        total: totalQuestions,
        details: details
      };

      saveQuizResult(quizResult);
      console.log('Quiz result saved:', quizResult);
    }
  }, [config, score, totalQuestions, answers, questions, quizData]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-gray-900 rounded-xl p-8">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-white/70">{getScoreMessage()}</p>
          </div>

          <div className="mb-8">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
              {Math.round(score)}%
            </div>
            <p className="text-white/70">
              You got {Math.round((score / 100) * totalQuestions)} out of {totalQuestions} questions correct
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all"
            >
              Take Quiz Again
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizResult;