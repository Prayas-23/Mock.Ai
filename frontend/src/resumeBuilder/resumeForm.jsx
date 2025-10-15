import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactInfoForm from './Forms/contactInfoForm.jsx';
import ProfileInfoForm from './Forms/profileInfoForm.jsx';
import EducationForm from './Forms/educationForm.jsx';
import WorkExperienceForm from './Forms/workExperienceForm.jsx';
import SkillInfoForm from './Forms/skillInfoForm.jsx';
import CertificationForm from './Forms/certificationForm.jsx';
import InterestForm from './Forms/interestForm.jsx';
import ProjectDetailsForm from './Forms/projectDetailsForm.jsx';
import ResumeModal from './resumeModal.jsx';
import useResumeStore from '../stateManage/useResumeStore.js';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import TemplateOne from './resumeTemplates/templateOne.jsx';
import TemplateTwo from './resumeTemplates/templateTwo.jsx';
import StepProgress from './stepProgress.jsx';
import ResumeTemplateModal from './resumeTemplateModal.jsx';
import axios from 'axios';
import server from '../environment.js'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react';

const steps = [
  { id: 1, title: 'Contact Info', component: ContactInfoForm },
  { id: 2, title: 'Profile', component: ProfileInfoForm },
  { id: 3, title: 'Education', component: EducationForm },
  { id: 4, title: 'Work Experience', component: WorkExperienceForm },
  { id: 5, title: 'Skills', component: SkillInfoForm },
  { id: 6, title: 'Certifications', component: CertificationForm },
  { id: 7, title: 'Interests', component: InterestForm },
  { id: 8, title: 'Projects', component: ProjectDetailsForm },
];

function ResumeForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { resumeData, selectedTemplate } = useResumeStore();
  const resumeRef = useRef();

  const nextStep = () => {
    if (currentStep < steps.length) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = async () => {
    if (!resumeRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.title || 'resume'}.pdf`);
      
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1]?.component;
  const TemplateComponent = selectedTemplate === 1 ? TemplateOne : TemplateTwo;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Build Your Resume</h1>
          <StepProgress currentStep={currentStep} totalSteps={steps.length} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -50 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-4">
                  {steps[currentStep - 1]?.title}
                </h2>
                {CurrentStepComponent && <CurrentStepComponent />}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Change Template
                </button>
                
                {currentStep === steps.length ? (
                  <button
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Download PDF
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div ref={resumeRef}>
                <TemplateComponent />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPreview && (
        <ResumeModal 
          isOpen={showPreview} 
          onClose={() => setShowPreview(false)} 
        />
      )}
      
      {showTemplateModal && (
        <ResumeTemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
    </div>
  );
}

export default ResumeForm;