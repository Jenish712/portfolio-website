import { Cpu as CpuIcon, Gauge, Waves, Shield, Cloud, Radio } from "lucide-react";

export const HIGHLIGHTS = [
  { icon: CpuIcon, label: "Low‑level bring‑up", text: "Clock, GPIO, timers, NVIC, ISR design." },
  { icon: Gauge, label: "Real‑time control", text: "PWM, capture/compare, current/voltage loops." },
  { icon: Waves, label: "Signals & power", text: "Filtering, rectification, trip thresholds." },
  { icon: Shield, label: "Safety systems", text: "Brown‑out, overload, surge, fault trees." },
  { icon: Cloud, label: "Cloud‑connected", text: "MQTT, REST, telemetry, OTA pipelines." },
  { icon: Radio, label: "Protocols", text: "UART, SPI, I2C, CAN, RS‑485." },
];

export const PUBLICATIONS = [
  {
    title:
      "Dynamic Overload Surge Adjustment Protection (DOSAP) with Triple‑Tiered Tripping",
    venue: "ISCAS 2025",
    link: "#",
  },
];

export const CTA = {
  availability: "Open to embedded firmware roles and consulting.",
  note: "I build reliable firmware that survives the field.",
};