import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ResumeModal from './resumeModal';
import { useNavigate } from 'react-router-dom';
import useResumeStore from '../stateManage/useResumeStore';
import axios from 'axios'
import server from '../environment.js'
import { useGetAllResumes } from '../context/getAllResume.jsx';
import { formatDistanceToNow } from 'date-fns';
import image1 from '../assets/resumeImage1.png';
import image2 from '../assets/resumeImage2.png';

const images = [image1, image2]

function SelectResume() {
  const { resumes } = useGetAllResumes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const navigate = useNavigate();
  const { setResumeData, setSelectedTemplate } = useResumeStore();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleAddClick = async () => {
    try {
      const response = await axios.post(`${server}/resume/createResume`, {
        title: 'New Resume',
        template: 1
      });
      
      if (response.data.success) {
        setResumeData(response.data.resume);
        setSelectedTemplate(1);
      }
    } catch (error) {
      console.error('Error creating resume:', error);
    }
  };

  const handleCreateAndNavigate = async () => {
    handleClose();
    await handleAddClick();
    navigate('/resume/resumeForm');
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Choose Your Resume
          </h1>
          <p className="text-white/70 text-lg">
            Select an existing resume or create a new one
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Resume Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create New Resume</h3>
              <p className="text-white/70 text-center">Start building a new resume from scratch</p>
            </div>
          </motion.div>

          {/* Existing Resumes */}
          {resumes?.map((resume, index) => (
            <motion.div
              key={resume._id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 cursor-pointer hover:border-blue-500/50 transition-colors"
              onClick={() => {
                setResumeData(resume);
                setSelectedResumeId(resume._id);
                console.log(resume._id)
                navigate('/resume/resumeForm');
              }}
            >
              <div className="mb-4">
                <img 
                  src={images[resume.template - 1] || images[0]} 
                  alt="Resume template" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{resume.title}</h3>
              <p className="text-white/70 text-sm mb-2">
                Template {resume.template}
              </p>
              <p className="text-white/50 text-xs">
                Updated {formatDistanceToNow(new Date(resume.updatedAt))} ago
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <ResumeModal 
        isOpen={isModalOpen} 
        onClose={handleClose}
        onCreateResume={handleCreateAndNavigate}
      />
    </div>
  );
}

export default SelectResume;