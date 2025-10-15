import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizResult from './QuizResult.jsx';
import useConversation from '../stateManage/useConversation.js';

const QuizInterface = ({ config }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);

  const { quizData } = useConversation();

  // Use quiz data from conversation state, fallback to sample questions
  const questions = quizData && quizData.length > 0 ? quizData : [
    {
      id: 1,
      question: "What is React?",
      options: [
        "A JavaScript library for building user interfaces",
        "A database management system",
        "A server-side programming language",
        "A CSS framework"
      ],
      correct: 0,
      timeLimit: 30
    },
    {
      id: 2,
      question: "Which hook is used for state management in React?",
      options: [
        "useEffect",
        "useState",
        "useContext",
        "useReducer"
      ],
      correct: 1,
      timeLimit: 30
    },
    {
      id: 3,
      question: "What is JSX?",
      options: [
        "A JavaScript extension",
        "A syntax extension for JavaScript",
        "A CSS preprocessor",
        "A database query language"
      ],
      correct: 1,
      timeLimit: 30
    }
  ];

  useEffect(() => {
    // Set initial time for current question
    const currentQ = questions[currentQuestion];
    if (currentQ && currentQ.timeLimit) {
      setTimeLeft(currentQ.timeLimit);
    }
  }, [currentQuestion, questions]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, showResult]);

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      const nextQ = questions[nextQuestion];
      setTimeLeft(nextQ?.timeLimit || 30);
    } else {
      setShowResult(true);
      setIsActive(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correct++;
      }
    });
    return (correct / questions.length) * 100;
  };

  // Handle case where no questions are available
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Quiz Questions Available</h2>
          <p className="text-white/70 mb-6">Please go back and try generating the quiz again.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <QuizResult 
        score={calculateScore()} 
        totalQuestions={questions.length}
        answers={answers}
        questions={questions}
      />
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-white/70">
              Time: {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">
              {currentQ.question}
            </h2>

            <div className="space-y-4">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </motion.button>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleNextQuestion}
                disabled={answers[currentQuestion] === undefined}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizInterface;