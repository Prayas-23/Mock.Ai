import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { motion } from "framer-motion";
import useConversation from '../stateManage/useConversation.js';
import { useAuth } from '../context/AuthProvider.jsx';
import EyeContactDetector from '../components/faceDetector.jsx';

function CandidateSection({ startInterview }) {
  const { candidateAnswer } = useConversation();
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const { authUser } = useAuth();

  React.useEffect(() => {
    if (candidateAnswer.trim()) {
      setIsSpeaking(true);
      const timeout = setTimeout(() => setIsSpeaking(false), 500); 
      return () => clearTimeout(timeout);
    }
  }, [candidateAnswer]);

  return (
    <div className="relative bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-xl w-[400px] h-[420px] p-6 flex flex-col items-center justify-start overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute -z-10 -top-16 -right-16 w-72 h-72 rounded-full bg-[radial-gradient(circle_at_70%_30%,#10b981_0%,transparent_60%)] opacity-30" />
      <div className="absolute -z-10 -bottom-24 -left-24 w-80 h-80 rounded-full bg-[radial-gradient(circle_at_30%_70%,#34d399_0%,transparent_60%)] opacity-20" />

      <div className="w-full flex-1 mb-3 relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-white/5" />
        {startInterview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full h-full rounded-lg overflow-hidden"
          >
            <EyeContactDetector />
          </motion.div>
        ) : (
          <Avatar
            alt="Candidate"
            src={authUser?.user_metadata?.avatar_url}
            sx={{
              width: 180,
              height: 180,
              border: '4px solid',
              borderColor: '#10B981',
              boxShadow: isSpeaking
                ? '0px 0px 60px 20px rgba(16, 185, 129, 0.8), 0px 0px 100px 30px rgba(5, 150, 105, 0.4)'
                : '0px 4px 30px rgba(16, 185, 129, 0.6), 0px 0px 50px rgba(5, 150, 105, 0.3)',
              position: 'relative',
              zIndex: 10
            }}
          />
        )}
      </div>

      <div className="text-lg font-semibold text-emerald-200">{authUser?.user_metadata?.full_name || authUser?.email || 'Candidate'}</div>
    </div>
  );
}

export default CandidateSection;
