"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Flame } from "lucide-react";
import Diya from "./Diya";
import { soundEngine } from "@/lib/sound";

interface FirecrackerProps {
  onExplosionComplete: () => void;
  allDiyasLit: boolean;
}

type CrackerPhase = "idle" | "burning" | "exploding" | "celebrating";

export default function Firecracker({
  onExplosionComplete,
  allDiyasLit,
}: FirecrackerProps) {
  const [phase, setPhase] = useState<CrackerPhase>("idle");
  const [fuseProgress, setFuseProgress] = useState(0); // 0 to 1
  const [explosionCount, setExplosionCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Store callbacks for Canvas particle triggers
  const triggerCanvasExplosionRef = useRef<(() => void) | null>(null);
  const fuseProgressRef = useRef(0);
  const phaseRef = useRef<CrackerPhase>("idle");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // High-performance Canvas for Fuse Sparks, Massive Bomb Explosion, Sky Fireworks & Golden Confetti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 800;
    };
    window.addEventListener("resize", handleResize);

    interface ExplosionParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      decay: number;
      size: number;
      gravity: number;
      drag: number;
      trail: { x: number; y: number }[];
    }

    interface ConfettiPiece {
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
      color: string;
      rotation: number;
      rotSpeed: number;
      alpha: number;
      wobble: number;
      wobbleSpeed: number;
    }

    interface ShockwaveRing {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      color: string;
      lineWidth: number;
    }

    const particles: ExplosionParticle[] = [];
    const confetti: ConfettiPiece[] = [];
    const shockwaves: ShockwaveRing[] = [];

    const fireworkColors = [
      "#FDE047", // Gold
      "#F59E0B", // Amber
      "#FF6B00", // Saffron
      "#F43F5E", // Crimson Rose
      "#A855F7", // Royal Purple
      "#38BDF8", // Celestial Blue
      "#34D399", // Emerald
      "#FFFBEB", // Hot White-Gold
    ];

    const spawnSkyFirework = (cx: number, cy: number, color: string, count = 75) => {
      shockwaves.push({
        x: cx,
        y: cy,
        radius: 4,
        maxRadius: 150 + Math.random() * 90,
        alpha: 0.9,
        color,
        lineWidth: 3,
      });

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.15;
        const speed = 2.5 + Math.random() * 8.5;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.25 ? color : "#FDE047",
          alpha: 1,
          decay: 0.008 + Math.random() * 0.01,
          size: 2 + Math.random() * 2.5,
          gravity: 0.06,
          drag: 0.978,
          trail: [],
        });
      }
    };

    triggerCanvasExplosionRef.current = () => {
      const centerX = width / 2;
      const centerY = height * 0.48;

      // 1. Primary Mega Shockwaves
      shockwaves.push(
        {
          x: centerX,
          y: centerY,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.65,
          alpha: 1,
          color: "#FDE047",
          lineWidth: 8,
        },
        {
          x: centerX,
          y: centerY,
          radius: 5,
          maxRadius: Math.max(width, height) * 0.45,
          alpha: 0.9,
          color: "#F97316",
          lineWidth: 5,
        }
      );

      // 2. Massive Core Particle Explosion (240 particles)
      for (let i = 0; i < 240; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 16;
        const color =
          fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          decay: 0.006 + Math.random() * 0.01,
          size: 2.2 + Math.random() * 3.5,
          gravity: 0.08,
          drag: 0.972,
          trail: [],
        });
      }

      // 3. Golden & Festive Confetti Shower (130 pieces)
      const confettiPalette = [
        "#FFD700",
        "#FDE047",
        "#F59E0B",
        "#FB923C",
        "#F43F5E",
        "#C084FC",
      ];
      for (let i = 0; i < 130; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
        const speed = 5 + Math.random() * 13;
        confetti.push({
          x: centerX + (Math.random() - 0.5) * 80,
          y: centerY + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          w: 7 + Math.random() * 6,
          h: 4 + Math.random() * 4,
          color:
            confettiPalette[Math.floor(Math.random() * confettiPalette.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.22,
          alpha: 1,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.08 + Math.random() * 0.08,
        });
      }

      // 4. Staggered Colorful Fireworks Launched into the Sky
      const skyBursts = [
        { delay: 180, rx: 0.22, ry: 0.25, color: "#FDE047" },
        { delay: 340, rx: 0.78, ry: 0.24, color: "#F43F5E" },
        { delay: 520, rx: 0.35, ry: 0.18, color: "#A855F7" },
        { delay: 680, rx: 0.66, ry: 0.2, color: "#38BDF8" },
        { delay: 860, rx: 0.5, ry: 0.15, color: "#FF6B00" },
        { delay: 1050, rx: 0.28, ry: 0.3, color: "#34D399" },
        { delay: 1220, rx: 0.74, ry: 0.28, color: "#F59E0B" },
      ];

      skyBursts.forEach((b) => {
        setTimeout(() => {
          spawnSkyFirework(width * b.rx, height * b.ry, b.color, 70);
        }, b.delay);
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Emit live sparks when the fuse is burning or idle
      if (phaseRef.current === "burning" || phaseRef.current === "idle") {
        const isBurning = phaseRef.current === "burning";
        const p = fuseProgressRef.current;
        // Calculate fuse tip position relative to center
        const tipX = width / 2 + (1 - p) * 28;
        const tipY = height * 0.48 - 115 + p * 38;

        const sparkRate = isBurning ? 6 : 1;
        for (let s = 0; s < sparkRate; s++) {
          if (!isBurning && Math.random() > 0.35) continue;
          const angle = Math.random() * Math.PI * 2;
          const speed = (isBurning ? 2.2 : 0.8) + Math.random() * (isBurning ? 5.5 : 1.8);
          particles.push({
            x: tipX,
            y: tipY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (isBurning ? 1.2 : 0.4),
            color: Math.random() > 0.3 ? "#FDE047" : "#FB923C",
            alpha: 1,
            decay: isBurning ? 0.035 + Math.random() * 0.03 : 0.05,
            size: isBurning ? 1.8 + Math.random() * 2 : 1.4,
            gravity: 0.08,
            drag: 0.96,
            trail: [],
          });
        }
      }

      // Render Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.11;
        sw.alpha -= 0.024;
        if (sw.alpha <= 0.01) {
          shockwaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = sw.lineWidth;
        ctx.shadowBlur = 20;
        ctx.shadowColor = sw.color;
        ctx.stroke();
        ctx.restore();
      }

      // Render Explosion & Firework Particles with Glowing Trails
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.trail.push({ x: pt.x, y: pt.y });
        if (pt.trail.length > 5) pt.trail.shift();

        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += pt.gravity;
        pt.vx *= pt.drag;
        pt.vy *= pt.drag;
        pt.alpha -= pt.decay;

        if (pt.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);

        if (pt.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(pt.trail[0].x, pt.trail[0].y);
          for (let t = 1; t < pt.trail.length; t++) {
            ctx.lineTo(pt.trail[t].x, pt.trail[t].y);
          }
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = pt.size * 0.75;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = pt.color;
        ctx.fill();
        ctx.restore();
      }

      // Render Golden Confetti
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.wobble += c.wobbleSpeed;
        c.x += c.vx + Math.sin(c.wobble) * 1.1;
        c.y += c.vy;
        c.vy += 0.11; // gravity
        c.vx *= 0.985;
        c.vy *= 0.985;
        c.rotation += c.rotSpeed;
        c.alpha -= 0.0045;

        if (c.alpha <= 0 || c.y > height + 30) {
          confetti.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.globalAlpha = Math.max(0, c.alpha);
        ctx.fillStyle = c.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#F59E0B";
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleIgnite = useCallback(() => {
    if (phase === "burning" || phase === "exploding") return;

    soundEngine.enableSoundOnInteraction();
    soundEngine.playSparkSound(1.45);
    setPhase("burning");
    setFuseProgress(0);
    fuseProgressRef.current = 0;

    const startTime = performance.now();
    const fuseDuration = 1400; // 1.4 seconds of sizzling fuse burn

    const stepFuse = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / fuseDuration);
      setFuseProgress(progress);
      fuseProgressRef.current = progress;

      if (progress < 1) {
        requestAnimationFrame(stepFuse);
      } else {
        // Trigger Explosion!
        setPhase("exploding");
        setExplosionCount((c) => c + 1);
        soundEngine.playExplosionSound();
        triggerCanvasExplosionRef.current?.();
        onExplosionComplete();

        // Transition to Happy Diwali celebration reveal while fireworks continue
        setTimeout(() => {
          setPhase("celebrating");
        }, 1250);
      }
    };

    requestAnimationFrame(stepFuse);
  }, [phase, onExplosionComplete]);

  return (
    <motion.section
      ref={sectionRef}
      id="celebration"
      animate={
        phase === "exploding"
          ? {
              x: [0, -16, 18, -14, 12, -8, 6, 0],
              y: [0, 12, -14, 10, -8, 5, -3, 0],
            }
          : { x: 0, y: 0 }
      }
      transition={{ duration: 0.65, ease: "easeInOut" }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 px-4 sm:px-8 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,#230d38_0%,#0b0418_60%,#05020a_100%)] -z-20" />

      {/* Burst of Light Flash Overlay on Explosion */}
      <AnimatePresence>
        {phase === "exploding" && (
          <motion.div
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="pointer-events-none fixed inset-0 z-40 bg-radial from-amber-100 via-amber-400/70 to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Full-Section Particle & Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-20"
      />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-xs uppercase tracking-[0.25em] mb-3"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Main Attraction • Interactive Celebration</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold font-serif bg-gradient-to-r from-amber-100 via-amber-300 to-orange-400 bg-clip-text text-transparent"
        >
          The Grand Diwali Shagun Bomb
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-sm sm:text-base text-amber-100/75"
        >
          Ignite the royal firecracker to unleash a sky full of fireworks, golden
          confetti, and automatically illuminate every diya across the night!
        </motion.p>
      </div>

      {/* Central Interactive Stage */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-[420px] w-full max-w-3xl">
        {/* Glowing "BOOM!" Text Animation */}
        <AnimatePresence>
          {phase === "exploding" && (
            <motion.div
              key="boom-text"
              initial={{ scale: 0.2, opacity: 0, rotate: -10 }}
              animate={{
                scale: [0.3, 1.35, 1.1],
                opacity: [0, 1, 1, 0],
                rotate: [-8, 5, -2, 0],
              }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.15, ease: "easeOut" }}
              className="pointer-events-none absolute z-40 flex flex-col items-center"
            >
              <span className="text-7xl sm:text-9xl font-black tracking-wider italic bg-gradient-to-b from-white via-amber-300 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(251,191,36,0.95)]">
                BOOM!
              </span>
              <span className="mt-2 text-lg sm:text-2xl font-bold tracking-[0.3em] uppercase text-amber-200 drop-shadow-[0_0_20px_#F59E0B]">
                ✨ ધમાકા • শুভ দীপাবলি • शुभ दीपावली ✨
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post-Explosion "Happy Diwali! 🪔" Message + Replayable Firecracker */}
        <AnimatePresence mode="wait">
          {phase === "celebrating" ? (
            <motion.div
              key="happy-diwali-card"
              initial={{ opacity: 0, scale: 0.82, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.65, type: "spring", bounce: 0.35 }}
              className="relative flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#1d0b33]/90 via-[#120624]/95 to-[#090314]/95 backdrop-blur-xl border-2 border-amber-400/50 shadow-[0_0_70px_rgba(245,158,11,0.35)] max-w-xl w-full"
            >
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="text-4xl sm:text-6xl font-extrabold font-serif bg-gradient-to-r from-amber-100 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]"
              >
                Happy Diwali! 🪔
              </motion.div>

              <p className="mt-3 text-amber-100/85 text-sm sm:text-base max-w-md leading-relaxed">
                All ceremonial diyas across the celebration have been
                illuminated by your spark! May your year ahead sparkle just as
                brightly.
              </p>

              {/* Flanking Illuminated Diyas inside Celebration Reveal */}
              <div className="flex items-center justify-center gap-6 my-4">
                <Diya
                  id={201}
                  isLit={true}
                  size="sm"
                  variant="saffron"
                  interactive={false}
                />
                <Diya
                  id={202}
                  isLit={true}
                  size="sm"
                  variant="crimson"
                  interactive={false}
                />
                <Diya
                  id={203}
                  isLit={true}
                  size="sm"
                  variant="royal"
                  interactive={false}
                />
              </div>

              {/* Re-trigger Firecracker Button */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPhase("idle");
                    setFuseProgress(0);
                    fuseProgressRef.current = 0;
                  }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 shadow-[0_0_30px_rgba(245,158,11,0.6)] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>LIGHT ANOTHER BOMB 🧨</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleIgnite}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-amber-200 bg-amber-500/15 border border-amber-400/50 hover:bg-amber-500/25 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Instant Detonate Again!</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Interactive Traditional Diwali Bomb with Glowing Fuse */
            <motion.div
              key="firecracker-bomb"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: phase === "exploding" ? 0 : 1,
                scale:
                  phase === "exploding"
                    ? 1.55
                    : phase === "burning"
                    ? [1, 1.04, 0.98, 1.06, 1]
                    : 1,
              }}
              transition={{
                duration: phase === "burning" ? 0.3 : 0.4,
                repeat: phase === "burning" ? Infinity : 0,
              }}
              className="flex flex-col items-center"
            >
              {/* Clickable Firecracker SVG */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleIgnite}
                aria-label="Click the bomb to celebrate Diwali"
                className="group relative flex flex-col items-center justify-center focus:outline-none cursor-pointer"
              >
                {/* Pulsing Aura Behind the Bomb */}
                <motion.div
                  animate={{
                    scale: phase === "burning" ? [1, 1.35, 1] : [1, 1.12, 1],
                    opacity:
                      phase === "burning" ? [0.6, 0.95, 0.6] : [0.35, 0.6, 0.35],
                  }}
                  transition={{
                    duration: phase === "burning" ? 0.4 : 2.2,
                    repeat: Infinity,
                  }}
                  className="pointer-events-none absolute w-72 h-72 rounded-full bg-radial from-amber-500/45 via-red-600/20 to-transparent blur-2xl -z-10"
                />

                <svg
                  viewBox="0 0 280 320"
                  className="w-64 h-72 sm:w-72 sm:h-80 overflow-visible drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
                >
                  <defs>
                    {/* Royal Crimson & Gold Foil Body Gradient */}
                    <linearGradient
                      id="crackerBodyGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="35%" stopColor="#B91C1C" />
                      <stop offset="75%" stopColor="#7F1D1D" />
                      <stop offset="100%" stopColor="#450A0A" />
                    </linearGradient>

                    {/* Braided Sutli Gold Band Gradient */}
                    <linearGradient
                      id="goldBandGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#92400E" />
                      <stop offset="30%" stopColor="#FDE047" />
                      <stop offset="50%" stopColor="#FFFBEB" />
                      <stop offset="70%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#78350F" />
                    </linearGradient>
                  </defs>

                  {/* Shadow Beneath Bomb */}
                  <ellipse
                    cx="140"
                    cy="290"
                    rx="72"
                    ry="14"
                    fill="#000000"
                    opacity="0.6"
                  />

                  {/* Animated Fuse Cord */}
                  {(() => {
                    // Interpolate fuse tip as it burns down from top (168,38) to neck (140,95)
                    const tipX = 168 - fuseProgress * 28;
                    const tipY = 38 + fuseProgress * 57;
                    const ctrlX = 140 + (1 - fuseProgress) * 24;
                    const ctrlY = 50 + fuseProgress * 25;

                    return (
                      <g>
                        {/* Fuse Rope */}
                        <path
                          d={`M 140 98 Q ${ctrlX} ${ctrlY} ${tipX} ${tipY}`}
                          fill="none"
                          stroke="#D6D3D1"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                        <path
                          d={`M 140 98 Q ${ctrlX} ${ctrlY} ${tipX} ${tipY}`}
                          fill="none"
                          stroke="#78350F"
                          strokeWidth="6"
                          strokeDasharray="4 5"
                          strokeLinecap="round"
                        />

                        {/* Glowing Burning Tip of the Fuse */}
                        <circle
                          cx={tipX}
                          cy={tipY}
                          r={phase === "burning" ? "16" : "11"}
                          fill="#F59E0B"
                          opacity="0.45"
                        />
                        <circle
                          cx={tipX}
                          cy={tipY}
                          r={phase === "burning" ? "9" : "6"}
                          fill="#FDE047"
                        />
                        <circle
                          cx={tipX}
                          cy={tipY}
                          r="4"
                          fill="#FFFFFF"
                        />

                        {/* Animated SVG Spark Rays at Fuse Tip */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                          const rad = (deg * Math.PI) / 180;
                          const len = phase === "burning" ? 22 : 13;
                          const x2 = Number((tipX + Math.cos(rad) * len).toFixed(3));
                          const y2 = Number((tipY + Math.sin(rad) * len).toFixed(3));
                          return (
                            <line
                              key={deg}
                              x1={Number(tipX.toFixed(3))}
                              y1={Number(tipY.toFixed(3))}
                              x2={x2}
                              y2={y2}
                              stroke="#FDE047"
                              strokeWidth={phase === "burning" ? "2.5" : "1.5"}
                              strokeLinecap="round"
                            />
                          );
                        })}
                      </g>
                    );
                  })()}

                  {/* Top Brass Nozzle / Neck Cap */}
                  <rect
                    x="118"
                    y="94"
                    width="44"
                    height="16"
                    rx="5"
                    fill="url(#goldBandGrad)"
                    stroke="#FDE047"
                    strokeWidth="1.5"
                  />

                  {/* Main Conical / Spherical Royal Bomb Body */}
                  <path
                    d="M112 108 L168 108 C202 145, 212 215, 188 265 C178 282, 102 282, 92 265 C68 215, 78 145, 112 108 Z"
                    fill="url(#crackerBodyGrad)"
                    stroke="url(#goldBandGrad)"
                    strokeWidth="3.5"
                  />

                  {/* Criss-Cross Braided Sutli / Golden Cord Texture */}
                  <path
                    d="M92 145 L188 235 M188 145 L92 235 M85 185 L195 185 M95 245 L185 245"
                    stroke="url(#goldBandGrad)"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    opacity="0.65"
                  />

                  {/* Top & Bottom Ornamental Gold Foil Bands */}
                  <path
                    d="M95 135 Q140 148 185 135"
                    fill="none"
                    stroke="url(#goldBandGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M90 250 Q140 264 190 250"
                    fill="none"
                    stroke="url(#goldBandGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Center Royal Mandala Medallion Emblem on Bomb */}
                  <circle
                    cx="140"
                    cy="194"
                    r="34"
                    fill="#450A0A"
                    stroke="url(#goldBandGrad)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="140"
                    cy="194"
                    r="26"
                    fill="none"
                    stroke="#FDE047"
                    strokeWidth="1.2"
                    strokeDasharray="4 3"
                  />
                  {/* 8-Pointed Star inside Emblem */}
                  <polygon
                    points="140,168 147,185 165,185 151,196 156,214 140,203 124,214 129,196 115,185 133,185"
                    fill="url(#goldBandGrad)"
                  />
                  <circle cx="140" cy="194" r="6" fill="#EF4444" />
                </svg>
              </motion.button>

              {/* Required Prompt Text: "Click the bomb to celebrate!" */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                onClick={handleIgnite}
                className="mt-3 flex flex-col items-center cursor-pointer"
              >
                <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-amber-500/25 border border-amber-400/60 text-amber-100 font-bold text-base sm:text-lg tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:border-amber-300 transition-all">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                  <span>
                    {phase === "burning"
                      ? "Fuse Burning... Stand Back! 🔥"
                      : "Click the bomb to celebrate!"}
                  </span>
                </span>
                {explosionCount > 0 && (
                  <span className="mt-2 text-xs text-amber-300/70">
                    Celebrated {explosionCount}{" "}
                    {explosionCount === 1 ? "time" : "times"} •{" "}
                    {allDiyasLit ? "All Diyas Lit 🪔" : "Click to light all diyas"}
                  </span>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
