import React, { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBot from "../components/AnimatedBot.jsx";
import toast from 'react-hot-toast'
import axios from 'axios'
import apiClient from '../lib/apiClient.js';
import useConversation from '../stateManage/useConversation.js'
import { useNavigate } from 'react-router-dom';
import server from "../environment.js";

export default function ProfileInterviewForm() {
  const [topics, setTopics] = useState([""]);
  const [resumeFile, setResumeFile] = useState(null);
  const [role, setRole] = useState("");
  const [numberOfQns, setNumberOfQns] = useState(2);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setAccessInterviewPage, setInterviewData, interviewModelId, setInterviewModelId } = useConversation();

  const handleTopicChange = (index, value) => {
    const updated = [...topics];
    updated[index] = value;
    setTopics(updated);
  };

  const addTopicField = () => setTopics([...topics, ""]);

  const removeTopicField = (index) => {
    const updated = topics.filter((_, i) => i !== index);
    setTopics(updated);
  };

  const handleFileUpload = (e) => setResumeFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !role.trim() || !numberOfQns || !topics[0].trim()) {
      return toast.error("Fill the form properly.");
    }

    setLoading(true); 
    const formData = new FormData();
    formData.append('file', resumeFile);
    formData.append('role', role);
    formData.append('numberOfQns', numberOfQns);
    topics.forEach(t => formData.append('topics', t));

    try {
      const { data } = await apiClient.post(
        `${server}/api/profile-interview/checkRoleValidity`,
        formData
      );

      if (data.interviewModelId) {
        setInterviewModelId(data.interviewModelId);
      }

      setInterviewData({
        topic: topics.join(', '),
        role,
        numOfQns : numberOfQns
      });

      setAccessInterviewPage(true);
      setTopics([""]);
      setResumeFile(null);
      setRole("");
      setNumberOfQns(2);
      navigate('/interviewPage');

    } catch (err) {
      console.log(err);
      setTopics([""]);
      setResumeFile(null);
      setRole("");
      setNumberOfQns(2);
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white px-4 py-8 flex items-center justify-center w-full relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-3/4 left-3/4 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl animate-bounce" style={{animationDelay: '4s'}}></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl flex flex-col md:flex-row gap-6 bg-gradient-to-br from-slate-800/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-indigo-500/20 overflow-hidden relative z-10"
      >
        {/* Floating gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5 opacity-50 animate-pulse"></div>
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-slate-900/80 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center relative">
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
            <AnimatedBot variant="assistant" className="w-64 h-64" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 bg-clip-text text-transparent mt-4 relative z-10"
          >
            Personalized AI Interview Coach
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-sm text-slate-300 mt-2 relative z-10"
          >
            Upload your resume and get tailored interview questions
          </motion.p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 p-6 h-[70vh] space-y-5 overflow-y-auto max-h-[70vh] relative z-10"
        >
          <div>
            <label className="block mb-2 text-sm font-semibold text-indigo-200">Upload Resume</label>

            {!resumeFile ? (
              <div className="relative w-full border-2 border-dashed border-indigo-400/50 rounded-xl p-6 bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm hover:border-indigo-400/80 hover:bg-gradient-to-br hover:from-slate-800/80 hover:to-indigo-900/80 cursor-pointer transition-all duration-300 group">
                <input
                  type="file"
                  accept=".pdf"
                  id="resume-upload"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl">📄</span>
                  </div>
                  <p className="text-sm text-slate-300 group-hover:text-white transition-colors duration-300">
                    Click or drag a PDF file here to upload
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/80 to-indigo-900/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-500/30">
                <span className="text-sm truncate text-white flex items-center gap-2">
                  <span className="text-lg">📄</span> {resumeFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setResumeFile(null)}
                  className="ml-3 px-3 py-1 text-xs bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-indigo-200">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="w-full p-3 rounded-xl bg-gradient-to-r from-slate-800/80 to-indigo-900/80 backdrop-blur-sm text-white border border-indigo-500/30 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm transition-all duration-300 hover:border-indigo-400/50"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-indigo-200">Number of Questions</label>
            <input
              type="number"
              value={numberOfQns}
              onChange={(e) => setNumberOfQns(e.target.value)}
              placeholder="e.g., 5"
              className="w-full p-3 rounded-xl bg-gradient-to-r from-slate-800/80 to-indigo-900/80 backdrop-blur-sm text-white border border-indigo-500/30 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm transition-all duration-300 hover:border-indigo-400/50"
              min={1}
            />
          </div>

          <div>
            <label className="block mb-3 text-sm font-semibold text-indigo-200">Topics</label>
            {topics.map((topic, index) => (
              <div key={index} className="flex gap-3 mb-3 items-center">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                  placeholder={`Topic ${index + 1}`}
                  className="flex-grow p-3 rounded-xl bg-gradient-to-r from-slate-800/80 to-indigo-900/80 backdrop-blur-sm text-white border border-indigo-500/30 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm transition-all duration-300 hover:border-indigo-400/50"
                />
                {topics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTopicField(index)}
                    className="text-red-400 hover:text-red-300 text-lg p-2 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTopicField}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-sm text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              + Add Topic
            </button>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group
              ${loading 
                ? 'bg-gradient-to-r from-slate-600 to-slate-700 cursor-not-allowed opacity-70' 
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 hover:scale-105 shadow-lg hover:shadow-indigo-500/25'
              }`}
            >
              <span className="relative z-10">
                {loading ? (
                  <div className="flex justify-center items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Start Interview'
                )}
              </span>
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
