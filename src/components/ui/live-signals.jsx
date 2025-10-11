import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Play, Square, Sliders } from "lucide-react";
import { LedBus } from "./led";

function generateWavePath(
  width = 560,
  height = 140,
  cycles = 2.0,
  amp = 1.0,
  phase = 0
) {
  const points = 400;
  const mid = height / 2;
  const amplitude = (height / 2.6) * amp;
  let d = `M 0 ${mid.toFixed(2)}`;
  for (let i = 1; i <= points; i++) {
    const t = i / points;
    const x = t * width;
    const y = mid + Math.sin(t * cycles * Math.PI * 2 + phase) * amplitude;
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

function Grid({ width = 560, height = 140 }) {
  const columns = 8;
  const rows = 4;
  const colGap = width / columns;
  const rowGap = height / rows;
  const lines = [];
  for (let c = 1; c < columns; c++) lines.push({ x1: c * colGap, y1: 0, x2: c * colGap, y2: height });
  for (let r = 1; r < rows; r++) lines.push({ x1: 0, y1: r * rowGap, x2: width, y2: r * rowGap });
  return (
    <g>
      {lines.map((l, i) => (
        <line key={i} {...l} stroke="rgba(16,185,129,0.18)" strokeWidth="1" />
      ))}
      <rect x="0" y={height / 2} width={width} height="1" fill="rgba(16,185,129,0.25)" />
    </g>
  );
}

export function LiveSignals() {
  const [running, setRunning] = useState(true);
  const [cycles, setCycles] = useState(2.5);
  const [amp, setAmp] = useState(0.9);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!running) return;
    let raf;
    const loop = () => {
      setPhase((p) => (p + 0.06) % (Math.PI * 2));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const width = 560;
  const height = 140;
  const path = generateWavePath(width, height, cycles, amp, phase);

  return (
    <Card className="border dark:border-emerald-800/40 bg-card dark:bg-neutral-900/40">
      <CardHeader className="flex flex-col gap-2 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base">Live Signals</CardTitle>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md border border-emerald-300/40 dark:border-emerald-800/40 px-2 py-1 text-emerald-600/90 dark:text-emerald-300/90 bg-emerald-500/5 dark:bg-transparent">
              {running ? "RUN" : "STOP"}
            </span>
            <span className="rounded-md border border-emerald-300/30 dark:border-emerald-800/40 px-2 py-1">{cycles.toFixed(1)} Hz</span>
            <span className="rounded-md border border-emerald-300/30 dark:border-emerald-800/40 px-2 py-1">Amp {Math.round(amp * 100)}%</span>
          </div>
          {/* Mobile status */}
          <div className="sm:hidden text-xs text-emerald-300/90">
            {running ? "RUN" : "STOP"}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">{/* Mobile-first controls */}
          <Button
            size="sm"
            onClick={() => setRunning((v) => !v)}
            className={`h-7 px-3 ${running ? "bg-emerald-600 hover:bg-emerald-500" : "bg-background border hover:bg-accent"}`}
          >
            {running ? (
              <>
                <Square className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Stop</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Run</span>
              </>
            )}
          </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-muted-foreground">
            <Sliders className="h-3.5 w-3.5 hidden sm:block" />
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex items-center gap-2 text-xs">
                Freq
                <input
                  type="range"
                  min="0.5"
                  max="6"
                  step="0.1"
                  value={cycles}
                  onChange={(e) => setCycles(parseFloat(e.target.value))}
                  className="accent-emerald-500 w-16 sm:w-20"
                />
              </label>
              <label className="flex items-center gap-2 text-xs">
                Amp
                <input
                  type="range"
                  min="0.3"
                  max="1.2"
                  step="0.05"
                  value={amp}
                  onChange={(e) => setAmp(parseFloat(e.target.value))}
                  className="accent-emerald-500 w-16 sm:w-20"
                />
              </label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-3 sm:p-6">
        <div className="rounded-2xl border dark:border-emerald-800/40 bg-card dark:bg-neutral-950/40 p-2 sm:p-3 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,.08),transparent_60%)]" />
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[120px] sm:h-[160px]">
            <Grid width={width} height={height} />
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d={path}
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ opacity: 0.8 }}
              animate={running ? { pathLength: [0.7, 1, 0.7] } : { pathLength: 1 }}
              transition={{ duration: 2.4, repeat: running ? Infinity : 0 }}
              style={{ strokeDasharray: "6 8" }}
            />
          </svg>
          <div className="absolute bottom-2 left-2 sm:left-3">
            <LedBus running={running} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
