"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Rocket, Palette } from "lucide-react";
import { soundEngine } from "@/lib/sound";

type ColorFilter = "all" | "gold" | "orange" | "red" | "purple" | "blue";

const COLOR_MAP: Record<Exclude<ColorFilter, "all">, string[]> = {
  gold: ["#FDE047", "#FACC15", "#FEF08A", "#F59E0B"],
  orange: ["#FF6B00", "#FB923C", "#F97316", "#FDBA74"],
  red: ["#F43F5E", "#EF4444", "#FB7185", "#FDA4AF"],
  purple: ["#A855F7", "#C084FC", "#D946EF", "#E879F9"],
  blue: ["#38BDF8", "#60A5FA", "#22D3EE", "#818CF8"],
};

const ALL_PALETTES = Object.values(COLOR_MAP).flat();

type BurstPattern = "chrysanthemum" | "ring" | "double" | "willow" | "star";

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorFilter>("all");
  const [burstCount, setBurstCount] = useState(0);
  const selectedColorRef = useRef<ColorFilter>("all");

  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  const launchSalvoRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.clientHeight || 680);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth || window.innerWidth;
      height = canvas.height = canvas.clientHeight || 680;
    };
    window.addEventListener("resize", handleResize);

    interface AscendingRocket {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      color: string;
      pattern: BurstPattern;
      trail: { x: number; y: number }[];
    }

    interface SkyParticle {
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
      twinkle: boolean;
      trail: { x: number; y: number }[];
    }

    const rockets: AscendingRocket[] = [];
    const particles: SkyParticle[] = [];
    const patterns: BurstPattern[] = [
      "chrysanthemum",
      "ring",
      "double",
      "willow",
      "star",
    ];

    const pickColor = (): string => {
      const filter = selectedColorRef.current;
      if (filter === "all") {
        return ALL_PALETTES[Math.floor(Math.random() * ALL_PALETTES.length)];
      }
      const list = COLOR_MAP[filter];
      return list[Math.floor(Math.random() * list.length)];
    };

    const explodeRocket = (
      x: number,
      y: number,
      primaryColor: string,
      pattern: BurstPattern
    ) => {
      soundEngine.playFireworkBurst(0.85);
      setBurstCount((c) => c + 1);

      const secondaryColor =
        ALL_PALETTES[Math.floor(Math.random() * ALL_PALETTES.length)];

      if (pattern === "ring") {
        const count = 64;
        const speed = 5.5 + Math.random() * 2.5;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: i % 2 === 0 ? primaryColor : "#FDE047",
            alpha: 1,
            decay: 0.011 + Math.random() * 0.006,
            size: 2.3,
            gravity: 0.04,
            drag: 0.98,
            twinkle: true,
            trail: [],
          });
        }
      } else if (pattern === "double") {
        // Outer shell + inner core shell
        for (let i = 0; i < 65; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 5 + Math.random() * 4.5;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: primaryColor,
            alpha: 1,
            decay: 0.01 + Math.random() * 0.008,
            size: 2.2,
            gravity: 0.055,
            drag: 0.978,
            twinkle: false,
            trail: [],
          });
        }
        for (let i = 0; i < 40; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 2.8;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: secondaryColor,
            alpha: 1,
            decay: 0.012 + Math.random() * 0.008,
            size: 2.5,
            gravity: 0.04,
            drag: 0.982,
            twinkle: true,
            trail: [],
          });
        }
      } else if (pattern === "willow") {
        // Long-hanging golden/colored weeping willow trails
        for (let i = 0; i < 85; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 6.5;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: Math.random() > 0.3 ? primaryColor : "#FDE047",
            alpha: 1,
            decay: 0.006 + Math.random() * 0.006,
            size: 2.0,
            gravity: 0.095,
            drag: 0.975,
            twinkle: true,
            trail: [],
          });
        }
      } else if (pattern === "star") {
        // 8-pointed star geometry burst
        const points = 8;
        const total = 88;
        for (let i = 0; i < total; i++) {
          const angle = (Math.PI * 2 * i) / total;
          const starMod = 0.55 + 0.45 * Math.cos(angle * points);
          const speed = (3.5 + Math.random() * 5.5) * starMod;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: i % 3 === 0 ? "#FFFBEB" : primaryColor,
            alpha: 1,
            decay: 0.01 + Math.random() * 0.008,
            size: 2.2,
            gravity: 0.05,
            drag: 0.98,
            twinkle: false,
            trail: [],
          });
        }
      } else {
        // Classic spherical chrysanthemum
        for (let i = 0; i < 95; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 8;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: Math.random() > 0.2 ? primaryColor : secondaryColor,
            alpha: 1,
            decay: 0.009 + Math.random() * 0.009,
            size: 1.8 + Math.random() * 1.8,
            gravity: 0.06,
            drag: 0.978,
            twinkle: Math.random() > 0.5,
            trail: [],
          });
        }
      }
    };

    const launchRocketTo = (targetX: number, targetY: number) => {
      const startX = width * (0.2 + Math.random() * 0.6);
      const startY = height - 20;
      const dx = targetX - startX;
      const dy = targetY - startY;
      const frames = 26 + Math.random() * 10;

      rockets.push({
        x: startX,
        y: startY,
        targetX,
        targetY,
        vx: dx / frames,
        vy: dy / frames,
        color: pickColor(),
        pattern: patterns[Math.floor(Math.random() * patterns.length)],
        trail: [],
      });
    };

    launchSalvoRef.current = () => {
      soundEngine.enableSoundOnInteraction();
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const tx = width * (0.12 + (i / 7) * 0.76);
          const ty = height * (0.15 + Math.random() * 0.38);
          launchRocketTo(tx, ty);
        }, i * 140);
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX: number;
      let clientY: number;

      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      soundEngine.enableSoundOnInteraction();
      launchRocketTo(x, Math.min(y, height * 0.78));
    };

    canvas.addEventListener("mousedown", handlePointerDown);
    canvas.addEventListener("touchstart", handlePointerDown, { passive: true });

    // Continuous subtle background fireworks
    let frameCount = 0;
    launchRocketTo(width * 0.35, height * 0.28);
    setTimeout(() => launchRocketTo(width * 0.68, height * 0.24), 450);

    const render = () => {
      // Smooth night sky motion trail fade
      ctx.fillStyle = "rgba(7, 3, 18, 0.24)";
      ctx.fillRect(0, 0, width, height);

      frameCount++;
      if (frameCount % 95 === 0) {
        const rx = width * (0.15 + Math.random() * 0.7);
        const ry = height * (0.14 + Math.random() * 0.42);
        launchRocketTo(rx, ry);
      }

      // Update & draw ascending rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 8) r.trail.shift();

        r.x += r.vx;
        r.y += r.vy;

        const dist = Math.hypot(r.targetX - r.x, r.targetY - r.y);
        if (dist < 14 || r.y <= r.targetY) {
          explodeRocket(r.x, r.y, r.color, r.pattern);
          rockets.splice(i, 1);
          continue;
        }

        ctx.save();
        if (r.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(r.trail[0].x, r.trail[0].y);
          for (let t = 1; t < r.trail.length; t++) {
            ctx.lineTo(r.trail[t].x, r.trail[t].y);
          }
          ctx.strokeStyle = "#FDE047";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFBEB";
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.fill();
        ctx.restore();
      }

      // Update & draw firework explosion particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const flicker =
          p.twinkle && Math.random() > 0.72 ? p.alpha * 0.35 : p.alpha;

        ctx.save();
        ctx.globalAlpha = Math.max(0, flicker);

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.75;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handlePointerDown);
      canvas.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  const colorButtons: { id: ColorFilter; label: string; dot: string }[] = [
    {
      id: "all",
      label: "All Festive",
      dot: "bg-gradient-to-r from-amber-300 via-pink-500 to-sky-400",
    },
    { id: "gold", label: "Gold", dot: "bg-yellow-400" },
    { id: "orange", label: "Orange", dot: "bg-orange-500" },
    { id: "red", label: "Red", dot: "bg-rose-500" },
    { id: "purple", label: "Purple", dot: "bg-purple-500" },
    { id: "blue", label: "Blue", dot: "bg-sky-400" },
  ];

  return (
    <section
      id="fireworks"
      className="relative min-h-screen w-full flex flex-col items-center justify-between py-20 px-4 sm:px-8 overflow-hidden"
    >
      {/* Top Header & Interactive Controls */}
      <div className="relative z-20 max-w-5xl w-full mx-auto flex flex-col items-center text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-xs uppercase tracking-[0.25em] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Night Sky • {burstCount} Aerial Bursts</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold font-serif bg-gradient-to-r from-amber-100 via-amber-300 to-orange-400 bg-clip-text text-transparent"
        >
          Royal Fireworks Playground
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
          className="mt-2 max-w-xl text-sm sm:text-base text-amber-100/80"
        >
          Click or tap anywhere in the night sky to launch custom rockets!
          Choose your favorite color palette or unleash a synchronized Grand
          Finale salvo.
        </motion.p>

        {/* Interactive Toolbar (Pointer Events Auto) */}
        <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2.5 rounded-2xl bg-[#0e0520]/85 backdrop-blur-xl border border-amber-400/30 shadow-[0_10px_35px_rgba(0,0,0,0.7)]">
          <div className="flex items-center gap-1.5 px-2 text-xs text-amber-300/80">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Color:</span>
          </div>

          {colorButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedColor(btn.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                selectedColor === btn.id
                  ? "bg-amber-500/25 border-amber-300 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                  : "bg-white/5 border-white/10 text-amber-100/70 hover:text-amber-100"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${btn.dot}`} />
              <span>{btn.label}</span>
            </button>
          ))}

          <button
            onClick={() => launchSalvoRef.current?.()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer ml-1"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Grand Salvo 🚀</span>
          </button>
        </div>
      </div>

      {/* Interactive Sky Canvas */}
      <div className="relative w-full max-w-7xl h-[520px] sm:h-[600px] my-6 rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-[#070312]">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair block"
        />

        {/* Instruction Watermark Pill Inside Sky */}
        <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-amber-400/25 text-amber-200/80 text-xs">
          ✨ Click or tap anywhere in the sky to launch fireworks ✨
        </div>

        {/* Silhouetted Indian Palace Skyline & Domes along the Bottom Horizon */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 flex items-end justify-center opacity-90">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-16 sm:h-24 fill-[#05020c] stroke-amber-500/30"
          >
            <path
              d="M0,120 L0,95 L60,95 L60,75 L90,55 L120,75 L120,95 L200,95 L200,65 Q240,25 280,65 L280,95 L380,95 L380,80 L410,60 L440,80 L440,95 L560,95 L560,55 Q620,5 680,55 L680,95 L720,40 L760,95 L880,95 L880,60 Q930,15 980,60 L980,95 L1100,95 L1100,75 L1130,50 L1160,75 L1160,95 L1260,95 L1260,70 Q1300,35 1340,70 L1340,95 L1440,95 L1440,120 Z"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
