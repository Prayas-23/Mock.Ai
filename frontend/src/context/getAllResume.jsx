import React, { useEffect, useState, createContext, useContext } from 'react';
import apiClient from '../lib/apiClient.js';
import server from '../environment';

const ResumeContext = createContext();

export const ResumesProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        // Try backend API first
        const { data } = await apiClient.post(
          `${server}/api/resume/get-resumes`,
          {}
        );

        if (data.userResumes?.resumes) {
          setResumes(data.userResumes.resumes || []);
        } else {
          setResumes([]);
        }
      } catch (err) {
        console.log("Backend API not available, using local storage fallback");
        
        // Fallback to local storage
        try {
          const localResumes = JSON.parse(localStorage.getItem('mock_ai_resumes') || '[]');
          setResumes(localResumes);
          console.log('Loaded local resumes:', localResumes.length);
        } catch (localErr) {
          console.error("Error loading local resumes:", localErr);
          setResumes([]);
        }
      } finally {
        setLoading(false); 
      }
    };

    fetchResumes();
  }, []);

  return (
    <ResumeContext.Provider value={{ resumes, loading }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useGetAllResumes = () => useContext(ResumeContext);
