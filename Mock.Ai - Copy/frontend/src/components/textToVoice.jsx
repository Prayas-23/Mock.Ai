import React, { useEffect, useRef } from "react";
import useConversation from "../stateManage/useConversation";

function TextToVoice({ onStart, onEnd, setStopSpeakingCallback }) {
  const { assistantContent } = useConversation();
  const audioRef = useRef(null);

  const speakText = async () => {
    if (!assistantContent.trim()) return;

    try {
      onStart?.();

      // Add a small delay to ensure state is properly updated before speaking
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch("https://prepverse-ai-python-server.onrender.com/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: assistantContent }),
      });

      if (!response.ok) throw new Error("Failed to fetch voice");

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Reduce latency by preloading and setting playback properties
      audio.preload = "auto";
      audio.volume = 1.0;

      audio.onended = () => {
        onEnd?.();
        audioRef.current = null;
      };

      // Handle playback errors
      audio.onerror = (err) => {
        console.error("Audio playback error:", err);
        onEnd?.();
        audioRef.current = null;
      };

      // Play immediately
      await audio.play();
    } catch (err) {
      console.error("Voice playback error:", err.message);
      onEnd?.();
    }
  };

  useEffect(() => {
    if (setStopSpeakingCallback) {
      setStopSpeakingCallback(() => () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
          onEnd?.();
        }
      });
    }
  }, [setStopSpeakingCallback]);

  useEffect(() => {
    // Only speak when there's actual content and it's not empty
    if (assistantContent && assistantContent.trim()) {
      speakText();
    }
  }, [assistantContent]);

  return null;
}

export default TextToVoice;