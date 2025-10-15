import { cn } from "../lib/utils.js";
import React, { useEffect, useState, useRef } from "react";
import AssistantPage from "./CareerAssistantPage.jsx";
import CandidateSection from "./CandidateInterviewSection.jsx";
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
  const [spokenText, setSpokenText] = useState("");
  const [recordingStatus, setRecordingStatus] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [controls, setControls] = useState(null);
  const [userMic, setUserMic] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [finishInterview, setFinishInterview] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState(null); // Changed from {} to null
  const [stopSpeaking, setStopSpeaking] = useState(() => () => {});

  const scrollRef = useRef(null);
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const {
    candidateAnswer,
    setCandidateAnswer,
    assistantContent,
    setAssistantContent,
    askedQuestions,
    setAskedQuestions,
    givenAnswers,
    setGivenAnswers,
    interviewData,
    interviewModelId,
    setInterviewModelId,
    distractionDetect,
    setDistractionDetect,
  } = useConversation();
  const [startInterview, setStartInterview] = useState(false);

  useEffect(() => {
    setSpokenText(transcript);
    setCandidateAnswer(transcript);
  }, [transcript]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [spokenText]);

  const handleBeginRecordingButton = () => {
    setRecordingStatus(false);
    controls?.startListening();
  }

  const handleEndInterview = async () => {
    setReportLoading(true);
    stopSpeaking();
    
    try {
      // Ensure we have a valid interviewModelId
      if (!interviewModelId) {
        console.error("No interviewModelId found");
        // Create fallback data when no interviewModelId
        const fallbackData = createFallbackReportData();
        setReportData(fallbackData);
        setReportLoading(false);
        return;
      }

      const { data } = await axios.post(
        `${server}/api/interview/evaluateInterviewResult`,
        { interviewId: interviewModelId }
      );

      if (data?.interviewData) {
        console.log("Interview data received:", data.interviewData);
        setReportData(data.interviewData);

        // Persist to History automatically
        try {
          const d = data.interviewData;
          const role = d?.interviewId?.interview?.role || '';
          const topics = Array.isArray(d?.interviewId?.interview?.topics) ? d.interviewId.interview.topics.join(', ') : '';
          const details = Array.isArray(d?.questions)
            ? d.questions.map((q, i) => ({
                question: q,
                answer: d?.answers?.[i] ?? '',
                suggestions: d?.reviews?.[i]?.review ?? '',
                score: d?.reviews?.[i]?.score ?? null,
              }))
            : [];
          
          saveInterviewAnalysis({
            when: new Date().toISOString(),
            role,
            topics,
            totalScore: d?.totalScore,
            overall: d?.overAllReview,
            details,
          });
        } catch (e) {
          console.warn('Failed to auto-save interview analysis', e);
        }
      } else {
        console.error("No interview data received from server");
        // Create fallback data when server doesn't return proper data
        const fallbackData = createFallbackReportData();
        setReportData(fallbackData);
      }

      setReportLoading(false);
    } catch (err) {
      console.error("Error ending interview:", err);
      setReportLoading(false);
      
      // Create fallback data when API fails
      const fallbackData = createFallbackReportData();
      setReportData(fallbackData);
    }

    setStartInterview(false);
    setAskedQuestions([]);
    setAssistantContent("");
  }

  // Helper function to create fallback report data
  const createFallbackReportData = () => {
    const questions = askedQuestions.length > 0 
      ? askedQuestions.map(q => typeof q === 'string' ? q : q.question) 
      : ["Sample Interview Question"];
    const answers = givenAnswers.length > 0 ? givenAnswers : ["Your responses were recorded"];
    
    return {
      questions: questions,
      answers: answers,
      reviews: questions.map((_, idx) => ({
        review: "Thank you for participating in the interview. Due to a technical issue, detailed feedback is not available at this time.",
        score: 7
      })),
      totalScore: questions.length * 7,
      overAllReview: "Interview completed successfully. Thank you for your participation. For detailed feedback, please try again or contact support.",
      participant: {
        name: authUser?.user_metadata?.full_name || authUser?.email || 'Interview Candidate',
        email: authUser?.email || 'candidate@example.com',
        profilePicURL: authUser?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.user_metadata?.full_name || 'User')}&background=random&color=fff&size=128`
      },
      interviewId: {
        interview: {
          role: interviewData?.role || 'Software Developer',
          topics: Array.isArray(interviewData?.topic) ? interviewData.topic : [interviewData?.topic || 'General']
        }
      }
    };
  }

  useEffect(() => {
    if (distractionDetect) {
      handleEndInterview();
    }
  }, [distractionDetect]);


  useEffect(() => {
    if (!aiSpeaking && finishInterview) {
      handleEndInterview();
    }
  }, [aiSpeaking, finishInterview]);

  const handleSendRecording = async () => {
    setSpokenText("");
    setRecordingStatus(true);
    controls?.stopListening();
    controls?.resetTranscript();
    setAiSpeaking(true);

    try {
      const role = interviewData?.role;
      const topic = interviewData?.topic;
      const numOfQns = interviewData?.numOfQns;
      const name = authUser?.user_metadata?.full_name || authUser?.email || 'User';
      const previousQuestions = askedQuestions;
      const askedQuestion = assistantContent;
      const givenAnswer = candidateAnswer?.trim() === "" ? "Answer Not Provided." : candidateAnswer;
      const modelId = interviewModelId;

      // Save the answer before generating next question
      if (givenAnswer) {
        givenAnswers.push(givenAnswer);
        setGivenAnswers([...givenAnswers]);
      }

      const { data } = await apiClient.post(`${server}/api/interview/generate-question`,
        { role, topic, name, previousQuestions, askedQuestion, givenAnswer, numOfQns, modelId }
      );

      setAssistantContent(data.responseData);
      // Handle both string and object responses from backend
      const questionData = typeof data.question === 'string' 
        ? { question: data.question, time: 120 }
        : data.question;
      askedQuestions.push(questionData);
      setAskedQuestions(askedQuestions);

      if (data.finishInterview) {
        setFinishInterview(data.finishInterview);
        setAiSpeaking(true);
      }

    } catch (err) {
      console.log("Backend API not available, using mock interview flow");
      
      // Save the answer
      if (candidateAnswer?.trim()) {
        givenAnswers.push(candidateAnswer.trim());
        setGivenAnswers([...givenAnswers]);
      }

      // Generate next question or finish interview
      const mockQuestions = getMockInterviewQuestions(role, topic);
      const maxQuestions = parseInt(numOfQns) || 5;
      
      if (askedQuestions.length >= maxQuestions) {
        // Finish the interview
        setFinishInterview(true);
        setAiSpeaking(true);
        setAssistantContent("Thank you for your responses! That concludes our interview. Let me prepare your feedback report.");
      } else {
        // Ask next question
        const nextQuestionIndex = askedQuestions.length;
        const nextQuestion = mockQuestions[nextQuestionIndex] || mockQuestions[mockQuestions.length - 1];
        
        const mockResponse = `Thank you for that answer. Let's move on to the next question.`;
        
        setAssistantContent(mockResponse);
        askedQuestions.push({ question: nextQuestion, time: 120 }); // 2 minutes per question
        setAskedQuestions([...askedQuestions]);
        
        console.log("Asked next mock question:", nextQuestion);
      }
    }

    setCandidateAnswer("");
  }

  const handleStartInterview = async () => {
    setStartInterview(true);
    setUserMic(true);
    setAiSpeaking(true);
    try {
      const role = interviewData?.role;
      const topic = interviewData?.topic;
      const numOfQns = interviewData?.numOfQns;
      const name = authUser?.user_metadata?.full_name || authUser?.email || 'User';
      const previousQuestions = askedQuestions;
      const modelId = interviewModelId;

      const { data } = await apiClient.post(`${server}/api/interview/generate-question`,
        { role, topic, name, previousQuestions, numOfQns, modelId }
      );
      setAssistantContent(data.responseData);
      // Handle both string and object responses from backend
      const questionData = typeof data.question === 'string' 
        ? { question: data.question, time: 120 }
        : data.question;
      askedQuestions.push(questionData);
      setAskedQuestions(askedQuestions);
    } catch (err) {
      console.log("Backend API not available, using mock interview questions");
      
      // Fallback to mock interview questions
      const mockQuestions = getMockInterviewQuestions(role, topic);
      const firstQuestion = mockQuestions[0];
      
      const mockResponse = `Hello ${name}! Welcome to your ${role} interview. Let's begin with our first question.`;
      
      setAssistantContent(mockResponse);
      askedQuestions.push({ question: firstQuestion, time: 120 }); // 2 minutes per question
      setAskedQuestions([...askedQuestions]);
      
      console.log("Started mock interview with question:", firstQuestion);
    }
  }

  // Helper function to generate mock interview questions
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
      ],
      'Marketing Manager': [
        "Tell me about your marketing experience.",
        "How do you measure the success of a marketing campaign?",
        "Describe a successful marketing strategy you've implemented.",
        "How do you stay updated with marketing trends?",
        "What's your experience with digital marketing tools?"
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
  }

  if (reportLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 z-[1000] w-[100vw] h-[100vh] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-3/4 left-3/4 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-bounce" style={{animationDelay: '4s'}}></div>
        </div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 h-64 relative z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl animate-pulse"></div>
          <Lottie animationData={creatingReportAnimation} loop={true} className="relative z-10" />
        </motion.div>
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white text-2xl mt-6 font-semibold relative z-10"
        >
          <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Creating Your Performance Analysis...
          </span>
        </motion.h2>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ delay: 0.8, duration: 2, repeat: Infinity }}
          className="h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-4 relative z-10"
        />
      </div>
    );
  }

  // Show feedback when we have reportData, even if it's an empty object
  if (reportData !== null) {
    return <InterviewFeedback data={reportData} onBack={() => {
      // Reset interview state
      setInterviewModelId('');
      setReportData(null);
      navigate("/");
    }} />;
  }

  return (
    <div className="relative flex min-h-screen w-[100vw] items-start justify-center pt-28 pb-10 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated grid background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:50px_50px]",
          "[background-image:linear-gradient(to_right,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.1)_1px,transparent_1px)]",
          "animate-pulse"
        )}
      />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-3/4 left-1/6 w-20 h-20 bg-cyan-400/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-indigo-900/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      {startInterview && userMic && !aiSpeaking && (
        <div className="absolute top-6 right-6 z-50">
          <CountdownTimer duration={askedQuestions[askedQuestions.length - 1]?.time} onComplete={() => {
            handleSendRecording();
          }} />
        </div>
      )}
      <div className="h-[100%] w-[100%] min-h-[calc(100vh-7rem)] min-w-[100vw] z-20 flex justify-start items-start flex-col gap-8">
        <div className="w-full flex flex-row justify-center gap-10">
          <AssistantPage />
          <CandidateSection startInterview={startInterview} />
          <TextToVoice
            onStart={() => setAiSpeaking(true)}
            onEnd={() => {
              setAiSpeaking(false);
              // Ensure we trigger the end interview if needed
              if (finishInterview) {
                handleEndInterview();
              }
            }}
            setStopSpeakingCallback={setStopSpeaking}
          />
        </div>

        <div className="w-[80%] mx-auto mb-8 flex flex-col items-center space-y-4">
          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-lg blur-lg opacity-30 group-hover:opacity-60 transition duration-300 animate-pulse"></div>
            <div className="relative w-full h-16 p-4 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-blue-500/30 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
              <div className="h-full flex items-center relative z-10">
                <p
                  ref={scrollRef}
                  className="text-white text-lg font-medium whitespace-nowrap overflow-x-auto scroll-smooth no-scrollbar"
                >
                  {spokenText || (
                    <span className="text-gray-400">
                      <span className="text-blue-400 animate-pulse">Ready to speak...</span> Your voice transcript
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            {
              recordingStatus ? (
                <button
                  className={cn(
                    "px-6 py-3 font-medium rounded-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 focus:outline-none relative overflow-hidden group",
                    "bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-700 text-white",
                    "hover:from-cyan-700 hover:via-sky-700 hover:to-indigo-800 focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 hover:shadow-cyan-500/25",
                    (!userMic || controls?.isListening || aiSpeaking) && "opacity-50 cursor-not-allowed hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 hover:translate-y-0"
                  )}
                  onClick={handleBeginRecordingButton}
                  disabled={!userMic || controls?.isListening || aiSpeaking}
                >
                  <span className="relative z-10">Start Recording</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              ) : (
                <button
                  className={cn(
                    "px-6 py-3 font-medium rounded-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 focus:outline-none relative overflow-hidden group",
                    "bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white",
                    "hover:from-teal-700 hover:via-emerald-700 hover:to-teal-800 focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 hover:shadow-teal-500/25",
                    (!userMic || !controls?.isListening || aiSpeaking) && "opacity-50 cursor-not-allowed hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 hover:translate-y-0"
                  )}
                  onClick={handleSendRecording}
                  disabled={!userMic || !controls?.isListening || aiSpeaking}
                >
                  <span className="relative z-10">Submit Response</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              )
            }

            {
              startInterview ? <button className="px-6 py-3 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:via-red-700 hover:to-rose-800 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-rose-500/25 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50 relative overflow-hidden group"
                onClick={handleEndInterview}
              >
                <span className="relative z-10">Finish Session</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button> : <button className="px-6 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 relative overflow-hidden group"
                onClick={handleStartInterview}
              >
                <span className="relative z-10">Begin Session</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            }

            <VoiceConvertor
              onTranscriptUpdate={setTranscript}
              onControlsReady={setControls}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewPage