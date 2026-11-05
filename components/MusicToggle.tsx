"use client";

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/sound";

interface MusicToggleProps {
  variant?: "floating" | "inline";
}

export default function MusicToggle({ variant = "floating" }: MusicToggleProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((enabled) => {
      setSoundEnabled(enabled);
    });
    const timer = setTimeout(() => setShowHint(false), 7000);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleToggle = () => {
    setShowHint(false);
    soundEngine.toggleSound();
  };

  if (variant === "inline") {
    return (
      <button
        onClick={handleToggle}
        aria-label={soundEnabled ? "Mute festive audio" : "Enable festive audio"}
        className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 border cursor-pointer ${
          soundEnabled
            ? "bg-amber-500/20 border-amber-400/60 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.35)]"
            : "bg-white/5 border-amber-500/25 text-amber-100/70 hover:text-amber-200 hover:border-amber-400/50"
        }`}
      >
        {soundEnabled ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Sound On</span>
            <span className="flex items-end gap-0.5 h-3 ml-0.5">
              {[0, 1, 2].map((bar) => (
                <motion.span
                  key={bar}
                  animate={{ height: ["30%", "100%", "40%"] }}
                  transition={{
                    duration: 0.7 + bar * 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-0.5 bg-amber-400 rounded-full"
                />
              ))}
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-amber-300/60" />
            <span className="hidden sm:inline">Sound Off</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {showHint && !soundEnabled && (
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#120824]/90 backdrop-blur-md border border-amber-400/40 text-amber-200 text-xs font-medium shadow-[0_0_25px_rgba(245,158,11,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Enable festive music &amp; cracker SFX</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleToggle}
        aria-label={soundEnabled ? "Mute festive soundscape" : "Play festive soundscape"}
        className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full backdrop-blur-xl border transition-all duration-300 cursor-pointer ${
          soundEnabled
            ? "bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-500/25 border-amber-400/70 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.45)]"
            : "bg-[#0c051a]/85 border-amber-500/30 text-amber-200/80 hover:border-amber-400/60 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
        }`}
      >
        <span
          className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            soundEnabled
              ? "bg-gradient-to-br from-amber-400 to-orange-600 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.7)]"
              : "bg-amber-500/15 text-amber-300"
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </span>

        <div className="flex flex-col items-start pr-1">
          <span className="text-[10px] uppercase tracking-widest text-amber-300/70 leading-none">
            Festive Audio
          </span>
          <span className="text-xs font-semibold text-amber-100 mt-0.5 flex items-center gap-1.5">
            {soundEnabled ? "Playing Raga & SFX" : "Click to Unmute"}
          </span>
        </div>
      </motion.button>
    </div>
  );
}
