import React from "react";

export function CircuitBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-neutral-950" />
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,.18)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(90deg,rgba(16,185,129,.25)_0_2px,transparent_2px_20px),repeating-linear-gradient(0deg,rgba(16,185,129,.25)_0_2px,transparent_2px_20px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.6))]" />
    </div>
  );
}