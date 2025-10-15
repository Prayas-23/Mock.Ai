import './App.css'
import InterviewPage from './interview/interviewPage';
import { NavbarDemo } from './components/navBar';
import HomeComponent from './home/home';
import { ModernHomeComponent } from './home/ModernHome';
import Footer from './components/footerComponent';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import AuthCallback from './components/AuthCallback';
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import InterviewForm from './interview/interviewForm';
import useConversation from './stateManage/useConversation';
import { Navigate } from 'react-router-dom';
import QuizPage from './quiz/QuizPage';
import QuizStart from './quiz/QuizeStart';
import ResumeLandingPage from './resumeBuilder/resumeLandingPage';
import ResumeForm from './resumeBuilder/resumeForm';
import useResumeStore from './stateManage/useResumeStore';
import SelectResume from './resumeBuilder/selectResume';
import { ResumesProvider } from './context/getAllResume';
import InterviewFeedback from './components/interviewFeedback';
import { MockInterviewLandingPage } from './interview/interviewLandingPage';
import Lottie from 'lottie-react';
import pageNotFound from './assets/animations/errorAnimation.json'
import ProfileInterviewForm from './interview/profileInterviewForm';

function App() {
  const { user, signOut } = useAuth();
  const { interviewModelId } = useConversation();
  const { resumeData } = useResumeStore();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>

      <div className="flex flex-col min-h-screen relative">

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              zIndex: 9999,
            },
          }}
        />
        <div className="fixed top-0 left-0 w-full z-30">
          <NavbarDemo />
        </div>

        <div className='flex flex-col items-center h-[100%] w-[100vw] bg-black'>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<ModernHomeComponent />} />
            <Route path='/auth/login' element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path='/auth/signup' element={!user ? <SignUp /> : <Navigate to="/" replace />} />
            <Route path='/auth/callback' element={<AuthCallback />} />
            <Route path='/logout' element={<Navigate to="/" replace />} />
            
            {/* Protected Routes */}
            <Route
              path='/interviewPage'
              element={
                <ProtectedRoute>
                  {interviewModelId ? (
                    <InterviewPage />
                  ) : (
                    <Navigate to="/" replace />
                  )}
                </ProtectedRoute>
              }
            />
            
            <Route path='/interviewForm' element={
              <ProtectedRoute>
                <InterviewForm />
              </ProtectedRoute>
            } />
            
            <Route path='/quiz' element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            } />
            
            <Route path='/quiz/start' element={
              <ProtectedRoute>
                <QuizStart />
              </ProtectedRoute>
            } />
            
            <Route path='/resume' element={
              <ProtectedRoute>
                <ResumeLandingPage />
              </ProtectedRoute>
            } />
            
            <Route
              path='/resume/selectResume'
              element={
                <ProtectedRoute>
                  <ResumesProvider>
                    <SelectResume />
                  </ResumesProvider>
                </ProtectedRoute>
              }
            />
            
            <Route 
              path='/resume/resumeForm' 
              element={
                <ProtectedRoute>
                  {resumeData?.title ? (
                    <ResumeForm />
                  ) : (
                    <Navigate to="/resume/selectResume" replace />
                  )}
                </ProtectedRoute>
              } 
            />
            
            <Route path='/interview/result' element={
              <ProtectedRoute>
                <InterviewFeedback />
              </ProtectedRoute>
            } />
            
            <Route path='/mockInterviewLandingPage' element={
              <ProtectedRoute>
                <MockInterviewLandingPage />
              </ProtectedRoute>
            } />
            
            <Route path='/profileInterviewForm' element={
              <ProtectedRoute>
                <ProfileInterviewForm />
              </ProtectedRoute>
            } />
            
            {/* 404 Page */}
            <Route path="*" element={
              <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-black text-white">
                <Lottie animationData={pageNotFound} loop={true} className="w-[400px] h-[400px]" />
              </div>
            } />

          </Routes>
        </div>

        <Footer />
      </div>

    </>
  )
}

export default App