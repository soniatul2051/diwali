"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { soundEngine } from "@/lib/sound";

interface RangoliTheme {
  id: string;
  name: string;
  outerPetal: string;
  midPetal: string;
  innerLotus: string;
  accentGold: string;
  centerGem: string;
}

const RANGOLI_THEMES: RangoliTheme[] = [
  {
    id: "marigold",
    name: "Royal Marigold",
    outerPetal: "#EA580C",
    midPetal: "#E11D48",
    innerLotus: "#F59E0B",
    accentGold: "#FDE047",
    centerGem: "#A855F7",
  },
  {
    id: "peacock",
    name: "Peacock Navratna",
    outerPetal: "#0284C7",
    midPetal: "#059669",
    innerLotus: "#D97706",
    accentGold: "#FDE047",
    centerGem: "#EC4899",
  },
  {
    id: "sindoor",
    name: "Lotus Sindoor",
    outerPetal: "#BE123C",
    midPetal: "#9333EA",
    innerLotus: "#F97316",
    accentGold: "#FEF08A",
    centerGem: "#F43F5E",
  },
  {
    id: "emerald",
    name: "Vrindavan Gold",
    outerPetal: "#047857",
    midPetal: "#B45309",
    innerLotus: "#E11D48",
    accentGold: "#FDE047",
    centerGem: "#10B981",
  },
];

export default function Rangoli() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [pulseBoost, setPulseBoost] = useState(false);

  const theme = RANGOLI_THEMES[themeIndex];

  const handlePetalClick = (idx: number) => {
    soundEngine.enableSoundOnInteraction();
    soundEngine.playDiyaChime((idx % 6) - 2);
    setPulseBoost(true);
    setTimeout(() => setPulseBoost(false), 600);
  };

  const outerAngles = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const midAngles = Array.from({ length: 12 }, (_, i) => i * 30);
  const innerAngles = Array.from({ length: 8 }, (_, i) => i * 45);
  const dotAngles = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <section
      id="rangoli"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 px-4 sm:px-8 overflow-hidden"
    >
      {/* Ambient Radial Aura */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.14)_0%,rgba(12,5,26,0.95)_65%,#05020a_100%)] -z-20" />

      <div className="relative z-10 max-w-5xl w-full mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-xs uppercase tracking-[0.25em] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sacred Geometry • Traditional Alpona &amp; Kolam Art</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold font-serif bg-gradient-to-r from-amber-100 via-yellow-300 to-orange-400 bg-clip-text text-transparent"
        >
          Celestial Lotus Mandala Rangoli
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-2 max-w-2xl text-sm sm:text-base text-amber-100/75"
        >
          Welcoming Goddess Lakshmi with symmetrical lotus petals, golden
          paisley motifs, and auspicious glowing Bindu dots. Click the mandala
          or switch festive palettes below.
        </motion.p>

        {/* Interactive Palette & Rotation Switcher */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {RANGOLI_THEMES.map((t, i) => (
            <button
              key={t.id}
              onClick={() => {
                setThemeIndex(i);
                soundEngine.enableSoundOnInteraction();
                soundEngine.playDiyaChime(i);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                themeIndex === i
                  ? "bg-amber-500/25 border-amber-300 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                  : "bg-white/5 border-white/10 text-amber-100/70 hover:text-amber-100"
              }`}
            >
              <span
                style={{ backgroundColor: t.outerPetal }}
                className="w-3 h-3 rounded-full border border-amber-200"
              />
              <span>{t.name}</span>
            </button>
          ))}

          <button
            onClick={() => setIsRotating((r) => !r)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-white/5 border border-amber-400/30 text-amber-200 hover:bg-amber-500/15 transition-all cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`}
            />
            <span>{isRotating ? "Motion: Active" : "Motion: Paused"}</span>
          </button>
        </div>

        {/* Animated Symmetrical SVG Rangoli */}
        <motion.div
          animate={{ scale: pulseBoost ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="relative mt-10 w-[330px] h-[330px] sm:w-[480px] sm:h-[480px] md:w-[540px] md:h-[540px] flex items-center justify-center"
        >
          {/* Ambient Golden Glow Behind Rangoli */}
          <div className="pointer-events-none absolute inset-6 rounded-full bg-radial from-amber-500/30 via-orange-600/15 to-transparent blur-3xl -z-10" />

          <svg
            viewBox="-260 -260 520 520"
            className="w-full h-full overflow-visible drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] cursor-pointer"
          >
            <defs>
              <radialGradient id="rangoliCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={theme.accentGold} />
                <stop offset="60%" stopColor={theme.centerGem} />
                <stop offset="100%" stopColor="#1E0B36" />
              </radialGradient>
            </defs>

            {/* Outer Sacred Circle & Glowing Bindu Dots */}
            <g>
              <circle
                cx="0"
                cy="0"
                r="242"
                fill="none"
                stroke={theme.accentGold}
                strokeWidth="1.5"
                strokeDasharray="6 6"
                opacity="0.6"
              />
              {dotAngles.map((deg, idx) => {
                const rad = (deg * Math.PI) / 180;
                const x = Number((Math.cos(rad) * 242).toFixed(3));
                const y = Number((Math.sin(rad) * 242).toFixed(3));
                return (
                  <motion.circle
                    key={deg}
                    cx={x}
                    cy={y}
                    r={idx % 2 === 0 ? 5 : 3}
                    fill={idx % 2 === 0 ? theme.accentGold : theme.outerPetal}
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [0.85, 1.25, 0.85],
                    }}
                    transition={{
                      duration: 2.2,
                      delay: (idx % 6) * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
            </g>

            {/* Layer 1: 16-Petal Outer Mandala Ring (Clockwise Slow Rotation) */}
            <motion.g
              animate={isRotating ? { rotate: 360 } : undefined}
              transition={{
                duration: 64,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle
                cx="0"
                cy="0"
                r="220"
                fill="#120623"
                stroke={theme.accentGold}
                strokeWidth="2.5"
              />
              {outerAngles.map((deg, idx) => (
                <g
                  key={deg}
                  transform={`rotate(${deg})`}
                  onClick={() => handlePetalClick(idx)}
                >
                  <path
                    d="M 0 -130 C 32 -165, 36 -202, 0 -222 C -36 -202, -32 -165, 0 -130 Z"
                    fill={idx % 2 === 0 ? theme.outerPetal : theme.midPetal}
                    stroke={theme.accentGold}
                    strokeWidth="2"
                  />
                  <circle
                    cx="0"
                    cy="-182"
                    r="4.5"
                    fill={theme.accentGold}
                  />
                </g>
              ))}
            </motion.g>

            {/* Layer 2: 12-Petal Royal Paisley / Lotus Ring (Counter-Clockwise Rotation) */}
            <motion.g
              animate={isRotating ? { rotate: -360 } : undefined}
              transition={{
                duration: 48,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle
                cx="0"
                cy="0"
                r="152"
                fill="#190830"
                stroke={theme.accentGold}
                strokeWidth="2.5"
              />
              {midAngles.map((deg, idx) => (
                <g
                  key={deg}
                  transform={`rotate(${deg})`}
                  onClick={() => handlePetalClick(idx)}
                >
                  <path
                    d="M 0 -75 C 34 -102, 34 -138, 0 -152 C -34 -138, -34 -102, 0 -75 Z"
                    fill={idx % 2 === 0 ? theme.midPetal : theme.innerLotus}
                    stroke={theme.accentGold}
                    strokeWidth="2"
                  />
                  {/* Inner Petal Vein & Gem */}
                  <path
                    d="M 0 -88 L 0 -136"
                    stroke={theme.accentGold}
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  <circle cx="0" cy="-120" r="4" fill="#FFFBEB" />
                </g>
              ))}
            </motion.g>

            {/* Layer 3: 8-Fold Sacred Ashtadala Lotus & Geometric Star (Clockwise Rotation) */}
            <motion.g
              animate={isRotating ? { rotate: 360 } : undefined}
              transition={{
                duration: 36,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle
                cx="0"
                cy="0"
                r="92"
                fill="#220A3B"
                stroke={theme.accentGold}
                strokeWidth="2.5"
              />
              {innerAngles.map((deg, idx) => (
                <g
                  key={deg}
                  transform={`rotate(${deg})`}
                  onClick={() => handlePetalClick(idx)}
                >
                  <path
                    d="M 0 -22 C 26 -46, 26 -76, 0 -92 C -26 -76, -26 -46, 0 -22 Z"
                    fill={theme.innerLotus}
                    stroke={theme.accentGold}
                    strokeWidth="2"
                  />
                  <circle cx="0" cy="-62" r="3.5" fill="#FFFBEB" />
                </g>
              ))}
            </motion.g>

            {/* Center Bindu Medallion & Sacred Flame */}
            <g onClick={() => handlePetalClick(0)}>
              <circle
                cx="0"
                cy="0"
                r="34"
                fill="url(#rangoliCenterGlow)"
                stroke={theme.accentGold}
                strokeWidth="3"
              />
              <circle
                cx="0"
                cy="0"
                r="22"
                fill="none"
                stroke="#FFFBEB"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <motion.circle
                cx="0"
                cy="0"
                r="9"
                fill="#FFFBEB"
                animate={{ scale: [1, 1.3, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </g>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
