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

  {
    title: "Three-Phase Servo Stabilizer — Technical Deep Dive",
    slug: slugify("Three-Phase Servo Stabilizer — Technical Deep Dive"),
    category: "Embedded Systems",
    description:
      "ATmega4809 three-phase servo stabilizer. LCD UI, digit-edit menu, staged protection, EEPROM logs, frequency capture, and per-phase motor regulation.",
    longDescription: `A complete walkthrough of the firmware architecture, data flow, and the key libraries powering an ATmega4809-based three-phase servo stabilizer. The system monitors 3-phase voltages and currents, earth potential, and grid frequency; evaluates a protection ladder with staged timers; drives per-phase servo motors for voltage regulation; and presents a robust 20×4 LCD UI with digit-edit menus and logs persisted to EEPROM.

Tooling uses PlatformIO with Arduino-on-megaAVR and Serial UPDI upload. LCD variants are auto-detected (PCF8574 @0x27 or AIP31068 @0x3E). Timers use non-blocking callbacks for trip staging and safe relay arming. Frequency is measured via TCB capture fed by EVSYS from zero-cross inputs. The codebase isolates concerns into libraries: ButtonManager, MenuData, MenuHandler, DisplayManager, LCDManager, EEPROMStore, MyTimerLib, Condition, SensorReadings, FrequencyMeasurer, VoltageRegulator, FlagManager, and MyPinConfig.`,
    summary:
      "ATmega4809 3φ stabilizer with LCD UX, digit-edit menus, staged protection, EEPROM logs, frequency capture, and per-phase servo regulation.",
    content: [
      "Monitors R/Y/B input & output voltages, per-phase currents, earth voltage, and frequency.",
      "20×4 LCD with main pages, fault pages, menu edit, and log viewer.",
      "Digit-edit menus with bounds/units; parameters validated and saved to EEPROM.",
      "Protection ladder: I/P and O/P high/low, overload L1/L2/immediate, earth, frequency, phase reverse, ELCB.",
      "Relay trip staging via non-blocking timers; safe delayed energize on clear.",
      "Per-phase servo drive with tolerance + hysteresis to prevent thrashing."
    ],
    tech: [
      "ATmega4809",
      "Arduino (atmelmegaavr)",
      "PlatformIO",
      "Serial UPDI",
      "TCB Capture",
      "EVSYS",
      "LCD 20x4 (I2C, AIP31068)",
      "EEPROM",
      "C/C++"
    ],
    tags: ["ATmega4809", "Servo Stabilizer", "Protection", "Timers", "EEPROM", "LCD UI"],
    highlights: [
      "Auto-detects LCD controller (0x27/0x3E) and unifies API",
      "Non-blocking trip timers with UI countdowns",
      "Ring-buffer event logs with configurable capacity",
      "Per-phase motor hysteresis with dead-time interlocks",
      "Capture-based frequency measurement on multiple phases"
    ],
    links: [
      { label: "Code", url: "#" },
      { label: "Docs", url: "#" }
    ],
    metrics: [
      { label: "Phases", value: "3" },
      { label: "LCD", value: "20x4" }
    ],
    timeline: "Ongoing",
    team: "Solo project",
    detailSections: [
      {
        heading: "Runtime orchestration (setup → loop)",
        body: [
          "setup(): initialize Display→Buttons→FrequencyMeasurer→EEPROM→VoltageRegulator→Pins→ISRs; show splash; first sensor read; safe RelayOn scheduling if clear.",
          "loop(): update buttons and timers, refresh sensors and regulator FSM, render UI mode (MAIN/MENU/LOG), evaluate condition ladder, manage trips or resume."
        ],
        bullets: [
          "Single sources of truth for parameters, sensors, and currentCondition",
          "Digit-edit menu feeds validated parameters back into control logic"
        ],
        codeSnippets: [
          {
            title: "Main loop skeleton",
            language: "cpp",
            code: `void loop() {
  btnMgr.update();
  timer.updateAllTimers();
  VoltageRegulator::update();
  updateSensorReadings(parameters);
  ui.dispatchMode();
  uint8_t tripId = 0xFF;
  currentCondition = conditionLadder(&tripId);
  displayMgr.displayCondition(tripId);
}`
          }
        ],
        image: {
          src: "/img/diagram.png",
          alt: "Setup→loop runtime flow",
          caption: "Orchestration of UI, sensors, timers, and protection ladder."
        }
      },
      {
        heading: "ButtonManager + MenuHandler",
        body: [
          "Buttons support debounced short/long presses and fast repeat while editing.",
          "MenuHandler performs per-digit arithmetic edits with bounds from MenuData."
        ],
        bullets: [
          "Password-gated sections after a sentinel index",
          "Dependent updates keep per-phase targets in sync with common setpoint"
        ],
        codeSnippets: [
          {
            title: "Per-digit increment logic",
            language: "cpp",
            code: `void MenuHandler::incrementDigit() {
  int16_t &v = _values[_currentItem];
  uint16_t p10 = 1; for (uint8_t i=0;i<_digitPos;i++) p10 *= 10;
  uint8_t d = (v / p10) % 10;
  v = v - d*p10 + ((d+1)%10)*p10;
}`
          }
        ]
      },
      {
        heading: "DisplayManager + LCDManager",
        body: [
          "LCDManager probes I2C and selects LiquidCrystal_I2C or AIP31068 at runtime.",
          "DisplayManager centralizes main pages, fault pages with timers, and log views."
        ],
        bullets: [
          "Custom glyphs for arrows and progress bars",
          "Fault screen shows value vs threshold and elapsed/total time"
        ],
        codeSnippets: [
          {
            title: "LCD detection + begin",
            language: "cpp",
            code: `void LCDManager::begin() {
  Wire.begin(); detectLCD(); reinit();
  if (lcdType==LCD_I2C) { lcdI2C = new LiquidCrystal_I2C(0x27, cols, rows); lcdI2C->init(); lcdI2C->backlight(); }
  else if (lcdType==LCD_AIP) { lcdAIP = new LiquidCrystal_AIP31068_I2C(0x3E, cols, rows); lcdAIP->init(); lcdAIP->display(); }
  clear();
}`
          }
        ],
        image: {
          src: "/images/projects/3phase-stabilizer/lcd.png",
          alt: "LCD UI",
          caption: "Unified LCD API across controller variants."
        }
      },
      {
        heading: "EEPROMStore + Logs",
        body: [
          "Parameters saved as contiguous u16 array with range checks on load.",
          "Compact ring buffer stores event frames with type, value, and timestamp."
        ],
        bullets: [
          "Configurable record count; clearing on capacity change",
          "Wear-friendly updates using EEPROM.update()"
        ],
        codeSnippets: [
          {
            title: "u16 save/load primitives",
            language: "cpp",
            code: `bool saveU16(const uint16_t* data, uint8_t n, uint16_t base) {
  uint16_t a=base; for(uint8_t i=0;i<n;++i){ EEPROM.update(a,(uint8_t)(data[i]&0xFF)); EEPROM.update(a+1,(uint8_t)(data[i]>>8)); a+=2; } return true;
}
bool loadU16(uint16_t* data, uint8_t n, uint16_t base) {
  uint16_t a=base; for(uint8_t i=0;i<n;++i){ uint16_t lo=EEPROM.read(a), hi=EEPROM.read(a+1); data[i]=lo|(hi<<8); a+=2; } return true;
}`
          }
        ],
        image: {
          src: "/images/projects/3phase-stabilizer/logs.png",
          alt: "Log ring buffer",
          caption: "Tiny, configurable event log."
        }
      },
      {
        heading: "Protection ladder + timers",
        body: [
          "Condition encodes staged trips: O/P high/low L1/L2/immediate, overload tiers, single-timed I/P, and immediate ISR faults.",
          "TimerManager_v2 drives countdowns and delayed relay energize for safe resume."
        ],
        bullets: [
          "Phase reverse and ELCB handled from ISRs",
          "UI maps timer IDs to configured trip times for display"
        ],
        codeSnippets: [
          {
            title: "Staged trip example",
            language: "cpp",
            code: `if (outV_R > p[OP_HIGH_2]) {
  currentCondition = {COND_OUTHIGH_2R, outV_R};
  *tripId = T_OUT_HIGH_2;
  timer.startTimer(T_OUT_HIGH_2, p[OP_HIGH_TRIP_T2], SECONDS, RelayOff);
} else if (outV_R > p[OP_HIGH_IMMEDIATE]) {
  currentCondition = {COND_OUTHIGH_IMT_R, outV_R};
  RelayOff();
}`
          }
        ],
        image: {
          src: "/images/projects/3phase-stabilizer/ladder.png",
          alt: "Protection ladder",
          caption: "Level-1 → Level-2 → Immediate trip staging."
        }
      },
      {
        heading: "Sensors + Frequency capture",
        body: [
          "ADC sampling with simple oversampling and scaling for V/I/Earth.",
          "FrequencyMeasurer configures TCB capture via EVSYS; ISRs compute Hz."
        ],
        bullets: [
          "R and Y phases captured; B derived or captured similarly",
          "Clamped to byte range for lightweight UI transport"
        ],
        codeSnippets: [
          {
            title: "TCB capture init",
            language: "c",
            code: `void FrequencyMeasurer::setupTCBs(){
  TCB0.CTRLB = TCB_CNTMODE_CAPT_gc;
  TCB0.EVCTRL = TCB_CAPTEI_bm | TCB_FILTER_bm;
  TCB0.INTCTRL = TCB_CAPT_bm;
  TCB0.CTRLA = TCB_CLKSEL_CLKTCA_gc | TCB_ENABLE_bm;
  // TCB1 similar for second phase
}`
          }
        ]
      },
      {
        heading: "VoltageRegulator — per-phase servo FSM",
        body: [
          "Decides UP/DOWN/STOP from setpoint±tolerance with hysteresis.",
          "Interlocks ensure only one direction per phase is active at a time."
        ],
        bullets: [
          "Dead-time prevents motor thrashing",
          "Targets updated when common setpoint changes"
        ],
        codeSnippets: [
          {
            title: "Hysteresis decision",
            language: "cpp",
            code: `MotorDir decide(int16_t v, int16_t sp, MotorDir last){
  const int16_t lo = sp - tol, hi = sp + tol;
  if (last==STOP){ if(v<lo) return UP; if(v>hi) return DOWN; return STOP; }
  if (last==UP)   return (v>=lo + hyst) ? STOP : UP;
  if (last==DOWN) return (v<=hi - hyst) ? STOP : DOWN;
  return STOP;
}`
          }
        ]
      }
    ],
    gallery: [
      {
        src: "/images/projects/3phase-stabilizer/overview.png",
        alt: "System overview",
        caption: "Modules and data flow."
      },
      {
        src: "/images/projects/3phase-stabilizer/ui-main.jpg",
        alt: "LCD main page",
        caption: "Telemetry and status."
      },
      {
        src: "/images/projects/3phase-stabilizer/fault-screen.jpg",
        alt: "Fault screen",
        caption: "Staged trip with countdown."
      }
    ]
  },


];

export { slugify };
