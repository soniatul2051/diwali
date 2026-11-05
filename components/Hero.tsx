"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import Diya from "./Diya";
import { soundEngine } from "@/lib/sound";

interface HeroProps {
  allDiyasLit: boolean;
}

const HANGING_LANTERNS = [
  { id: 1, left: "7%", height: 120, color: "#F59E0B", delay: 0 },
  { id: 2, left: "18%", height: 85, color: "#EC4899", delay: 0.6 },
  { id: 3, left: "82%", height: 95, color: "#F97316", delay: 0.3 },
  { id: 4, left: "92%", height: 135, color: "#EAB308", delay: 0.9 },
];

const STARS = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  top: `${(i * 19 + 7) % 78}%`,
  left: `${(i * 31 + 11) % 96}%`,
  size: (i % 3) + 1.5,
  delay: (i % 7) * 0.45,
  duration: 2.2 + (i % 4) * 0.7,
}));

export default function Hero({ allDiyasLit }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ambient Hero Fireworks & Floating Golden Dust Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    interface GoldDust {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulseSpeed: number;
      phase: number;
    }

    interface HeroBurstParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      decay: number;
      size: number;
    }

    const dustParticles: GoldDust[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.25 - Math.random() * 0.55,
      radius: 1 + Math.random() * 2.2,
      alpha: 0.2 + Math.random() * 0.65,
      pulseSpeed: 0.015 + Math.random() * 0.025,
      phase: Math.random() * Math.PI * 2,
    }));

    const burstParticles: HeroBurstParticle[] = [];
    const palette = [
      "#FDE047",
      "#F59E0B",
      "#FB923C",
      "#F43F5E",
      "#C084FC",
      "#38BDF8",
    ];

    const spawnAmbientFirework = () => {
      if (prefersReducedMotion) return;
      const cx = width * (0.12 + Math.random() * 0.76);
      const cy = height * (0.14 + Math.random() * 0.42);
      const color = palette[Math.floor(Math.random() * palette.length)];
      const count = 42;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.1;
        const speed = 1.2 + Math.random() * 3.4;
        burstParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.012,
          size: 1.6 + Math.random() * 1.6,
        });
      }
    };

    // Initial fireworks
    let tick = 0;
    spawnAmbientFirework();

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      if (!prefersReducedMotion && tick % 110 === 0) {
        spawnAmbientFirework();
      }

      // Draw floating golden dust
      for (const p of dustParticles) {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += p.pulseSpeed;
          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }
        const currentAlpha =
          p.alpha * (0.6 + 0.4 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${currentAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#F59E0B";
        ctx.fill();
      }

      // Draw background firework bursts
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vy += 0.032; // gravity
        bp.vx *= 0.985;
        bp.vy *= 0.985;
        bp.alpha -= bp.decay;

        if (bp.alpha <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, bp.alpha);
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2);
        ctx.fillStyle = bp.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = bp.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleStartCelebration = () => {
    soundEngine.enableSoundOnInteraction();
    soundEngine.playDiyaChime(2);
    const el = document.getElementById("celebration");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden pt-24 pb-12 px-4 sm:px-8"
    >
      {/* Multi-layered Night Sky & Royal Mandala Backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e0b36_0%,#0c051a_52%,#05020a_100%)] -z-30" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] rounded-full bg-radial from-amber-500/12 via-orange-600/5 to-transparent blur-3xl -z-20" />

      {/* Festive Marigold Toran Garland at the Very Top */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 flex justify-around overflow-hidden opacity-90 -z-10">
        {Array.from({ length: 8 }).map((_, idx) => (
          <svg
            key={idx}
            viewBox="0 0 200 70"
            className="w-48 sm:w-64 h-auto shrink-0"
          >
            <path
              d="M 0 0 Q 100 68 200 0"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="5"
              strokeDasharray="8 6"
            />
            {[25, 60, 100, 140, 175].map((cx, i) => (
              <g key={cx}>
                <circle
                  cx={cx}
                  cy={i === 2 ? 34 : i === 1 || i === 3 ? 26 : 13}
                  r="8"
                  fill={i % 2 === 0 ? "#F97316" : "#FACC15"}
                />
                <circle
                  cx={cx}
                  cy={i === 2 ? 34 : i === 1 || i === 3 ? 26 : 13}
                  r="4"
                  fill="#DC2626"
                />
              </g>
            ))}
          </svg>
        ))}
      </div>

      {/* Twinkling Night Stars */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        {STARS.map((star) => (
          <motion.span
            key={star.id}
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 0.95, 0.25],
              scale: [0.85, 1.3, 0.85],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-amber-200 shadow-[0_0_8px_#FDE047]"
          />
        ))}
      </div>

      {/* Canvas for Background Fireworks & Floating Golden Particles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full -z-10"
      />

      {/* Glowing Hanging Diwali Lanterns (Akash Kandil) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden -z-10">
        {HANGING_LANTERNS.map((lantern) => (
          <motion.div
            key={lantern.id}
            style={{ left: lantern.left }}
            animate={{ rotate: [-3.5, 3.5, -3.5] }}
            transition={{
              duration: 4.5,
              delay: lantern.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 origin-top flex flex-col items-center"
          >
            {/* Golden Hanging Cord */}
            <div
              style={{ height: lantern.height }}
              className="w-0.5 bg-gradient-to-b from-amber-500/80 to-amber-300"
            />
            {/* Ornate Kandil Lantern Body */}
            <div className="relative flex flex-col items-center">
              <div
                style={{
                  boxShadow: `0 0 35px ${lantern.color}88, 0 0 70px ${lantern.color}44`,
                }}
                className="w-11 sm:w-14 h-14 sm:h-18 rounded-2xl bg-gradient-to-b from-amber-300 via-orange-500 to-rose-700 border-2 border-amber-200/80 flex items-center justify-center relative overflow-hidden"
              >
                <div className="w-5 h-8 rounded-full bg-yellow-100/90 blur-[2px] animate-pulse" />
                <div className="absolute inset-x-0 top-2 h-0.5 bg-amber-200/60" />
                <div className="absolute inset-x-0 bottom-2 h-0.5 bg-amber-200/60" />
              </div>
              {/* Flowing Tassels */}
              <div className="flex gap-1 -mt-0.5">
                <span className="w-0.5 h-6 bg-amber-400/80 rounded-full" />
                <span className="w-0.5 h-8 bg-orange-400/90 rounded-full" />
                <span className="w-0.5 h-6 bg-amber-400/80 rounded-full" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Center Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto pt-12 pb-6">
        {/* Auspicious Sanskrit Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs sm:text-sm tracking-[0.2em] uppercase mb-6 shadow-[0_0_25px_rgba(245,158,11,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>तमसो मा ज्योतिर्गमय • Festival of Lights</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </motion.div>

        {/* Main Heading: "✨ शुभ दीपावली ✨" */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight py-2 px-4 bg-gradient-to-b from-amber-100 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.55)]"
        >
          ✨ शुभ दीपावली ✨
        </motion.h1>

        {/* Ornamental Golden Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex items-center gap-3 my-5"
        >
          <span className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="w-2.5 h-2.5 rotate-45 bg-amber-400 shadow-[0_0_12px_#FBBF24]" />
          <span className="text-amber-300 text-xs tracking-[0.3em] uppercase font-serif">
            Shubh Deepavali
          </span>
          <span className="w-2.5 h-2.5 rotate-45 bg-amber-400 shadow-[0_0_12px_#FBBF24]" />
          <span className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-amber-400" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="max-w-2xl text-base sm:text-xl md:text-2xl text-amber-100/85 font-light leading-relaxed px-2"
        >
          May the light of Diwali illuminate your life with happiness,
          prosperity and endless possibilities.
        </motion.p>

        {/* Prominent Interactive CTA Button: "START THE CELEBRATION 🎆" */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 0 45px rgba(245, 158, 11, 0.75), 0 0 90px rgba(234, 88, 12, 0.45)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={handleStartCelebration}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-sm sm:text-base md:text-lg tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 border-2 border-amber-100/80 shadow-[0_0_35px_rgba(245,158,11,0.55)] cursor-pointer overflow-hidden"
          >
            {/* Shimmer sweep */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
            <span className="relative z-10">START THE CELEBRATION 🎆</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Glowing Diyas Flanking the Hero Base */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex items-end justify-between px-2 sm:px-8 mt-4">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden sm:block"
        >
          <Diya
            id={101}
            isLit={true}
            size="sm"
            variant="saffron"
            interactive={false}
          />
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 3.0,
            delay: 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Diya
            id={102}
            isLit={true}
            size="sm"
            variant="royal"
            interactive={false}
          />
        </motion.div>

        {/* Scroll Down Cue */}
        <button
          onClick={handleStartCelebration}
          aria-label="Scroll down to firecracker celebration"
          className="flex flex-col items-center gap-1.5 text-amber-300/70 hover:text-amber-200 transition-colors cursor-pointer pb-2"
        >
          <span className="text-[11px] uppercase tracking-[0.25em]">
            Explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-amber-400" />
          </motion.div>
        </button>

        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{
            duration: 3.2,
            delay: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Diya
            id={103}
            isLit={allDiyasLit || true}
            size="sm"
            variant="crimson"
            interactive={false}
          />
        </motion.div>

        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{
            duration: 3.7,
            delay: 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden sm:block"
        >
          <Diya
            id={104}
            isLit={true}
            size="sm"
            variant="emerald"
            interactive={false}
          />
        </motion.div>
      </div>
    </section>
  );
}
