import React, { useState } from 'react';
import './InterviewSection.css';
import { useNavigate } from 'react-router-dom';
import useConversation from '../stateManage/useConversation.js';
import toast from 'react-hot-toast';
import axios from 'axios';
import apiClient from '../lib/apiClient.js';
import CircularProgress from '@mui/material/CircularProgress';
import server from '../environment.js';

const CareerInterviewForm = () => {
  const navigate = useNavigate();
  const { setAccessInterviewPage,  setInterviewData, interviewModelId, setInterviewModelId} = useConversation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: '',
    topic: '',
    numOfQns: 2
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    if (!formData.role || !formData.topic || !formData.numOfQns) {
      toast.error("Please complete all fields");
      return;
    }

    if (formData.numOfQns <= 0) {
      toast.error("Enter a valid number of questions");
      return;
    }

    try {
      setLoading(true);
      const { role, topic, numOfQns } = formData;
      const { data } = await apiClient.post(
        `${server}/api/interview/checkRoleAndTopic`,
        {
          role, topic, numOfQns
        }
      );

      if (data.response && !data.response.valid) {
        setLoading(false);
        return toast.error("Enter a valid role and topic");
      }

      setInterviewModelId(data.interviewModelId);

      setInterviewData({
        topic,
        role,
        numOfQns
      });

      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
      // Show more detailed error message
      let errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred";
      
      // Handle quota exceeded error specifically
      if (errorMessage.includes("limit for AI question generation")) {
        errorMessage = "We've reached our AI quota limit. Please try again later or contact support.";
      }
      
      toast.error(`Error: ${errorMessage}`);
      return; // Prevent navigation on error
    }

    setAccessInterviewPage(true);
    navigate('/interviewPage');
  };

  return (
    <div className="interview-container">
      <div className="gradient-box">
        <h1 className="colorful-heading">Welcome to Interview Practice</h1>

        <div className="scrollable-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="role">Target role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter job role"
              />
            </div>
            <div className="form-group">
              <label htmlFor="topic">Topic</label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Enter interview topic"
              />
            </div>
            <div className="form-group">
              <label htmlFor="numOfQns">Number of questions</label>
              <input
                type="number"
                id="numOfQns"
                name="numOfQns"
                value={formData.numOfQns}
                onChange={handleChange}
                placeholder="Enter number of questions 0-25"
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Loading...
                </>
               ) : (
                "Start practice"
               )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CareerInterviewForm;
