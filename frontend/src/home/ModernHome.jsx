import React from "react";
import { useNavigate } from "react-router-dom";
import { TextGenerateEffect } from "../components/ui/text-generate-effect.jsx";
import { SparklesCore } from "../components/ui/sparkles-core.jsx";
import { FlipWords } from "../components/ui/flip-words.jsx";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card.jsx";
import { HoverEffect } from "../components/ui/card-hover-effect.jsx";
import { LampContainer } from "../components/ui/lamp.jsx";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards.jsx";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect.jsx";
import { FaRobot, FaFileAlt, FaChartLine, FaUsers } from "react-icons/fa";

const features = [
  {
    title: "AI-Powered Interviews",
    description: "Practice with our advanced AI that simulates real interview scenarios and provides personalized feedback.",
    icon: <FaRobot className="text-2xl text-blue-400" />,
    link: "/mockInterviewLandingPage",
  },
  {
    title: "Smart Resume Builder",
    description: "Create professional resumes with AI assistance that optimizes for applicant tracking systems.",
    icon: <FaFileAlt className="text-2xl text-green-400" />,
    link: "/resume",
  },
  {
    title: "Performance Analytics",
    description: "Track your progress with detailed analytics and insights to identify areas for improvement.",
    icon: <FaChartLine className="text-2xl text-purple-400" />,
    link: "/history",
  },
  {
    title: "Community Support",
    description: "Join a community of learners and professionals to share experiences and get support.",
    icon: <FaUsers className="text-2xl text-amber-400" />,
    link: "/community",
  },
];

const testimonials = [
  {
    quote: "This platform transformed my interview preparation. The AI feedback was incredibly detailed and helpful.",
    name: "Alex Johnson",
    title: "Software Engineer at Google",
  },
  {
    quote: "The resume builder helped me land my dream job. The AI suggestions were spot on!",
    name: "Sarah Williams",
    title: "Product Manager at Microsoft",
  },
  {
    quote: "I've tried many interview prep platforms, but this one stands out with its personalized approach.",
    name: "Michael Chen",
    title: "Data Scientist at Amazon",
  },
  {
    quote: "The progress tracking feature helped me identify my weak areas and improve systematically.",
    name: "Priya Sharma",
    title: "UX Designer at Apple",
  },
];

const steps = [
  {
    title: "Create Profile",
    description: "Set up your profile with your career goals and target roles.",
  },
  {
    title: "Practice Interviews",
    description: "Engage in realistic mock interviews with our AI assistant.",
  },
  {
    title: "Get Feedback",
    description: "Receive detailed analysis and improvement suggestions.",
  },
  {
    title: "Track Progress",
    description: "Monitor your improvement over time with analytics.",
  },
  {
    title: "Land Opportunities",
    description: "Apply to jobs with confidence and get hired.",
  },
];

export function ModernHomeComponent() {
  const navigate = useNavigate();
  const words = ["Interviews", "Resumes", "Career", "Success"];

  const handleGetStarted = () => {
    navigate('/mockInterviewLandingPage');
  };

  const handleFeatureClick = (link) => {
    navigate(link);
  };
  
  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="h-[40rem] w-full bg-black bg-grid-white/[0.2] relative flex flex-col items-center justify-center">
        <div className="absolute inset-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
            Master Your
          </h1>
          
          <div className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 py-4">
            <FlipWords words={words} />
          </div>
          
          <div className="mt-8">
            <TextGenerateEffect
              words="Prepare for your dream job with AI-powered interview practice, resume optimization, and career guidance."
              className="text-lg md:text-2xl text-center text-white max-w-3xl mx-auto"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-12 justify-center">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/quiz')}
              className="px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              Take Quiz
            </button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Powerful <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Features</span>
        </h2>
        
        <HoverEffect items={features} />
      </div>
      
      {/* Process Section */}
      <LampContainer>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-8">
            Your Path to <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Success</span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {steps.map((step, index) => (
              <CardContainer key={index} className="inter-var">
                <CardBody className="bg-gray-900/80 border-black/[0.1] w-auto sm:w-[20rem] h-auto rounded-xl p-6 border">
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-white"
                  >
                    Step {index + 1}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-300 text-sm mt-2"
                  >
                    {step.title}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-400 text-xs mt-2"
                  >
                    {step.description}
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </LampContainer>
      
      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          What People <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">Say</span>
        </h2>
        
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
      
      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Transform Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Career?</span>
        </h2>
        
        <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
          Join thousands of professionals who have accelerated their careers with our platform.
        </p>
        
        <TypewriterEffectSmooth
          words={[
            { text: "Start" },
            { text: "your" },
            { text: "journey" },
            { text: "today." },
          ]}
          className="mb-10"
        />
        
        <button 
          onClick={handleGetStarted}
          className="px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
}

export default ModernHomeComponent;