'use client';

import { useRef, useState, useEffect } from 'react';
import Image from "next/image";

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showWaves, setShowWaves] = useState(true);

  useEffect(() => {
    // Audio must be created client-side only (new Audio() needs window)
    audioRef.current = new Audio("/audio/sakura.mp3");
    audioRef.current.volume = 0.4;
    audioRef.current.loop = true;
  }, []);

  // Ripple runs once on initial page load only — ~5 pulses (animate-ping's
  // cycle is 1s), then it's gone for good, regardless of later play/pause clicks.
  useEffect(() => {
    // Starts true so the first paint already shows the ripple; this effect
    // only has to switch it off, with no setState during the effect body.
    const timer = setTimeout(() => setShowWaves(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPlayingMusic && audioRef.current) {
      // play() rejects when the browser blocks playback; without this the
      // button would read "on" while nothing plays, and the rejection would
      // surface as an unhandled promise error.
      audioRef.current.play().catch(() => setIsPlayingMusic(false));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlayingMusic]);

  // Dismiss the "Click for music" hint on a click ANYWHERE on the page
  useEffect(() => {
    if (hasInteracted) return;
    const dismissHint = () => setHasInteracted(true);
    document.addEventListener('pointerdown', dismissHint);
    return () => document.removeEventListener('pointerdown', dismissHint);
  }, [hasInteracted]);

  return (
    <div
      data-no-rotate
      className="fixed bottom-6 left-6 z-50 flex items-center"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="relative w-10 h-10">
        {showWaves && (
          <>
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping pointer-events-none" />
            <span
              className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping pointer-events-none"
              style={{ animationDelay: '0.5s' }}
            />
          </>
        )}
        <Image
          src={!isPlayingMusic ? "/icons/soundoff.png" : "/icons/soundon.png"}
          alt="Sound"
          width={40}
          height={40}
          className="relative w-10 h-10 cursor-pointer object-contain"
          onPointerDown={(e) => {
            e.stopPropagation();
            setIsPlayingMusic((prev) => !prev);
            setHasInteracted(true);
          }}
        />
      </div>
      {!hasInteracted && (
        <div className="ml-4 flex items-center gap-3 pointer-events-none animate-pulse">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex justify-center items-center shadow-lg border border-white/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <p className="bg-black/30 text-white font-semibold px-3 py-1.5 rounded-2xl backdrop-blur-sm hidden sm:block text-sm">
            Click for music
          </p>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;