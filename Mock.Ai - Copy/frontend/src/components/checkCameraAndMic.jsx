import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCamera, FaMicrophone, FaRedo, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

export default function CheckCameraAndMic({onContinue}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [micAccessible, setMicAccessible] = useState(false);
  const [camWorking, setCamWorking] = useState(false);
  const [checking, setChecking] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [microphoneError, setMicrophoneError] = useState("");
  const navigate = useNavigate();

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const checkPermissionsAndDevices = async () => {
    setChecking(true);
    setPermissionError(false);
    setMicAccessible(false);
    setCamWorking(false);
    setCameraError("");
    setMicrophoneError("");
    stopStream();

    try {
      console.log("Requesting camera and microphone access...");
      
      // First, try to get user media with basic constraints
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      console.log("Successfully obtained media stream:", stream);

      // Get device list (may be empty if permissions not granted)
      let devices = [];
      try {
        devices = await navigator.mediaDevices.enumerateDevices();
        console.log("Available devices:", devices);
      } catch (deviceErr) {
        console.warn("Could not enumerate devices:", deviceErr);
      }

      const videoDevices = devices.filter(device => device.kind === "videoinput");
      console.log("Video devices found:", videoDevices.length);
      
      // Check if we actually have video devices
      if (videoDevices.length === 0) {
        console.warn("No video devices found in device list");
        setCameraError("No camera detected. Please check if your camera is properly connected.");
      }

      // Set camera as working since we got the stream
      setCamWorking(true);

      // Set up the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          videoRef.current.play().catch(err => {
            console.error("Error playing video:", err);
            setCamWorking(false);
            setCameraError(`Error playing video: ${err.message || "Unknown error"}`);
          });
        };
        videoRef.current.onerror = (err) => {
          console.error("Video error:", err);
          setCamWorking(false);
          setCameraError(`Video error: ${err.message || "Unknown error"}`);
        };
      }

      // Check if we have audio tracks
      const audioTracks = stream.getAudioTracks();
      const hasAudioTrack = audioTracks.length > 0;
      console.log("Audio tracks found:", audioTracks.length);
      
      if (!hasAudioTrack) {
        console.warn("No audio tracks found in stream");
        setMicrophoneError("No microphone detected. Please check if your microphone is properly connected.");
      }
      
      setMicAccessible(hasAudioTrack);

      setChecking(false);
    } catch (err) {
      console.error("Primary permission request failed:", err);
      
      // Handle specific error cases
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionError(true);
        setCameraError("Camera permission denied. Please allow camera access in your browser settings.");
        setMicrophoneError("Microphone permission denied. Please allow microphone access in your browser settings.");
      } else if (err.name === "NotFoundError" || err.name === "OverconstrainedError") {
        setCameraError("No camera found or camera not supported.");
        setMicrophoneError("No microphone found or microphone not supported.");
      } else if (err.name === "NotReadableError") {
        setCameraError("Camera is being used by another application.");
        setMicrophoneError("Microphone is being used by another application.");
      } else {
        setCameraError(`Camera error: ${err.message || "Unknown error"}`);
        setMicrophoneError(`Microphone error: ${err.message || "Unknown error"}`);
      }
      
      // Try video only if audio+video failed
      try {
        console.log("Trying video only...");
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = videoStream;
        setCamWorking(true);
        console.log("Video-only stream obtained");
        
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded (video only)");
            videoRef.current.play().catch(err => {
              console.error("Error playing video (video only):", err);
              setCamWorking(false);
              setCameraError(`Error playing video: ${err.message || "Unknown error"}`);
            });
          };
          videoRef.current.onerror = (err) => {
            console.error("Video error (video only):", err);
            setCamWorking(false);
            setCameraError(`Video error: ${err.message || "Unknown error"}`);
          };
        }
        
        setMicAccessible(false); // Audio failed but video worked
        setMicrophoneError("Microphone access failed but camera is working.");
      } catch (videoErr) {
        console.error("Video also failed:", videoErr);
        setPermissionError(true);
        setCamWorking(false);
        setMicAccessible(false);
        
        // Handle specific video error cases
        if (videoErr.name === "NotAllowedError" || videoErr.name === "PermissionDeniedError") {
          setCameraError("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (videoErr.name === "NotFoundError" || videoErr.name === "OverconstrainedError") {
          setCameraError("No camera found or camera not supported.");
        } else if (videoErr.name === "NotReadableError") {
          setCameraError("Camera is being used by another application.");
        } else {
          setCameraError(`Camera error: ${videoErr.message || "Unknown error"}`);
        }
      }
      
      setChecking(false);
    }
  };

  useEffect(() => {
    checkPermissionsAndDevices();
    return () => {
      stopStream();
    };
  }, []);

  const handleContinue = () => {
    if (micAccessible && camWorking) {
      stopStream();
      onContinue?.();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col items-center justify-center px-4 py-8 w-full">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl p-6 md:p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3"
          >
            Device Setup Check
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            For the best interview experience, we need to verify your camera and microphone are working properly.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 md:gap-12 mt-6">
          {/* Camera Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col items-center w-full max-w-md"
          >
            <div className="relative w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gray-900/80 border border-gray-700 rounded-2xl p-1 shadow-xl">
                <div className="aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center relative">
                  {checking ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-gray-400">Testing camera...</p>
                    </div>
                  ) : camWorking ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaCamera className="text-4xl mb-2" />
                      <p>Camera not detected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${checking ? 'bg-yellow-500 animate-pulse' : camWorking ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">
                Camera: {checking ? 'Checking...' : camWorking ? 'Working' : 'Not Detected'}
              </span>
              {camWorking && <FaCheckCircle className="text-green-500 ml-2" />}
              {!camWorking && !checking && <FaTimesCircle className="text-red-500 ml-2" />}
            </div>
            
            {/* Camera Error Message */}
            {cameraError && (
              <div className="mt-2 text-sm text-red-400 flex items-center">
                <FaExclamationTriangle className="mr-1" />
                <span>{cameraError}</span>
              </div>
            )}
          </motion.div>

          {/* Microphone Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col items-center w-full max-w-md"
          >
            <div className="relative w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gray-900/80 border border-gray-700 rounded-2xl p-1 shadow-xl">
                <div className="aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
                  {checking ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-gray-400">Testing microphone...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <FaMicrophone className={`text-5xl ${micAccessible ? 'text-cyan-400' : 'text-gray-600'}`} />
                      <p className="mt-3 text-lg">
                        {micAccessible ? 'Microphone Active' : 'Microphone Not Detected'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${checking ? 'bg-yellow-500 animate-pulse' : micAccessible ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">
                Microphone: {checking ? 'Checking...' : micAccessible ? 'Accessible' : 'Not Detected'}
              </span>
              {micAccessible && <FaCheckCircle className="text-green-500 ml-2" />}
              {!micAccessible && !checking && <FaTimesCircle className="text-red-500 ml-2" />}
            </div>
            
            {/* Microphone Error Message */}
            {microphoneError && (
              <div className="mt-2 text-sm text-red-400 flex items-center">
                <FaExclamationTriangle className="mr-1" />
                <span>{microphoneError}</span>
              </div>
            )}
          </motion.div>
        </div>

        {checking ? (
          <div className="mt-10 text-center">
            <p className="text-gray-400 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              Verifying your devices...
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center"
          >
            {permissionError && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-xl mb-6 max-w-2xl mx-auto">
                <p className="font-medium">Device Access Required</p>
                <p className="mt-1 text-sm">Please allow camera and microphone access in your browser settings to continue.</p>
                <button
                  onClick={checkPermissionsAndDevices}
                  className="mt-3 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition flex items-center mx-auto"
                >
                  <FaRedo className="mr-2" /> Try Again
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={checkPermissionsAndDevices}
                className="px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium flex items-center transition"
              >
                <FaRedo className="mr-2" /> Recheck Devices
              </button>
              
              <button
                onClick={handleContinue}
                disabled={!(micAccessible && camWorking)}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-300 ${
                  micAccessible && camWorking
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-purple-500/30 transform hover:scale-105"
                    : "bg-gray-700 cursor-not-allowed text-gray-400"
                }`}
              >
                {micAccessible && camWorking ? (
                  <>
                    <FaCheckCircle className="mr-2" /> Continue to Interview
                  </>
                ) : (
                  "Devices Required to Continue"
                )}
              </button>
            </div>
            
            {(!micAccessible || !camWorking) && !permissionError && (
              <div className="mt-4 text-sm text-gray-400">
                <p className="mb-2">Troubleshooting tips:</p>
                <ul className="list-disc list-inside text-left max-w-2xl mx-auto space-y-1">
                  <li>Ensure your camera and microphone are properly connected</li>
                  <li>Check that no other applications are using your camera/microphone</li>
                  <li>Verify browser permissions for camera and microphone access</li>
                  <li>Try refreshing the page or restarting your browser</li>
                  <li>If you're using an external camera, check the connection</li>
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 text-center text-gray-500 text-sm"
      >
        <p>We only access your camera and microphone during the interview session.</p>
      </motion.div>
    </div>
  );
}