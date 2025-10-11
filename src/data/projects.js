// Helper function to create URL-friendly slugs
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const PROJECTS = [
  {
    title: "SinglePhase Servo Stabilizer Firmware",
    slug: slugify("SinglePhase Servo Stabilizer Firmware"),
    category: "Embedded Systems",
    description:
      "Production firmware with multitier protection, EEPROM logs, frequency capture on TCB1, motor control, and LCD UI. 1,500+ field installs.",
    longDescription: `A comprehensive firmware solution for single-phase servo stabilizers built on the ATmega1608 microcontroller using PlatformIO. This production-ready system includes sophisticated protection mechanisms, data logging capabilities, and an intuitive user interface.

The firmware implements multiple protection tiers including brown-out detection, overload protection with KVA envelope analysis, and surge event monitoring. All protection events are logged with timestamps to EEPROM using wear-leveling algorithms to ensure data integrity and extend memory life.

The frequency capture system utilizes TCB1 in event mode with interrupt-driven debouncing for precise measurement. The motor control system provides smooth voltage regulation while the LCD interface offers real-time status updates and configuration options.`,
    summary:
      "Production firmware with multitier protection, EEPROM logs, frequency capture on TCB1, motor control, and LCD UI. 1,500+ field installs.",
    content: [
      "Built on ATmega1608 with PlatformIO. Drivers for timers, EEPROM wearleveling, and LCD UI.",
      "Protection tiers: brownout, overload with KVA envelope, surge events. All trips logged with timestamp.",
      "Frequency capture uses TCB1 in event mode with interrupt-driven debouncing.",
    ],
    tech: ["ATmega1608", "PlatformIO", "C/C++", "Timer Drivers", "EEPROM", "LCD Interface"],
    tags: ["ATmega1608", "PlatformIO", "Timers", "EEPROM", "Safety"],
    highlights: [
      "Successfully deployed in 1,500+ field installations",
      "Multi-tier protection system with comprehensive logging",
      "Interrupt-driven frequency capture with debouncing",
      "EEPROM wear-leveling for extended memory life",
      "Real-time motor control with smooth voltage regulation",
    ],
    links: [
      { label: "Code", url: "#" },
      { label: "Docs", url: "#" },
    ],
    metrics: [
      { label: "Deployments", value: "1500+" },
      { label: "Trips handled/day", value: "~4k" },
    ],
    timeline: "8 months",
    team: "Solo project",
    detailSections: [
      {
        heading: "Control goals and safety envelope",
        body: [
          "The design brief was to replace a legacy AVR board that routinely tripped late on high/low events. I started by capturing waveform samples across dozens of failing units and modelling permissible response envelopes.",
          "Once the envelope was understood, I defined explicit protection tiers � brown-out, overload and surge � each with its own detection window and logging policy.",
        ],
        bullets: [
          "Brown-out triggers after 3 consecutive 20 ms samples below 170 V",
          "Surge detection uses a rolling RMS window with 1% tolerance",
          "All hard faults persist until an operator clears the condition",
        ],
        codeSnippets: [
          {
            title: "Surge event ISR",
            language: "c",
            code: `ISR(TCB1_INT_vect) {
  uint16_t kv = tcb1Capture();
  if (kv > KVA_SURGE_LIMIT) {
    log_event(EVENT_SURGE, kv);
    relay_trip();
  }
  TCB1.INTFLAGS = TCB_CAPT_bm;
}`,
          },
        ],
        image: {
          src: "/images/projects/stabilizer/envelope.png",
          alt: "Voltage envelope visualisation",
          caption: "Empirical response envelope plotted from 72 field captures.",
        },
      },
      {
        heading: "Logging pipeline",
        body: [
          "Protection events persist in EEPROM with wear-levelled sectors. The diagnostics UI allows engineers to scroll through timestamped trip history without attaching a programmer.",
          "To keep writes fast I serialize into a fixed 12 byte frame and double buffer the write queue.",
        ],
        codeSnippets: [
          {
            title: "Wear-levelled log writer",
            language: "c",
            code: `static void log_event(uint8_t type, uint16_t kv) {
  EventFrame frame = {
    .type = type,
    .kv = kv,
    .timestamp = rtc_now(),
  };
  eeprom_ring_write(&logger, &frame, sizeof(frame));
}`,
          },
        ],
      },
    ],
    gallery: [
      {
        src: "/images/projects/stabilizer/front-panel.jpg",
        alt: "Front panel of the stabilizer",
        caption: "Production fascia with LCD diagnostics menu.",
      },
    ],
  },
  {
    title: "EV Charger Controller (L1/L2) with Cloud Scheduling",
    slug: slugify("EV Charger Controller (L1/L2) with Cloud Scheduling"),
    category: "IoT Systems",
    description:
      "ATmega1608 + ESP32 system. Realtime safety checks, MLassisted optimal charge windows via MQTT, and KVAbased overload logic.",
    longDescription: `An intelligent EV charging controller system combining embedded hardware control with cloud-based optimization. The dual-microcontroller architecture ensures safety-critical functions remain isolated while enabling advanced scheduling capabilities.

The ATmega1608 controller continuously supervises contactors, RCD (Residual Current Device), and current sensors to ensure safe operation. Meanwhile, the ESP32 handles wireless communication, publishing telemetry data to the cloud via MQTT protocol.

The cloud component uses machine learning algorithms to suggest optimal charging windows that minimize cost while respecting grid alerts and user preferences. The system includes a robust fallback mode with local heuristics to maintain functionality during connectivity issues.`,
    summary:
      "ATmega1608 + ESP32 system. Realtime safety checks, MLassisted optimal charge windows via MQTT, and KVAbased overload logic.",
    content: [
      "Controller supervises contactor, RCD, and current sensors.",
      "ESP32 publishes telemetry. Cloud suggests charge windows to minimize cost while respecting grid alerts.",
      "Fallback offline mode with local heuristics.",
    ],
    tech: ["ATmega1608", "ESP32", "MQTT", "Machine Learning", "Cloud Computing", "Safety Systems"],
    tags: ["ATmega1608", "ESP32", "MQTT", "ML"],
    highlights: [
      "Dual-microcontroller architecture for safety isolation",
      "ML-assisted charging optimization reduces costs by 25%",
      "Real-time safety monitoring with multiple sensor inputs",
      "Robust offline fallback mode ensures continuous operation",
      "MQTT-based telemetry for remote monitoring and control",
    ],
    links: [
      { label: "Design", url: "#" },
      { label: "Report", url: "#" },
    ],
    metrics: [
      { label: "Downtime cut", value: "38%" },
      { label: "Events/day", value: "10k+" },
    ],
    timeline: "12 months",
    team: "3 developers",
    detailSections: [
      {
        heading: "Hardware supervision loop",
        body: [
          "The ATmega1608 supervises relays, RCD status and thermal sensors. Every 2 ms the scheduler executes safety checks before permitting the ESP32 to energise the contactor.",
          "We co-designed state charts with the hardware team, which made failure analysis much quicker during certification.",
        ],
        image: {
          src: "/images/projects/ev-controller/control-stack.png",
          alt: "Control stack diagram",
          caption: "Split responsibilities between ATmega safety loop and ESP32 connectivity.",
        },
      },
      {
        heading: "Telemetry and scheduling",
        body: [
          "Telemetry publishes over MQTT with retained messages so the cloud scheduler always has a baseline dataset. The scheduling service responds with price-optimised charge windows.",
          "Offline mode falls back to a heuristic based on historical demand curves.",
        ],
        codeSnippets: [
          {
            title: "MQTT telemetry payload",
            language: "cpp",
            code: `StaticJsonDocument<256> doc;
doc["amps"] = currentSensor.read();
doc["grid"] = gridAlert.state();
char payload[256];
serializeJson(doc, payload);
mqttClient.publish("ev/telemetry", payload, true);`,
          },
          {
            title: "Offline scheduling heuristic",
            language: "python",
            code: `def fallback_window(tariff_curve):
    window = min(tariff_curve, key=lambda r: r.price)
    return clamp(window.start, 22, 6), window.duration`,
          },
        ],
      },
    ],
    gallery: [
      {
        src: "/images/projects/ev-controller/install.jpg",
        alt: "Installed controller",
        caption: "Pilot install running side-by-side with utility meter telemetry.",
      },
    ],
  },
  {
    title: "3Phase Static Stabilizer Platform",
    slug: slugify("3Phase Static Stabilizer Platform"),
    category: "Real-time Systems",
    description:
      "Nextgen STM32MP1/STM32G4 stack. Modular drivers, fault logging, and CI with unit tests.",
    longDescription: `A next-generation platform for 3-phase static voltage stabilizers utilizing a sophisticated dual-processor architecture. The system combines the computational power of STM32MP1 running embedded Linux with the real-time capabilities of STM32G4 for critical control loops.

The STM32MP1 processor runs a custom Yocto Linux distribution, handling the user interface, telemetry collection, and non-critical system management tasks. The STM32G4 manages all hard real-time control loops with deterministic response times under 1ms.

Communication between processors occurs over a high-speed SPI interface with CRC error checking and deterministic command framing. The system includes comprehensive unit testing using the Ceedling framework with hardware-in-the-loop test fixtures for validation.`,
    summary:
      "Nextgen STM32MP1/STM32G4 stack. Modular drivers, fault logging, and CI with unit tests.",
    content: [
      "Split brain: MP1 runs Linux + Yocto for UI/telemetry. G4 handles hard realtime loops.",
      "Message bridge over SPI with CRC. Deterministic command frames.",
      "Ceedling tests with hardwareinloop fixtures.",
    ],
    tech: ["STM32MP1", "STM32G4", "Yocto Linux", "Ceedling", "SPI", "Real-time Systems"],
    tags: ["STM32G4", "Yocto", "Ceedling", "CI"],
    highlights: [
      "Dual-processor architecture for optimal performance distribution",
      "Custom Yocto Linux build for embedded applications",
      "Sub-millisecond real-time control loop response",
      "Comprehensive testing with hardware-in-the-loop validation",
      "Modular driver architecture for easy maintenance and updates",
    ],
    links: [{ label: "Roadmap", url: "#" }],
    metrics: [
      { label: "Rated", value: "500 kVA" },
      { label: "Latency", value: "<1 ms cutoff" },
    ],
    timeline: "18 months",
    team: "5 engineers",
    detailSections: [
      {
        heading: "Split-brain architecture",
        body: [
          "The Linux side handles analytics and UI, while the STM32G4 executes real-time loops. We defined a binary interface so both halves could evolve independently.",
          "Command frames carry CRC16 and monotonic counters to reject replayed packets.",
        ],
        codeSnippets: [
          {
            title: "Deterministic SPI frame",
            language: "c",
            code: `SpiFrame frame = {
  .magic = 0xAA55,
  .command = CMD_SET_TAP,
  .payload = { tapIndex, phase },
};
frame.crc = crc16(&frame, sizeof(frame) - 2);
spi_write_blocking(SPI1, (uint8_t *)&frame, sizeof(frame));`,
          },
        ],
      },
      {
        heading: "Continuous integration",
        body: [
          "We wired Ceedling into GitHub Actions with hardware-in-loop steps so regressions are caught before field release.",
          "Device telemetry feeds Grafana dashboards that the support team uses for fleet monitoring.",
        ],
        image: {
          src: "/images/projects/static-stabilizer/dashboard.png",
          alt: "Grafana monitoring dashboard",
          caption: "CI pipeline output and runtime telemetry aggregated for the operations team.",
        },
      },
    ],
    gallery: [
      {
        src: "/images/projects/static-stabilizer/control-cabinet.jpg",
        alt: "Control cabinet",
        caption: "Test cabinet used for thermal soak and load validation.",
      },
    ],
  },
];

export { slugify };
