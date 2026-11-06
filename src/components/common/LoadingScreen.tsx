import React, { useState, useEffect } from 'react';
import { HeartPulse } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 900);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 1400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle crimson radial glow */}
      <div className="absolute inset-0 bg-radial-crimson opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-in fade-in zoom-in-95 duration-500">
        {/* Heart Health Emblem */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#A30D25] to-[#40050e] flex items-center justify-center shadow-[0_0_40px_rgba(163,13,37,0.6)] border border-[#A30D25]/40">
            <HeartPulse className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-2xl border border-[#A30D25]/30 animate-ping opacity-25" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.25em] text-white font-serif-luxury uppercase">
          HEART HEALTH
        </h1>
        <p className="mt-2 text-sm tracking-[0.2em] text-[#A30D25] font-medium font-serif-luxury">
          شركة صيدليات صحة القلب
        </p>
        <p className="mt-1 text-xs text-neutral-400 tracking-wider">
          EXECUTIVE MANAGEMENT & MEETING PORTAL
        </p>

        {/* Loading line */}
        <div className="w-48 h-0.5 bg-neutral-900 rounded-full mt-8 overflow-hidden relative">
          <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#A30D25] to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};
