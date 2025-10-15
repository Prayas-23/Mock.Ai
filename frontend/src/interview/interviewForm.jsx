import React, { useState } from 'react';
import './InterviewSection.css';
import { useNavigate } from 'react-router-dom';
import useConversation from '../stateManage/useConversation.js';
import toast from 'react-hot-toast';
import axios from 'axios';
import apiClient from '../lib/apiClient.js';
import CircularProgress from '@mui/material/CircularProgress';
import server from '../environment.js';

const InterviewForm = () => {
  const navigate = useNavigate();
  const { setInterviewModelId, setInterviewConfig } = useConversation();
  
  const [formData, setFormData] = useState({
    role: '',
    topic: '',
    name: '',
    numOfQns: 5,
    level: 'intermediate'
  });
  const [loading, setLoading] = useState(false);

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Product Manager',
    'UI/UX Designer',
    'Software Engineer',
    'Mobile Developer',
    'QA Engineer'
  ];

  const topics = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'System Design',
    'Data Structures',
    'Algorithms',
    'Database Design',
    'Cloud Computing',
    'Machine Learning',
    'Cybersecurity'
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'advanced', label: 'Advanced (5+ years)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.role || !formData.topic || !formData.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiClient.post(`${server}/api/interview/create`, {
        role: formData.role,
        topic: formData.topic,
        name: formData.name,
        numOfQns: parseInt(formData.numOfQns),
        level: formData.level
      });

      if (response.data.success) {
        const modelId = response.data.modelId;
        setInterviewModelId(modelId);
        setInterviewConfig(formData);
        
        toast.success('Interview session created successfully!');
        navigate('/interviewPage');
      } else {
        toast.error('Failed to create interview session');
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Setup Your Mock Interview</h1>
            <p className="text-gray-400 text-lg">
              Configure your personalized interview experience
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Interview Topic *
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                >
                  <option value="">Select a topic</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Experience Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Questions
                </label>
                <select
                  name="numOfQns"
                  value={formData.numOfQns}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value={3}>3 Questions (Quick)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={7}>7 Questions (Comprehensive)</option>
                  <option value={10}>10 Questions (Extensive)</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} className="mr-2" />
                      Creating Interview...
                    </>
                  ) : (
                    'Start Interview'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center text-gray-400">
            <p className="text-sm">
              💡 Your interview will be tailored based on your selections above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewForm;