import React from "react";
import { MovingBorderDiv } from "../components/ui/moving-border.jsx";
import { 
  Security, 
  Groups, 
  EmojiEvents,
  Verified,
  Diversity3,
  School,
  WorkspacePremium,
  CorporateFare
} from "@mui/icons-material";

const TrustContainer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 p-6 lg:p-12 bg-black/50 backdrop-blur-sm">
      <MovingBorderDiv className="w-[80vw] md:w-[40vw] lg:w-[18vw] h-64 text-center font-semibold flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-400 to-blue-700 text-white">
        <Security fontSize="large" />
        <h3 className="text-xl font-bold">Security You Can Trust</h3>
        <p className="text-sm font-medium text-white/90">
          Strong encryption and careful handling keep your data safe.
        </p>
        <div className="flex items-center mt-2 text-xs">
          <Verified fontSize="small" className="mr-1" />
          <span>Trusted by teams and learners</span>
        </div>
      </MovingBorderDiv>

      <MovingBorderDiv className="w-[80vw] md:w-[40vw] lg:w-[18vw] h-64 text-center font-semibold flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-green-400 to-emerald-600 text-white">
        <Groups fontSize="large" />
        <h3 className="text-xl font-bold">Experienced AI Team</h3>
        <p className="text-sm font-medium text-white/90">
          Built by practitioners who care about clarity, speed, and results.
        </p>
        <div className="flex items-center mt-2 text-xs">
          <WorkspacePremium fontSize="small" className="mr-1" />
          <span>Practical methods. Real outcomes.</span>
        </div>
      </MovingBorderDiv>

     
      <MovingBorderDiv className="w-[80vw] md:w-[40vw] lg:w-[18vw] h-64 text-center font-semibold flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-purple-500 to-indigo-700 text-white">
        <EmojiEvents fontSize="large" />
        <h3 className="text-xl font-bold">Recognized By The Community</h3>
        <p className="text-sm font-medium text-white/90">
          Positive feedback from users, mentors, and hiring managers.
        </p>
        <div className="flex items-center mt-2 text-xs">
          <CorporateFare fontSize="small" className="mr-1" />
          <span>Built with industry input</span>
        </div>
      </MovingBorderDiv>

      <MovingBorderDiv className="w-[80vw] md:w-[40vw] lg:w-[18vw] h-64 text-center font-semibold flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-orange-400 to-rose-600 text-white">
        <Diversity3 fontSize="large" />
        <h3 className="text-xl font-bold">Fair And Inclusive By Design</h3>
        <p className="text-sm font-medium text-white/90">
          We aim for a balanced experience for every learner.
        </p>
        <div className="flex items-center mt-2 text-xs">
          <School fontSize="small" className="mr-1" />
          <span>Used by students and professionals</span>
        </div>
      </MovingBorderDiv>
    </div>
  );
};

export default TrustContainer;