import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BackgroundLines } from "../components/ui/background-lines.jsx";
import { ColourfulText } from "../components/ui/colourful-text.jsx";
import { ImagesSlider } from "../components/ui/images-slider.jsx";
import ContainerBox from "./containerBox.jsx";
import { ScrollerComponent } from "./scrollerComponent.jsx";
import WorkFlow from "./WorkFlow.jsx";

function HomeComponent() {
  const imageRef = useRef(null);

  const images = [
    "https://sbscyber.com/hs-fs/hubfs/Images/BlogImages/AdobeStock_604631734.jpeg?width=8000&height=4064&name=AdobeStock_604631734.jpeg",
    "https://www.ttnews.com/sites/default/files/2023-09/iTECH-Dysart-1200.jpg",
    "https://media.licdn.com/dms/image/v2/D4E12AQHKzw6UvrCJ3Q/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1735926830143?e=2147483647&v=beta&t=dILdJD0aBd3IJOnt13DwQ6oR4heH4FIqHc2CBp8lzks",
  ];

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      if (!imageElement) return;
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[200vh] bg-gradient-to-b from-[#0a0a0a] via-[#0b0f19] to-[#000000] relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl animate-bounce" style={{animationDelay: '4s'}}></div>
      </div>
      <div className="h-[70vh] flex flex-col justify-center items-center text-white px-4 relative z-10">
        {/* Subtle black gradient veil */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(32,32,64,0.35),transparent_70%)]" />
        <BackgroundLines className="flex items-center justify-center w-full flex-col gap-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl md:text-5xl lg:text-7xl font-bold text-center relative z-20 font-sans"
          >
            Your <ColourfulText text="AI career co-pilot" /> <br /> 
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Practice. Improve. Get hired.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-xl mx-auto text-sm md:text-lg text-neutral-300 text-center hover:text-white transition-colors duration-300"
          >
            Train with AI guidance, focused interview practice, and quick resume polish.
          </motion.p>
        </BackgroundLines>
      </div>

      <div className="hero-image-wrapper md:mt-0 w-[100vw] flex justify-center h-[50rem]">
        <div
          ref={imageRef}
          className="hero-image w-[80vw] transition-all duration-500"
        >
          <ImagesSlider className="h-[40rem]" images={images}>
            <motion.div
              initial={{ opacity: 0, y: -80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="z-50 flex flex-col justify-center items-center"
            >
              <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-emerald-200 to-cyan-400 py-4">
                Practice smarter with AI <br /> 
                <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                  Build skills, confidence, and momentum
                </span>
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.08, rotateX: 5 }}
                whileTap={{ scale: 0.92 }}
                className="px-6 py-3 backdrop-blur-sm border bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-400/30 text-white mx-auto text-center rounded-full relative mt-4 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
              >
                <span className="relative z-10 font-semibold">Get started →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-xl opacity-50"></div>
                <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-400 to-transparent" />
              </motion.button>
            </motion.div>
          </ImagesSlider>
        </div>
      </div>

      <WorkFlow/>

      <div >
        <ContainerBox/>
      </div>

      <div className="mb-10">
        <ScrollerComponent/>
      </div>
      
    </div>
  );
}

export default HomeComponent;
