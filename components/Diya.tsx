"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DiyaProps {
  id: number;
  isLit: boolean;
  onToggle?: (id: number) => void;
  label?: string;
  sanskritLabel?: string;
  size?: "sm" | "md" | "lg";
  variant?: "royal" | "saffron" | "crimson" | "emerald" | "amethyst";
  interactive?: boolean;
}

const VARIANT_COLORS = {
  royal: {
    bowlStart: "#B45309",
    bowlMid: "#78350F",
    bowlEnd: "#451A03",
    accent: "#FBBF24",
    gem: "#F59E0B",
  },
  saffron: {
    bowlStart: "#EA580C",
    bowlMid: "#9A3412",
    bowlEnd: "#431407",
    accent: "#FDE047",
    gem: "#FB923C",
  },
  crimson: {
    bowlStart: "#BE123C",
    bowlMid: "#881337",
    bowlEnd: "#4C0519",
    accent: "#FBBF24",
    gem: "#F43F5E",
  },
  emerald: {
    bowlStart: "#047857",
    bowlMid: "#064E3B",
    bowlEnd: "#022C22",
    accent: "#FCD34D",
    gem: "#34D399",
  },
  amethyst: {
    bowlStart: "#7E22CE",
    bowlMid: "#581C87",
    bowlEnd: "#2E1065",
    accent: "#FDE047",
    gem: "#C084FC",
  },
};

const FLOATING_SPARKS = [
  { id: 0, xOffset: -12, delay: 0, duration: 2.1 },
  { id: 1, xOffset: 10, delay: 0.45, duration: 1.9 },
  { id: 2, xOffset: -5, delay: 0.9, duration: 2.3 },
  { id: 3, xOffset: 14, delay: 1.3, duration: 2.0 },
  { id: 4, xOffset: 0, delay: 1.65, duration: 1.8 },
];

export default function Diya({
  id,
  isLit,
  onToggle,
  label,
  sanskritLabel,
  size = "md",
  variant = "royal",
  interactive = true,
}: DiyaProps) {
  const palette = VARIANT_COLORS[variant];

  const dimensions =
    size === "sm"
      ? "w-24 h-24"
      : size === "lg"
      ? "w-44 h-44 sm:w-52 sm:h-52"
      : "w-36 h-36 sm:w-40 sm:h-40";

  return (
    <motion.div
      whileHover={interactive ? { y: -6, scale: 1.04 } : undefined}
      whileTap={interactive ? { scale: 0.96 } : undefined}
      onClick={() => interactive && onToggle?.(id)}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? isLit : undefined}
      aria-label={
        interactive
          ? `${label ? label + " " : ""}Diya - ${
              isLit ? "Lit, click to toggle" : "Unlit, click to light"
            }`
          : undefined
      }
      onKeyDown={(e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onToggle?.(id);
        }
      }}
      className={`group relative flex flex-col items-center select-none ${
        interactive ? "cursor-pointer" : ""
      }`}
    >
      {/* Ambient Radial Aura When Lit */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: [0.55, 0.85, 0.65],
              scale: [0.95, 1.12, 1.0],
            }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -top-6 w-44 h-44 rounded-full bg-radial from-amber-400/45 via-orange-500/20 to-transparent blur-2xl -z-10"
          />
        )}
      </AnimatePresence>

      {/* Diya Visual Container */}
      <div className={`relative flex items-center justify-center ${dimensions}`}>
        {/* Floating Golden Sparks When Lit */}
        <AnimatePresence>
          {isLit &&
            FLOATING_SPARKS.map((spark) => (
              <motion.span
                key={spark.id}
                initial={{ opacity: 0, y: 10, x: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0.8, 0],
                  y: [-5, -45, -75],
                  x: [0, spark.xOffset * 0.6, spark.xOffset],
                  scale: [0.4, 1.15, 0.2],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: spark.duration,
                  delay: spark.delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="pointer-events-none absolute top-4 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_#FBBF24,0_0_20px_#F59E0B] z-20"
              />
            ))}
        </AnimatePresence>

        {/* SVG Handcrafted Ornate Clay Diya + Realistic Multi-Layered Flame */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible drop-shadow-[0_12px_20px_rgba(0,0,0,0.75)]"
        >
          <defs>
            {/* Bowl Gradient */}
            <linearGradient
              id={`bowlGrad-${id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={palette.bowlStart} />
              <stop offset="55%" stopColor={palette.bowlMid} />
              <stop offset="100%" stopColor={palette.bowlEnd} />
            </linearGradient>

            {/* Oil Pool Gradient */}
            <radialGradient id={`oilGrad-${id}`} cx="50%" cy="40%" r="55%">
              <stop
                offset="0%"
                stopColor={isLit ? "#FDE047" : "#451A03"}
                stopOpacity={isLit ? "0.9" : "0.8"}
              />
              <stop
                offset="60%"
                stopColor={isLit ? "#D97706" : "#270E02"}
                stopOpacity="0.95"
              />
              <stop offset="100%" stopColor="#1C0A00" />
            </radialGradient>

            {/* Outer Saffron Flame Gradient */}
            <linearGradient
              id={`flameOuter-${id}`}
              x1="50%"
              y1="100%"
              x2="50%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.2" />
            </linearGradient>

            {/* Inner Core Flame Gradient */}
            <linearGradient
              id={`flameInner-${id}`}
              x1="50%"
              y1="100%"
              x2="50%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>

            {/* Gold Trim Metallic Gradient */}
            <linearGradient
              id={`goldTrim-${id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#FFFBEB" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            {/* Flame Blur Filter */}
            <filter
              id={`flameGlow-${id}`}
              x="-60%"
              y="-60%"
              width="220%"
              height="220%"
            >
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ground Reflection Pool */}
          <ellipse
            cx="100"
            cy="176"
            rx={isLit ? "68" : "50"}
            ry="11"
            fill={isLit ? "#F59E0B" : "#000000"}
            opacity={isLit ? "0.32" : "0.5"}
            className="transition-all duration-700"
          />

          {/* Ornate Lotus Base Pedestal */}
          <path
            d="M66 162 C72 175, 128 175, 134 162 L124 152 L76 152 Z"
            fill={`url(#goldTrim-${id})`}
          />
          <ellipse
            cx="100"
            cy="163"
            rx="34"
            ry="6"
            fill="none"
            stroke={palette.accent}
            strokeWidth="1.5"
            opacity="0.7"
          />

          {/* Main Clay Bowl Body (Pointed Spout Center-Top) */}
          <path
            d="M26 105 C26 150, 65 162, 100 162 C135 162, 174 150, 174 105 C155 112, 45 112, 26 105 Z"
            fill={`url(#bowlGrad-${id})`}
            stroke={`url(#goldTrim-${id})`}
            strokeWidth="2.5"
          />

          {/* Decorative Embossed Scallops & Gold Motifs on Bowl */}
          <path
            d="M38 122 Q68 138 100 138 Q132 138 162 122"
            fill="none"
            stroke={`url(#goldTrim-${id})`}
            strokeWidth="2"
            strokeDasharray="5 4"
            opacity="0.85"
          />

          {/* Decorative Gems along the Diya Body */}
          {[56, 78, 100, 122, 144].map((cx, i) => (
            <g key={cx}>
              <circle
                cx={cx}
                cy={i === 2 ? 140 : i === 1 || i === 3 ? 137 : 131}
                r={i === 2 ? 4.5 : 3.2}
                fill={palette.gem}
                stroke="#FDE047"
                strokeWidth="1.2"
              />
            </g>
          ))}

          {/* Top Rim & Ghee/Oil Pool */}
          <ellipse
            cx="100"
            cy="105"
            rx="74"
            ry="18"
            fill={`url(#oilGrad-${id})`}
            stroke={`url(#goldTrim-${id})`}
            strokeWidth="3"
          />

          {/* Front Pointed Lip / Wick Spout */}
          <path
            d="M84 96 Q100 80 116 96 Q100 104 84 96 Z"
            fill={`url(#goldTrim-${id})`}
          />

          {/* Cotton Wick (Batti) */}
          <path
            d="M100 100 Q100 88 100 82"
            stroke={isLit ? "#FEF08A" : "#D6D3D1"}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Glowing Ember on Wick Tip */}
          <circle
            cx="100"
            cy="81"
            r="3"
            fill={isLit ? "#FFFBEB" : "#78716C"}
          />

          {/* Unlit Subtle Invite Glow / Wisp */}
          {!isLit && (
            <g className="opacity-45 group-hover:opacity-90 transition-opacity">
              <circle
                cx="100"
                cy="76"
                r="7"
                fill="#F59E0B"
                opacity="0.35"
              />
              <path
                d="M100 75 Q95 62 103 52 Q107 44 99 35"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.5"
              />
            </g>
          )}

          {/* Realistic Flickering Multi-Layered Flame When Lit */}
          {isLit && (
            <g filter={`url(#flameGlow-${id})`}>
              {/* Outer Warm Halo */}
              <motion.ellipse
                cx="100"
                cy="52"
                rx="22"
                ry="34"
                fill="#F59E0B"
                opacity="0.3"
                animate={{
                  rx: [21, 25, 20, 24, 21],
                  ry: [33, 37, 32, 36, 33],
                  opacity: [0.25, 0.42, 0.28, 0.38, 0.25],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Main Teardrop Flame */}
              <motion.path
                d="M100 14 C100 14, 122 44, 118 66 C115 79, 108 84, 100 84 C92 84, 85 79, 82 66 C78 44, 100 14, 100 14 Z"
                fill={`url(#flameOuter-${id})`}
                style={{ originX: "100px", originY: "84px" }}
                animate={{
                  scaleX: [1, 0.92, 1.06, 0.95, 1],
                  scaleY: [1, 1.08, 0.95, 1.05, 1],
                  rotate: [0, -2.5, 2.2, -1.5, 0],
                }}
                transition={{
                  duration: 1.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Inner White-Gold Hot Core */}
              <motion.path
                d="M100 34 C100 34, 111 54, 109 69 C107 78, 104 82, 100 82 C96 82, 93 78, 91 69 C89 54, 100 34, 100 34 Z"
                fill={`url(#flameInner-${id})`}
                style={{ originX: "100px", originY: "82px" }}
                animate={{
                  scaleY: [1, 1.1, 0.94, 1.04, 1],
                  rotate: [0, 1.8, -1.8, 1, 0],
                }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Diya Blessing Label & Status */}
      {(label || sanskritLabel) && (
        <div className="mt-1 flex flex-col items-center text-center">
          {sanskritLabel && (
            <span
              className={`text-xs font-serif tracking-widest transition-colors duration-500 ${
                isLit ? "text-amber-300" : "text-amber-200/45"
              }`}
            >
              {sanskritLabel}
            </span>
          )}
          {label && (
            <span
              className={`text-sm font-semibold tracking-wide transition-all duration-500 ${
                isLit
                  ? "text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                  : "text-amber-100/60 group-hover:text-amber-200"
              }`}
            >
              {label}
            </span>
          )}
          <span
            className={`mt-1 text-[11px] px-2.5 py-0.5 rounded-full border transition-all duration-300 ${
              isLit
                ? "bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                : "bg-white/5 border-white/10 text-amber-200/45 group-hover:border-amber-400/30 group-hover:text-amber-200/80"
            }`}
          >
            {isLit ? "✨ Illuminated" : "Click to Light"}
          </span>
        </div>
      )}
    </motion.div>
  );
}
