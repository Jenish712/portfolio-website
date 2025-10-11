import React from "react";

export const Section = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="scroll-mt-24 py-12">
    <div className="flex items-center gap-2 mb-6">
      {Icon ? <Icon className="h-5 w-5 text-emerald-400" /> : null}
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

export const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
    {children}
  </span>
);