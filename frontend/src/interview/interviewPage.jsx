import { cn } from "../lib/utils.js";
import React, { useEffect, useState, useRef } from "react";
import AssistantPage from "./assistantPage.jsx";
import CandidateSection from "./candidateSection.jsx";
import VoiceConvertor from "../components/voiceToText.jsx";
import useConversation from "../stateManage/useConversation.js";
import axios from "axios";
import apiClient from '../lib/apiClient.js';
import TextToVoice from "../components/textToVoice.jsx";
import { useAuth } from "../context/AuthProvider.jsx";
import server from '../environment.js'
import { useNavigate } from 'react-router-dom'
import CountdownTimer from "../components/countDownTimer.jsx";
import InterviewFeedback from "../components/interviewFeedback.jsx";
import creatingReportAnimation from '../assets/animations/creatingReport.json'
import Lottie from "lottie-react";
import { saveInterviewAnalysis } from "../lib/analysisStore.js";
import { motion } from "framer-motion";

function InterviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    interviewModelId,
    conversation,
    addMessage,
    clearConversation,
    interviewConfig,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    isInterviewComplete,
    setIsInterviewComplete,
    interviewStartTime,
    setInterviewStartTime
  } = useConversation();

  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const questionRef = useRef(null);

  useEffect(() => {
    if (!interviewModelId || !interviewConfig) {
      navigate('/');
      return;
    }

    if (!interviewStarted) {
      startInterview();
      setInterviewStarted(true);
      setInterviewStartTime(Date.now());
    }
  }, [interviewModelId, interviewConfig, interviewStarted]);

  const startInterview = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.post(`${server}/api/interview/start`, {
        modelId: interviewModelId,
        config: interviewConfig
      });

      if (response.data.success) {
        const firstQuestion = response.data.question;
        setCurrentQuestion(firstQuestion);
        addMessage('ai', firstQuestion);
        setCurrentQuestionIndex(0);
      }
    } catch (error) {
      console.log('Backend API not available, using mock interview');
      
      // Fallback to mock interview
      const mockQuestions = getMockInterviewQuestions(interviewConfig?.role, interviewConfig?.topic);
      const firstQuestion = mockQuestions[0];
      
      setCurrentQuestion(firstQuestion);
      addMessage('ai', `Welcome to your ${interviewConfig?.role || 'interview'} session! ${firstQuestion}`);
      setCurrentQuestionIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for mock questions (same as CareerInterviewPage)
  const getMockInterviewQuestions = (role, topic) => {
    const roleBasedQuestions = {
      'Software Developer': [
        "Tell me about yourself and your experience in software development.",
        "What programming languages are you most comfortable with and why?",
        "Describe a challenging project you've worked on recently.",
        "How do you approach debugging a complex issue?",
        "What's your experience with version control systems like Git?"
      ],
      'Data Scientist': [
        "Tell me about your background in data science.",
        "What's your experience with machine learning algorithms?",
        "How do you handle missing data in your datasets?",
        "Describe a data science project you're proud of.",
        "What tools do you use for data visualization?"
      ],
      'Product Manager': [
        "Tell me about your experience in product management.",
        "How do you prioritize features in a product roadmap?",
        "Describe a time when you had to make a difficult product decision.",
        "How do you gather and analyze user feedback?",
        "What's your approach to working with engineering teams?"
      ]
    };

    const defaultQuestions = [
      "Tell me about yourself and your professional background.",
      "What interests you about this role?",
      "Describe a challenge you've faced and how you overcame it.",
      "Where do you see yourself in 5 years?",
      "Do you have any questions for us?"
    ];

    return roleBasedQuestions[role] || defaultQuestions;
  };

  const handleAnswerSubmit = async (answer) => {
    if (!answer.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setUserAnswer("");
      
      // Add user's answer to conversation
      addMessage('user', answer);

      const response = await apiClient.post(`${server}/api/interview/answer`, {
        modelId: interviewModelId,
        answer: answer,
        questionIndex: currentQuestionIndex,
        config: interviewConfig
      });

      if (response.data.success) {
        if (response.data.isComplete) {
          // Interview is complete
          setIsInterviewComplete(true);
          generateFinalReport();
        } else {
          // Get next question
          const nextQuestion = response.data.nextQuestion;
          setCurrentQuestion(nextQuestion);
          addMessage('ai', nextQuestion);
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }
    } catch (error) {
      console.log('Backend API not available, using mock interview flow');
      
      // Mock interview flow
      const mockQuestions = getMockInterviewQuestions(interviewConfig?.role, interviewConfig?.topic);
      const maxQuestions = interviewConfig?.numOfQns || 5;
      
      if (currentQuestionIndex + 1 >= maxQuestions) {
        // Interview is complete
        setIsInterviewComplete(true);
        addMessage('ai', 'Thank you for your responses! That concludes our interview.');
        generateFinalReport();
      } else {
        // Get next question
        const nextQuestionIndex = currentQuestionIndex + 1;
        const nextQuestion = mockQuestions[nextQuestionIndex] || mockQuestions[mockQuestions.length - 1];
        
        setCurrentQuestion(nextQuestion);
        addMessage('ai', `Thank you for that answer. ${nextQuestion}`);
        setCurrentQuestionIndex(nextQuestionIndex);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateFinalReport = async () => {
    try {
      setIsGeneratingReport(true);
      
      const response = await apiClient.post(`${server}/api/interview/evaluate`, {
        modelId: interviewModelId,
        config: interviewConfig,
        conversation: conversation,
        duration: Date.now() - interviewStartTime
      });

      if (response.data.success) {
        const analysisData = response.data.analysis;
        setFeedbackData(analysisData);
        
        // Save to local storage
        await saveInterviewAnalysis(analysisData);
        
        setShowFeedback(true);
      }
    } catch (error) {
      console.log('Backend API not available, using mock feedback data');
      
      // Create fallback data when API fails
      const fallbackData = createFallbackFeedbackData();
      setFeedbackData(fallbackData);
      
      // Save mock data to local storage
      try {
        await saveInterviewAnalysis(fallbackData);
      } catch (saveError) {
        console.log('Could not save mock analysis data');
      }
      
      setShowFeedback(true);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Helper function to create fallback feedback data
  const createFallbackFeedbackData = () => {
    const userMessages = conversation.filter(msg => msg.type === 'user');
    const aiMessages = conversation.filter(msg => msg.type === 'ai');
    
    return {
      questions: aiMessages.map(msg => msg.content),
      answers: userMessages.map(msg => msg.content),
      reviews: aiMessages.map((_, idx) => ({
        review: "Thank you for participating in the interview. Due to a technical issue, detailed feedback is not available at this time.",
        score: 7
      })),
      totalScore: aiMessages.length * 7,
      overAllReview: "Interview completed successfully. Thank you for your participation. For detailed feedback, please try again or contact support.",
      participant: {
        name: user?.user_metadata?.full_name || user?.email || 'Interview Candidate',
        email: user?.email || 'candidate@example.com',
        profilePicURL: user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'User')}&background=random&color=fff&size=128`
      },
      interviewId: {
        interview: {
          role: interviewConfig?.role || 'Software Developer',
          topics: Array.isArray(interviewConfig?.topics) ? interviewConfig.topics : [interviewConfig?.topic || 'General']
        }
      }
    };
  };

  const handleVoiceResult = (transcript) => {
    setUserAnswer(transcript);
  };

  const handleTimeUp = () => {
    if (!isInterviewComplete) {
      setIsInterviewComplete(true);
      generateFinalReport();
    }
  };

  if (showFeedback && feedbackData) {
    return <InterviewFeedback data={feedbackData} />;
  }

  if (isGeneratingReport) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Lottie 
            animationData={creatingReportAnimation} 
            loop={true} 
            className="w-64 h-64 mx-auto mb-8"
          />
          <h2 className="text-2xl font-bold text-white mb-4">
            Generating Your Interview Report
          </h2>
          <p className="text-gray-400">
            Please wait while we analyze your performance...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mock Interview</h1>
            <p className="text-gray-400">
              Question {currentQuestionIndex + 1} of {interviewConfig?.numOfQns || 0}
            </p>
          </div>
          
          {interviewConfig?.duration && (
            <CountdownTimer
              duration={interviewConfig.duration * 60}
              onTimeUp={handleTimeUp}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Assistant Section */}
          <div className="space-y-6">
            <AssistantPage 
              currentQuestion={currentQuestion}
              isLoading={isLoading}
            />
            
            {currentQuestion && (
              <TextToVoice text={currentQuestion} />
            )}
          </div>

          {/* Candidate Section */}
          <div className="space-y-6">
            <CandidateSection />
            
            {/* Answer Input */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Your Answer</h3>
              
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here or use voice input..."
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || isInterviewComplete}
              />
              
              <div className="flex justify-between items-center mt-4">
                <VoiceConvertor
                  onResult={handleVoiceResult}
                  isListening={isListening}
                  setIsListening={setIsListening}
                />
                
                <button
                  onClick={() => handleAnswerSubmit(userAnswer)}
                  disabled={!userAnswer.trim() || isLoading || isInterviewComplete}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Submit Answer'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((currentQuestionIndex + 1) / (interviewConfig?.numOfQns || 1)) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;