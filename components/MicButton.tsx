"use client";

import { Button } from "@/components/ui/button";
import { convertToWav } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { updateAuctionByAudio } from "@/services/api";
import { Role } from "@/types/enum";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface MicButtonProps {
  onSuccess: () => void;
  disabled?: boolean;
  className?: string;
  sessionId: string;
  current: Role;
  isTextInputFocused: boolean;
}

export default function MicButton({
  sessionId,
  current,
  isTextInputFocused,
  disabled = false,
  className = "",
  onSuccess,
}: MicButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = useCallback(async () => {
    if (!isSupported) {
      alert("Audio recording is not supported in your browser.");
      return;
    }
    try {
      setIsProcessing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 44100,
        },
      });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm", // We'll convert to wav later
      });
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstart = () => {
        setIsRecording(true);
        setIsProcessing(false);
      };
      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(false);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        // Convert to wav (mono, LINEAR16, 44100Hz)
        const wavBlob = await convertToWav(audioBlob);
        // Send to API
        await updateAuctionByAudio(sessionId, current, wavBlob);
        onSuccess();
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (error) {
      console.error("Error starting audio recording:", error);
      setIsProcessing(false);
      alert("Could not start audio recording. Please try again.");
    }
  }, [isSupported, sessionId, current, onSuccess]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isTextInputFocused) return;
      if (e.code === "Space") e.preventDefault();
      if (e.code === "Space" && !isRecording && !disabled && !isProcessing) {
        handleStartRecording();
      }
    },
    [
      isRecording,
      disabled,
      isProcessing,
      handleStartRecording,
      isTextInputFocused,
    ]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") e.preventDefault();
      if (e.code === "Space" && isRecording) {
        handleStopRecording();
      }
    },
    [isRecording, handleStopRecording]
  );

  // Add keyboard event listeners for spacebar
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Check MediaRecorder support
  if (typeof window !== "undefined" && !window.MediaRecorder) {
    setIsSupported(false);
  }

  if (!isSupported) {
    return (
      <Button
        disabled
        size="lg"
        className={cn("h-16 w-16 rounded-full p-0 bg-gray-400", className)}
        title="Voice recording not supported in this browser"
      >
        <MicOff className="w-8 h-8 text-white" />
      </Button>
    );
  }

  return (
    <Button
      onClick={isRecording ? handleStopRecording : handleStartRecording}
      disabled={disabled || isProcessing}
      size="lg"
      className={cn(
        "h-16 w-16 rounded-full p-0 transition-all duration-200 shadow-lg hover:shadow-xl",
        isRecording
          ? "bg-red-500 hover:bg-red-600 animate-pulse"
          : "bg-green-600 hover:bg-green-700",
        className
      )}
      title={
        isRecording
          ? "Click to stop recording"
          : "Click to start voice recording"
      }
    >
      {isProcessing ? (
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      ) : isRecording ? (
        <MicOff className="w-8 h-8 text-white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}
    </Button>
  );
}
