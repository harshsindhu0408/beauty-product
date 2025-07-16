"use client";
import React, { useState, useEffect, useRef } from "react";

export const AudioPlayer = ({ audioUrl, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [waveformBars, setWaveformBars] = useState(40);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    setIsClient(true);

    // Set waveform bars based on screen size
    const updateWaveformBars = () => {
      if (typeof window !== "undefined") {
        setWaveformBars(window.innerWidth < 768 ? 40 : 60);
      }
    };

    updateWaveformBars();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateWaveformBars);
      return () => window.removeEventListener("resize", updateWaveformBars);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl, isClient]);

  const togglePlayPause = () => {
    if (!isClient) return;

    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    if (!isClient) return;

    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickRatio = clickX / progressWidth;
    const newTime = clickRatio * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isClient) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-3 md:p-4 flex items-center gap-2 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
        <div className="flex-1 h-5 md:h-6 bg-gray-200 rounded"></div>
        <div className="text-xs md:text-sm text-gray-600 font-medium min-w-[70px] md:min-w-[80px] text-right">
          0:00 / 0:00
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 flex items-center gap-2
        ${compact ? "text-xs" : "text-sm"}
      `}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        disabled={!isLoaded}
        className={`
          w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg flex-shrink-0
          ${
            isLoaded
              ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-110 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
      >
        {isPlaying ? (
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 md:w-5 md:h-5 ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Waveform-style Progress Bar */}
      <div className="flex-1 h-6 md:h-8 flex items-center min-w-0">
        <div
          ref={progressRef}
          className="relative w-full h-5 md:h-6 cursor-pointer flex items-center"
          onClick={handleProgressClick}
        >
          {/* Waveform background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center gap-0.5">
              {[...Array(waveformBars)].map((_, i) => {
                const height =
                  Math.random() * (waveformBars === 40 ? 16 : 20) + 4;
                const isActive = i < (progressPercentage / 100) * waveformBars;
                return (
                  <div
                    key={i}
                    className={`w-0.5 md:w-1 rounded-full transition-all duration-150 ${
                      isActive
                        ? "bg-gradient-to-t from-purple-400 to-purple-600"
                        : "bg-gray-300"
                    }`}
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Time Display */}
      <div className="text-xs md:text-sm text-gray-600 font-medium min-w-[70px] md:min-w-[80px] text-right">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};
