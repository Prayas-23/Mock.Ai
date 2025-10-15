import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// Removed animate.css import
// Removed Lottie import
import useConversation from "../stateManage/useConversation";

const InterviewFeedback = ({ data, onBack }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const { setInterviewModelId } = useConversation();

  const feedbackData = data?.questions?.length
    ? data.questions.map((q, idx) => ({
      question: typeof q === 'string' ? q : q.question || q,
      answer: data.answers?.[idx] || "Answer not provided.",
      suggestions: data.reviews?.[idx]?.review || "No review available.",
      score: data.reviews?.[idx]?.score ?? 0,
    }))
    : [
      {
        question: "Sample Question 1",
        answer: "Sample Answer 1",
        suggestions: "Be more clear and provide examples.",
        score: 5,
      },
      {
        question: "Sample Question 2",
        answer: "Sample Answer 2",
        suggestions: "Use a structured format.",
        score: 6,
      },
    ];

  const overallFeedback = data?.overAllReview || "No overall feedback available.";
  const totalScore = data?.totalScore ?? 0;

  const participant = data?.participant || {};
  const name = participant.name || "Interview Candidate";
  const email = participant.email || "example@example.com";
  const profilePic =
    participant.profilePicURL || "https://ui-avatars.com/api/?name=Interview+Candidate&background=0D8ABC&color=fff&size=100";

  useEffect(() => {
    // Removed Intersection Observer for animations
    // This effect is now empty but kept for potential future use
  }, []);

  return (
    // Removed background animation divs
    <div className="relative overflow-hidden w-[100vw]">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-18 min-h-screen font-sans">
        {/* Candidate Info */}
        {/* Removed animate__animated classes */}
        <div className="flex items-center gap-6 mb-10">
          <img
            src={profilePic}
            alt={name}
            className="w-24 h-24 object-cover rounded-full border-4 border-cyan-400 shadow-xl hover:scale-110 transition-transform duration-300"
          />
          <div>
            <h2 className="text-3xl font-bold tracking-wide">{name}</h2>
            <p className="text-gray-400 text-sm">{email}</p>
          </div>
        </div>

        {/* Summary Cards */}
        {/* Removed animate__animated classes */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Score", value: `${totalScore} / ${data?.questions?.length * 10}` },
            { label: "Total Questions", value: `${data?.questions?.length ?? feedbackData.length}` },
            { label: "Role", value: data?.interviewId?.interview?.role || "N/A" },
            {
              label: "Topics",
              value:
                data?.interviewId?.interview?.topics?.join(", ") ||
                "No topics available",
            },
          ].map((item, idx) => (
            <div
              key={item.label}
              className={`backdrop-blur-lg bg-white/10 border border-white/10 p-6 rounded-2xl text-center shadow-lg hover:scale-105 transition-transform duration-300 hover:border-teal-400`}
            >
              <p className="text-gray-400">{item.label}</p>
              <h2 className="text-2xl text-sky-400 font-semibold">{item.value}</h2>
            </div>
          ))}
        </div>


        {/* Question Reviews */}
        {/* Removed animate__animated classes and Lottie animation */}
        <div className="mb-12">
          <div className="flex items-center mb-8 gap-4">
            <h3 className="text-yellow-300 text-2xl font-semibold whitespace-nowrap">
              Interview Question Reviews
            </h3>
            {/* Removed Lottie animation component */}
          </div>

          {feedbackData.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-800/60 rounded-xl p-4 mb-4 transition-all question-review-card border border-white/10 hover:shadow-[0_0_15px_#0ff] hover:scale-[1.02]"
            >
              <div
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex justify-between items-center cursor-pointer px-2"
              >
                <h4 className="text-sky-300 font-semibold text-lg">
                  Q{idx + 1}. {item.question}
                </h4>
                {openIndex === idx ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {openIndex === idx && (
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-green-400">
                    <span className="uppercase text-sm text-gray-400">Your Answer</span>
                    <p className="mt-1">{item.answer}</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-yellow-400">
                    <div className="mb-2">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${item.score >= 7
                            ? "bg-green-500 text-black"
                            : "bg-red-600 text-white"
                          }`}
                      >
                        {item.score}/10
                      </span>
                    </div>
                    <span className="uppercase text-sm text-gray-400">Suggestions</span>
                    <p className="mt-1 text-white/90">{item.suggestions}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Overall Feedback Box */}
        {/* Removed animate__animated classes */}
        <div className="bg-gradient-to-br from-teal-700 to-cyan-800/80 p-6 rounded-2xl mb-10 shadow-lg border border-cyan-500 max-w-4xl mx-auto">
          <h4 className="text-xl text-white font-semibold mb-2">Overall Feedback</h4>
          <p className="text-white/90 leading-relaxed">{overallFeedback}</p>
        </div>

        {/* Back to Dashboard */}
        {/* Removed animate__animated classes */}
        <div className="flex justify-center">
          <button className="text-sky-400 hover:underline text-base"
            onClick={() => {
              setInterviewModelId('')
              onBack();
            }}
          >
            ← Back 
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback;