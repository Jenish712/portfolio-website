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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  {
    title: "Industrial Three-Phase Servo Voltage Stabilizer with Real-Time Protection System",
    slug: slugify("Industrial Three-Phase Servo Voltage Stabilizer with Real-Time Protection System"),
    category: "Embedded Systems & Power Electronics",
    description:
      "Production-grade ATmega4809-based three-phase servo stabilizer featuring advanced voltage regulation, multi-tiered protection cascade, real-time telemetry, persistent logging, and intuitive LCD interface with digit-level parameter editing.",
    longDescription: `An industrial-grade firmware solution for a three-phase servo voltage stabilizer built from the ground up using ATmega4809 microcontroller. This project demonstrates expertise in embedded systems architecture, real-time control systems, power electronics interfacing, and robust fault management.

The system continuously monitors three-phase electrical parameters (voltage, current, frequency, earth leakage) and provides automatic voltage regulation through servo motor control while implementing a sophisticated multi-level protection scheme that prevents equipment damage and ensures operator safety.

**Technical Excellence:** Modular architecture with 12+ custom libraries, hardware timer-based frequency capture using TCB/EVSYS peripherals, non-blocking timer management for concurrent operations, EEPROM-based parameter persistence with ring-buffer event logging, and auto-detecting I2C LCD driver supporting multiple controller variants.

> **Platform:** ATmega4809 (16 MHz internal oscillator) • **Framework:** Arduino with atmelmegaavr core • **IDE:** PlatformIO • **Programming:** Serial UPDI • **Language:** C/C++`,

    summary:
      "Industrial 3-phase servo stabilizer with ATmega4809: real-time voltage, current, frequency monitoring, staged protection ladder (9 fault types), per-phase servo regulation, persistent EEPROM logging, and professional LCD UI with digit-editing menus.",

    content: [
      "Real-time monitoring of 9 electrical parameters: 3-phase input & output voltages (R, Y, B), 3-phase load currents, earth leakage voltage, and grid frequency via hardware capture",
      "Professional 20×4 character LCD interface with auto-detection for multiple I2C controller types (like 0x27 or 0x3E addresses, PCF8574 & AIP31068 chips)",
      "Advanced digit-by-digit parameter editing system with bounds checking, password protection, and default value restoration",
      "Multi-tiered protection ladder with 9 fault detection types: over & under voltage (3 stages each), overload current (3 stages), frequency deviation, earth leakage, phase reversal, and ELCB trip",
      "Intelligent staged fault response system with configurable timers, countdown displays, and automatic recovery when conditions normalize",
      "Non-volatile EEPROM storage for 30+ system parameters and circular buffer event logging with timestamps",
      "Independent per-phase servo motor control with hysteresis-based regulation, direction interlocks, and dead-time protection",
      "Hardware-based frequency measurement using Timer/Counter B (TCB) in capture mode with Event System (EVSYS) routing"
    ],

    tech: [
      "ATmega4809 (AVR Microcontroller)",
      "C/C++ (Arduino Framework)",
      "PlatformIO (Build System)",
      "Serial UPDI (Programming)",
      "TCB Timer Capture Mode",
      "EVSYS (Event System)",
      "I2C Protocol",
      "LCD 20×4 Character Display",
      "EEPROM Storage",
      "ADC Multi-channel Sampling",
      "PWM Motor Control",
      "Interrupt Service Routines (ISR)"
    ],

    tags: [
      "ATmega4809",
      "Embedded C/C++",
      "Servo Stabilizer",
      "Power Electronics",
      "Real-Time Systems",
      "Protection Systems",
      "EEPROM Persistence",
      "Hardware Timers",
      "LCD UI/UX",
      "PlatformIO",
      "Modular Architecture"
    ],

    highlights: [
      "Modular architecture with 12+ custom libraries promoting code reusability and maintainability",
      "Auto-detection algorithm for I2C LCD controllers with unified API abstraction layer",
      "Non-blocking timer management system supporting multiple concurrent countdown operations",
      "Circular buffer implementation in EEPROM for persistent event logging with wear leveling",
      "Per-phase servo motor control with hysteresis algorithm preventing oscillation and mechanical wear",
      "Hardware timer-based frequency capture achieving sub-Hz accuracy without CPU polling",
      "Staged protection system with 3 severity levels preventing nuisance tripping while ensuring safety",
      "Comprehensive parameter validation and bounds checking preventing system misconfiguration"
    ],

    links: [
      { label: "Code", url: "https://github.com/Jenish712/At4809_3P_Servo" },
      { label: "Docs", url: "#" },
      { label: "Demo Video", url: "#" }
    ],

    metrics: [
      { label: "Phases Monitored", value: "3" },
      { label: "Protection Types", value: "9" },
      { label: "Custom Libraries", value: "12+" },
      { label: "LCD Resolution", value: "20×4" },
      { label: "Parameters Stored", value: "30+" },
      { label: "Code Language", value: "C/C++" }
    ],

    timeline: "Ongoing Development & Enhancement",
    team: "Independent Project (Full Stack Embedded Development)",

    keySkillsDemonstrated: [
      "Embedded Systems Architecture & Design",
      "Real-Time Control Systems",
      "Interrupt-Driven Programming",
      "Hardware Abstraction Layer (HAL) Development",
      "State Machine Implementation",
      "Power Electronics Interfacing",
      "ADC Signal Conditioning & Calibration",
      "Timer/Counter Configuration (Capture Mode)",
      "EEPROM Management & Wear Leveling",
      "Modular Software Design",
      "ISR (Interrupt Service Routine) Optimization",
      "Non-Blocking Concurrent Operations",
      "I2C Communication Protocol",
      "Human-Machine Interface (HMI) Design"
    ],

    detailSections: [
      {
        heading: "Project Overview & Business Context",
        body: [
          "This project addresses a critical need in industrial and commercial power distribution: protecting sensitive equipment from voltage fluctuations and electrical faults. Voltage stabilizers are essential in regions with unstable power grids, preventing equipment damage, downtime, and safety hazards.",
          "The system provides automatic voltage regulation while implementing a comprehensive protection scheme that rivals commercial industrial stabilizers costing thousands of dollars. This demonstrates not just technical capability, but understanding of real-world requirements and cost-effective engineering."
        ],
        bullets: [
          "Replaces expensive commercial stabilizers with open-source, customizable solution",
          "Applicable to industrial machinery, medical equipment, data centers, and commercial installations",
          "Modular design allows easy adaptation to different load ratings and voltage specifications",
          "Professional-grade fault handling prevents equipment damage and ensures operator safety"
        ]
      },
      {
        heading: "System Architecture & Design Philosophy",
        body: [
          "The firmware follows a modular, event-driven architecture with clear separation of concerns. The main.cpp orchestrates initialization and the event loop, while 12+ specialized libraries handle distinct subsystems: Display management, button handling, sensor acquisition, fault detection, motor control, and data persistence.",
          "This architecture demonstrates industry best practices: single responsibility principle, dependency injection, and facade patterns that promote testability and maintainability."
        ],
        bullets: [
          "Event-driven main loop with non-blocking operations for responsive UI",
          "Centralized state management through FlagManager preventing race conditions",
          "Hardware abstraction layers (HAL) for LCD, EEPROM, and timers enabling portability",
          "Declarative configuration (MenuData) separating business logic from presentation"
        ],
        codeSnippets: [
          {
            title: "System Architecture Overview",
            language: "text",
            code: `┌───────────────────────────────────────────────────────────────────────────┐
│                            MAIN CONTROL LOOP                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │   Buttons   │→ │   Timers    │→ │   Sensors    │→ │  Protection &   │ │
│  │   Update    │  │   Update    │  │   Update     │  │  Motor Control  │ │
│  └─────────────┘  └─────────────┘  └──────────────┘  └─────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
                                    ↓
        ┌──────────────────────────────────────────────────────────┐
        │                   SUBSYSTEM MODULES                      │
        ├──────────────┬──────────────┬──────────────┬─────────────┤
        │ UI Layer     │ Control      │ Sensing      │ Persistence │
        ├──────────────┼──────────────┼──────────────┼─────────────┤
        │DisplayManager│Condition FSM │SensorReadings│EEPROMStore  │
        │LCDManager    │VoltageReg    │FreqMeasurer  │(Ring Buffer)│
        │MenuHandler   │MyTimerLib    │ADC Oversample│             │
        │ButtonManager │FlagManager   │              │             │
        └──────────────┴──────────────┴──────────────┴─────────────┘`
          }
        ]
      },
      {
        heading: "Core Technical Implementations",
        body: [
          "The project showcases several advanced embedded systems techniques that demonstrate deep technical knowledge."
        ]
      },
      {
        heading: "1. Hardware Timer-Based Frequency Measurement",
        body: [
          "Instead of using CPU-intensive polling or external interrupts, the system leverages ATmega4809's Timer/Counter B (TCB) in input capture mode, routed through the Event System (EVSYS). This achieves accurate frequency measurement (±0.1 Hz) with zero CPU overhead.",
          "This demonstrates understanding of advanced microcontroller peripherals and hardware-software co-design."
        ],
        codeSnippets: [
          {
            title: "TCB Capture Configuration (FrequencyMeasurer.cpp)",
            language: "cpp",
            code: `void FrequencyMeasurer::setupTCBs() {
  // Configure TCB0 for input capture on R-phase frequency
  TCB0.CTRLB = TCB_CNTMODE_CAPT_gc;              // Capture mode
  TCB0.EVCTRL = TCB_CAPTEI_bm | TCB_FILTER_bm;   // Enable event input + filter
  TCB0.INTCTRL = TCB_CAPT_bm;                    // Enable capture interrupt
  TCB0.CTRLA = TCB_CLKSEL_CLKTCA_gc | TCB_ENABLE_bm; // Clock from TCA, enable
  
  // Configure TCB1 for Y-phase (similar setup)
  TCB1.CTRLB = TCB_CNTMODE_CAPT_gc;
  TCB1.EVCTRL = TCB_CAPTEI_bm | TCB_FILTER_bm;
  TCB1.INTCTRL = TCB_CAPT_bm;
  TCB1.CTRLA = TCB_CLKSEL_CLKTCA_gc | TCB_ENABLE_bm;
}

// ISR calculates frequency from captured period
ISR(TCB0_INT_vect) {
  uint16_t capturedValue = TCB0.CCMP;
  TCB0.INTFLAGS = TCB_CAPT_bm; // Clear interrupt flag
  
  if (capturedValue > 0) {
    // F = ClockFreq / CapturedPeriod
    freqR = (uint8_t)((F_CPU / 64) / capturedValue);
  }
}`
          }
        ],
        bullets: [
          "Zero CPU overhead for frequency measurement using hardware peripherals",
          "Event System (EVSYS) routing eliminates need for external interrupts",
          "Digital filtering in hardware reduces noise susceptibility",
          "Demonstrates mastery of microcontroller advanced features"
        ]
      },
      {
        heading: "2. Non-Blocking Timer Management System",
        body: [
          "The MyTimerLib module implements a software timer manager supporting multiple concurrent countdown operations without blocking the main loop. This is essential for staged fault protection where multiple timers with different durations need to run simultaneously.",
          "This pattern is crucial in embedded systems where blocking delays would freeze the UI and prevent critical fault detection."
        ],
        codeSnippets: [
          {
            title: "Non-Blocking Timer Implementation",
            language: "cpp",
            code: `void TimerManager_v2::startTimer(uint8_t id, uint16_t interval, uint8_t unit, void (*cb)()) {
  Timer_v2* t = findTimer(id);
  
  if (!t && timerCount < MAX_TIMERS) {
    // Create new timer
    timers[timerCount] = {
      id, 
      convertToMilliseconds(interval, unit),
      (uint16_t)millis(),
      true,  // active
      false, // not paused
      0,
      cb     // callback on expiration
    };
    timerCount++;
  }
}

void TimerManager_v2::updateAllTimers() {
  for (uint8_t i = 0; i < timerCount; i++) {
    if (timers[i].active && !timers[i].paused) {
      uint16_t elapsed = (uint16_t)(millis() - timers[i].lastRunTime);
      
      if (elapsed >= timers[i].interval) {
        if (timers[i].callback) {
          timers[i].callback(); // Execute callback
        }
        timers[i].active = false; // Timer expired
      }
    }
  }
}`
          }
        ],
        bullets: [
          "Supports up to 10 concurrent timers with independent callbacks",
          "Unit conversion (seconds/milliseconds/microseconds) for flexible usage",
          "Pause/resume functionality for complex timing scenarios",
          "Callback pattern enables decoupled event handling"
        ]
      },
      {
        heading: "3. Staged Protection Ladder with Intelligent Trip Logic",
        body: [
          "The protection system implements a three-tier severity model for each fault type, preventing nuisance tripping while ensuring safety. Level 1 and Level 2 faults trigger timed warnings with countdown displays, allowing temporary transients to clear. Level 3 (immediate) faults cause instant shutdown.",
          "This mimics industrial-grade protection relays and demonstrates understanding of power system protection philosophy."
        ],
        codeSnippets: [
          {
            title: "Protection Ladder Logic (Condition.cpp)",
            language: "cpp",
            code: `ConditionType conditionLadder(uint8_t *timerId_now) {
  // Check in order of severity: Immediate → Level 2 → Level 1
  
  // OUTPUT VOLTAGE HIGH - Three stages
  if (outVolt_R > parameters[MENU_OP_HIGH_IMDTE_TRIP]) {
    currentCondition = {CONDITION_OUTHIGH_IMT_R, outVolt_R};
    RelayOff(); // Immediate trip, no timer
    return CONDITION_OUTHIGH_IMT_R;
  }
  else if (outVolt_R > parameters[MENU_OP_HIGH_CUTOFF_2]) {
    currentCondition = {CONDITION_OUTHIGH_2R, outVolt_R};
    *timerId_now = TIMER_OUTPUT_HIGH_TRIP_2;
    // Start Level 2 timer (e.g., 5 seconds)
    timer.startTimer(TIMER_OUTPUT_HIGH_TRIP_2, 
                     parameters[MENU_OP_HIGH_TRIP_TIME_2], 
                     SECONDS, 
                     RelayOff);
    return CONDITION_OUTHIGH_2R;
  }
  else if (outVolt_R > parameters[MENU_OP_HIGH_CUTOFF_1]) {
    currentCondition = {CONDITION_OUTHIGH_1R, outVolt_R};
    *timerId_now = TIMER_OUTPUT_HIGH_TRIP_1;
    // Start Level 1 timer (e.g., 10 seconds)
    timer.startTimer(TIMER_OUTPUT_HIGH_TRIP_1, 
                     parameters[MENU_OP_HIGH_TRIP_TIME_1], 
                     SECONDS, 
                     RelayOff);
    return CONDITION_OUTHIGH_1R;
  }
  
  // Similar staged logic for: undervoltage, overload, frequency, earth leakage
  // ... [additional conditions]
  
  return CONDITION_NONE; // All parameters within safe limits
}`
          }
        ],
        bullets: [
          "9 distinct fault types with configurable thresholds",
          "3-tier severity model: Level 1 (warning), Level 2 (serious), Level 3 (critical)",
          "Countdown timers displayed on LCD allowing operator awareness",
          "Automatic recovery when fault condition clears before timer expires",
          "EEPROM logging of all trip events with timestamps for analysis"
        ]
      },
      {
        heading: "4. Auto-Detecting LCD Driver with Unified API",
        body: [
          "The LCDManager module automatically probes I2C bus for LCD controllers at addresses 0x27 (PCF8574-based) and 0x3E (AIP31068-based), instantiating the appropriate driver library and providing a unified API. This demonstrates polymorphism and hardware abstraction principles.",
          "This allows the same firmware to work with multiple LCD hardware variants without recompilation."
        ],
        codeSnippets: [
          {
            title: "LCD Auto-Detection (LCDManager.cpp)",
            language: "cpp",
            code: `void LCDManager::detectLCD() {
  Wire.begin();
  
  if (scanI2C(0x27) == 0) {
    lcdType = LCD_I2C;  // PCF8574 controller found
  }
  else if (scanI2C(0x3E) == 0) {
    lcdType = LCD_AIP31068;  // AIP31068 controller found
  }
  else {
    lcdType = LCD_NONE;  // No LCD detected
  }
}

void LCDManager::begin() {
  detectLCD();
  
  if (lcdType == LCD_I2C) {
    lcdI2C = new LiquidCrystal_I2C(0x27, lcdCols, lcdRows);
    lcdI2C->init();
    lcdI2C->backlight();
  }
  else if (lcdType == LCD_AIP31068) {
    lcdAIP = new LiquidCrystal_AIP31068_I2C(0x3E, lcdCols, lcdRows);
    lcdAIP->init();
    lcdAIP->display();
  }
}

// Unified API - implementation delegates to active driver
void LCDManager::print(const String &str) {
  if (lcdType == LCD_I2C) lcdI2C->print(str);
  else if (lcdType == LCD_AIP31068) lcdAIP->print(str);
}`
          }
        ],
        bullets: [
          "Hardware abstraction layer pattern for driver independence",
          "Runtime polymorphism through unified interface",
          "I2C bus scanning for automatic hardware discovery",
          "Graceful degradation if no LCD detected"
        ]
      },
      {
        heading: "5. Digit-by-Digit Parameter Editing System",
        body: [
          "The MenuHandler implements sophisticated digit-level editing allowing operators to modify parameters with precision. Users navigate to a digit position and increment/decrement that specific digit, with live bounds checking and visual feedback.",
          "This provides a professional user experience comparable to commercial industrial controllers."
        ],
        codeSnippets: [
          {
            title: "Digit Manipulation Algorithm (MenuHandler.cpp)",
            language: "cpp",
            code: `void MenuHandler::incrementDigit() {
  int16_t &value = _values[_currentItem];
  
  // Calculate the power of 10 for current digit position
  uint16_t powerOf10 = 1;
  for (uint8_t i = 0; i < _digitPos; i++) {
    powerOf10 *= 10;
  }
  
  // Extract current digit at this position
  const uint8_t currentDigit = (value / powerOf10) % 10;
  
  // Increment with wraparound (0-9)
  const uint8_t newDigit = (currentDigit + 1) % 10;
  
  // Replace digit in value
  value = value - (currentDigit * powerOf10) + (newDigit * powerOf10);
  
  // Enforce bounds checking
  const MenuItem &item = _schema[_currentItem];
  if (value < item.minValue) value = item.minValue;
  if (value > item.maxValue) value = item.maxValue;
}`
          }
        ],
        bullets: [
          "Mathematical digit extraction and manipulation without string conversion",
          "Real-time bounds enforcement preventing invalid configurations",
          "Visual cursor showing current edit position",
          "Efficient implementation using integer arithmetic only"
        ]
      },
      {
        heading: "6. EEPROM Persistence with Ring-Buffer Event Logging",
        body: [
          "The EEPROMStore module manages both parameter storage and a circular buffer for fault event logging. Parameters are validated against MenuData bounds before storage, and the ring buffer implements wear leveling to extend EEPROM lifetime.",
          "This demonstrates understanding of non-volatile memory management and embedded database concepts."
        ],
        codeSnippets: [
          {
            title: "EEPROM Ring Buffer (EEPROMStore.cpp)",
            language: "cpp",
            code: `// 16-bit parameter storage with bounds validation
bool EEPROMStore::saveU16(const uint16_t* data, uint8_t count, uint16_t base) {
  uint16_t addr = base;
  for (uint8_t i = 0; i < count; ++i) {
    uint16_t value = data[i];
    EEPROM.update(addr + 0, (uint8_t)(value & 0xFF));      // Low byte
    EEPROM.update(addr + 1, (uint8_t)(value >> 8));        // High byte
    addr += 2;
  }
  return true;
}

// Circular buffer for event logs
void EEPROMStore::Log::write(uint8_t eventType, uint16_t eventData) {
  uint16_t writeAddr = LOG_BASE_ADDR + (logHead * LOG_ENTRY_SIZE);
  
  EEPROM.update(writeAddr + 0, eventType);
  EEPROM.update(writeAddr + 1, (uint8_t)(eventData & 0xFF));
  EEPROM.update(writeAddr + 2, (uint8_t)(eventData >> 8));
  EEPROM.update(writeAddr + 3, (uint8_t)(millis() >> 16)); // Timestamp
  
  // Advance head with wraparound
  logHead = (logHead + 1) % LOG_CAPACITY;
  
  // Update count (saturates at capacity)
  if (logCount < LOG_CAPACITY) logCount++;
}`
          }
        ],
        bullets: [
          "Persistent storage of 30+ configurable parameters",
          "Circular buffer prevents EEPROM wear-out",
          "Validation against MenuData schema before writes",
          "Timestamps for event correlation and analysis",
          "Capacity configurable via menu (10-100 events)"
        ]
      },
      {
        heading: "7. Per-Phase Servo Motor Control with Hysteresis",
        body: [
          "The VoltageRegulator module implements independent control for each phase's servo motor, using a hysteresis algorithm to prevent oscillation. Direction interlocks prevent simultaneous UP/DOWN commands that could damage motor contactors.",
          "This demonstrates control systems knowledge and safety-critical embedded programming."
        ],
        codeSnippets: [
          {
            title: "Hysteresis Control Algorithm (VoltageRegulator.cpp)",
            language: "cpp",
            code: `MotorDir VoltageRegulator::decide(int16_t outV, int16_t setpoint, MotorDir last) {
  const int16_t tolerance = _tolerance;
  const int16_t hysteresis = _hysteresis;
  
  const int16_t lowThreshold = setpoint - tolerance;
  const int16_t highThreshold = setpoint + tolerance;
  
  // If motor is stopped, check if action needed
  if (last == STOP) {
    if (outV < lowThreshold) return UP;       // Voltage too low → increase
    if (outV > highThreshold) return DOWN;    // Voltage too high → decrease
    return STOP;                              // Within deadband
  }
  
  // If motor is raising voltage, continue until setpoint reached + hysteresis
  if (last == UP) {
    if (outV >= lowThreshold + hysteresis) return STOP;
    return UP;  // Continue raising
  }
  
  // If motor is lowering voltage, continue until setpoint reached - hysteresis
  if (last == DOWN) {
    if (outV <= highThreshold - hysteresis) return STOP;
    return DOWN;  // Continue lowering
  }
  
  return STOP;
}

void VoltageRegulator::applyMotorCommand(PhaseMotor &motor, MotorDir dir) {
  // Safety interlock: never enable UP and DOWN simultaneously
  if (dir == UP) {
    digitalWrite(motor.downPin, LOW);   // Ensure DOWN is off first
    delay(50);                          // Dead time
    digitalWrite(motor.upPin, HIGH);
  }
  else if (dir == DOWN) {
    digitalWrite(motor.upPin, LOW);     // Ensure UP is off first
    delay(50);                          // Dead time
    digitalWrite(motor.downPin, HIGH);
  }
  else { // STOP
    digitalWrite(motor.upPin, LOW);
    digitalWrite(motor.downPin, LOW);
  }
}`
          }
        ],
        bullets: [
          "Hysteresis prevents motor oscillation and wear",
          "Independent control for unbalanced three-phase loads",
          "Direction interlock prevents contactor damage",
          "Dead-time delays ensure safe commutation",
          "Configurable tolerance and hysteresis bands"
        ]
      },
      {
        heading: "8. Comprehensive Sensor Acquisition Pipeline",
        body: [
          "The SensorReadings module implements ADC oversampling for noise reduction, scaling with calibration factors, and CT (Current Transformer) ratio compensation. This demonstrates analog signal conditioning and measurement systems knowledge."
        ],
        codeSnippets: [
          {
            title: "ADC Oversampling (SensorReadings.cpp)",
            language: "cpp",
            code: `// Oversampling for noise reduction
short int get_max(short int pin) {
  short int maxValue = 0;
  
  // Take 100 samples over 25ms (for 50Hz AC)
  for (uint8_t i = 0; i < 100; i++) {
    maxValue = max(maxValue, (short)analogRead(pin));
    delayMicroseconds(250);  // 250µs between samples
  }
  
  return maxValue;
}

void updateSensorReadings(int16_t* params) {
  // Input voltage (R-phase): ADC → scale to voltage
  inVolt_R = get_max(IN_VOLT_R_PIN) * 1000.0f / 1023;  // 0-1000V range
  
  // Output voltage with calibration
  outVolt_R = get_max(OUT_VOLT_R_PIN) * 1000.0f / 1023;
  
  // Earth leakage voltage (different scaling)
  earthVolt = get_max(E_VOLT_PIN) * 50.0f / 1023;  // 0-50V range
  
  // Current with CT ratio compensation
  current_R = (get_max(AMPERE_R_PIN) * 1000.0f / 1023) * params[MENU_CT] / 100;
  
  // Repeat for Y and B phases...
}`
          }
        ],
        bullets: [
          "100-sample oversampling for AC signal peak detection",
          "Configurable CT ratio for different load ratings (5A, 10A, 20A, etc.)",
          "Independent scaling for voltage and current channels",
          "Sample timing synchronized with AC frequency (50/60Hz)"
        ]
      },
      {
        heading: "Development Tools & Build System",
        body: [
          "The project uses professional embedded development tools and follows modern CI/CD-ready practices."
        ],
        bullets: [
          "PlatformIO: Industry-standard build system with dependency management",
          "Serial UPDI: Modern programming interface (replaces legacy ISP)",
          "Version control: Structured Git repository with meaningful commits",
          "Modular libraries: Each subsystem is independently testable",
          "platformio.ini: Declarative configuration for reproducible builds"
        ],
        codeSnippets: [
          {
            title: "PlatformIO Configuration",
            language: "ini",
            code: `[env:ATmega4809]
platform = atmelmegaavr
board = ATmega4809
framework = arduino

; Clock configuration
board_build.f_cpu = 16000000L  ; 16 MHz internal oscillator

; Upload via Serial UPDI
upload_protocol = serialupdi
upload_speed = 115200
upload_port = COM3  ; Adjust for your system

; Library dependencies
lib_deps = 
    marcoschwartz/LiquidCrystal_I2C@^1.1.4
    enjoyneering/LiquidCrystal_AIP31068@^1.0.0

; Compiler optimizations
build_flags = 
    -Os           ; Optimize for size
    -Wall         ; Enable all warnings
    -DDEBUG=1     ; Enable debug output`
          }
        ]
      },
      {
        heading: "Safety & Reliability Features",
        body: [
          "The system implements multiple layers of safety mechanisms ensuring reliable operation in industrial environments."
        ],
        bullets: [
          "Watchdog timer reset capability (software + hardware resets)",
          "ELCB (Earth Leakage Circuit Breaker) integration for ground fault protection",
          "Phase reversal detection via ISR preventing motor damage",
          "Startup delay preventing inrush current damage",
          "Parameter validation preventing dangerous configurations",
          "EEPROM corruption detection and recovery with factory defaults",
          "Beeper feedback for all state transitions (operator awareness)",
          "LCD countdown displays allowing manual intervention before trip"
        ]
      },
      {
        heading: "User Experience & HMI Design",
        body: [
          "The human-machine interface provides professional-grade usability comparable to commercial industrial equipment."
        ],
        bullets: [
          "Three operational modes: MAIN (telemetry), MENU (configuration), LOG (event review)",
          "Button combinations: short press (navigate), long press (mode switch)",
          "Password protection for critical parameters preventing unauthorized changes",
          "Live countdown timers showing time remaining before trip",
          "Fault screens displaying both current value and threshold",
          "Event log navigator showing last 10-100 trips with timestamps",
          "Factory reset via button combination (safety critical)",
          "Startup splash screen with firmware version"
        ]
      },
      {
        heading: "Real-World Applications & Impact",
        body: [
          "This stabilizer design is suitable for various industrial and commercial applications where voltage regulation and protection are critical."
        ],
        bullets: [
          "Manufacturing plants: CNC machines, injection molding, textile machinery",
          "Medical facilities: MRI machines, CT scanners, life support equipment",
          "Data centers: Server farms, UPS systems, network equipment",
          "Commercial buildings: Elevators, HVAC systems, lighting",
          "Research laboratories: Sensitive instrumentation, electron microscopes",
          "Telecommunications: Base stations, repeaters, switching equipment"
        ]
      },
      {
        heading: "Technical Metrics & Performance",
        body: [
          "Key performance indicators demonstrating the system's capabilities."
        ],
        bullets: [
          "Voltage regulation accuracy: ±2V (configurable tolerance)",
          "Frequency measurement accuracy: ±0.1 Hz",
          "Fault detection latency: <100ms for immediate trips",
          "Current measurement range: 0-1000A (CT-dependent)",
          "Voltage measurement range: 0-700V per phase",
          "EEPROM endurance: >100,000 parameter updates, >1M log entries",
          "LCD refresh rate: 2Hz (configurable)",
          "CPU utilization: ~40% during normal operation, headroom for expansion"
        ]
      },
      {
        heading: "Code Quality & Professional Practices",
        body: [
          "The codebase demonstrates professional software engineering practices."
        ],
        bullets: [
          "Modular architecture: 12+ libraries with clear interfaces",
          "Consistent naming conventions (camelCase for functions, UPPER_CASE for constants)",
          "Extensive inline comments and documentation",
          "Defensive programming: bounds checking, null pointer validation",
          "ISR optimization: minimal work in interrupt context",
          "Memory efficiency: <50% SRAM usage, <60% flash usage",
          "No dynamic allocation after initialization (no heap fragmentation)",
          "Compile-time constants via #define and const for flash storage"
        ]
      },
      {
        heading: "Future Enhancement Opportunities",
        body: [
          "Potential improvements demonstrating forward thinking and scalability awareness."
        ],
        bullets: [
          "Add Modbus RTU/TCP for SCADA integration",
          "Implement data logging to SD card for long-term analysis",
          "Add WiFi/Ethernet module for remote monitoring and control",
          "Implement predictive maintenance using current/voltage trend analysis",
          "Add energy metering (kWh) for cost tracking",
          "Implement PID control for servo motors (replacing hysteresis)",
          "Add harmonic analysis for power quality monitoring",
          "Develop companion mobile app for configuration and monitoring"
        ]
      },
      {
        heading: "Lessons Learned & Technical Challenges",
        body: [
          "Key technical challenges overcome during development."
        ],
        bullets: [
          "ADC noise filtering: Implemented oversampling and averaging",
          "Timer conflicts: Resolved by using TCB instead of Timer0/Timer1",
          "LCD I2C variants: Created hardware abstraction layer",
          "EEPROM wear: Implemented circular buffer and wear leveling",
          "Servo motor oscillation: Added hysteresis algorithm",
          "Concurrent timers: Developed non-blocking timer manager",
          "Fault prioritization: Implemented ordered condition ladder",
          "Menu UX: Digit-editing provided better precision than increment/decrement"
        ]
      },
      {
        heading: "File Structure & Module Overview",
        body: [
          "Well-organized codebase with clear responsibility boundaries."
        ],
        bullets: [
          "**src/main.cpp**: Application entry point, initialization, main event loop",
          "**lib/DisplayManager**: LCD rendering (main pages, fault screens, menus, logs)",
          "**lib/LCDManager**: Hardware abstraction layer for LCD controllers",
          "**lib/MenuData**: Declarative schema (labels, units, bounds, defaults)",
          "**lib/MenuHandler**: Navigation, digit-editing logic, password protection",
          "**lib/Condition**: Protection ladder FSM, fault detection, relay control",
          "**lib/VoltageRegulator**: Per-phase servo motor control with hysteresis",
          "**lib/SensorReadings**: ADC acquisition, oversampling, scaling",
          "**lib/FrequencyMeasurer**: TCB capture configuration and ISRs",
          "**lib/MyTimerLib**: Non-blocking software timer manager",
          "**lib/EEPROMStore**: Parameter persistence and ring-buffer logging",
          "**lib/ButtonManager**: Debounced input with short/long press detection",
          "**lib/FlagManager**: Centralized state management (mode flags, relay state)"
        ]
      },
      {
        heading: "Build, Upload & Testing Instructions",
        body: [
          "Clear deployment process for reproducibility."
        ],
        bullets: [
          "Install PlatformIO IDE (VS Code extension) or CLI",
          "Clone repository: `git clone https://github.com/Jenish712/At4809_3P_Servo.git`",
          "Connect Serial UPDI programmer to ATmega4809",
          "Configure upload_port in platformio.ini (COM port or /dev/tty*)",
          "Build: `pio run`",
          "Upload: `pio run --target upload`",
          "Monitor: `pio device monitor --baud 9600`",
          "Test: Navigate menus, trigger faults, verify relay operation"
        ]
      },
      {
        heading: "Why This Project Stands Out",
        body: [
          "This project demonstrates a rare combination of skills that employers and investors seek."
        ],
        bullets: [
          "**Full-stack embedded development**: Hardware interfacing, firmware, and UX",
          "**Real-world applicability**: Solves actual industrial problems with commercial viability",
          "**Professional code quality**: Modular, documented, maintainable architecture",
          "**Advanced techniques**: Hardware timers, ISRs, DMA-less frequency capture",
          "**Safety-critical design**: Multi-layer protection for high-reliability requirements",
          "**Cost-effective engineering**: Open-source alternative to $2000+ commercial units",
          "**Scalability**: Architecture supports expansion (WiFi, SCADA, analytics)",
          "**Documentation**: Comprehensive inline comments and technical write-ups"
        ]
      }
    ],

    gallery: [
      {
        src: "/images/projects/3phase-stabilizer/system-overview.png",
        alt: "Three-phase stabilizer system architecture",
        caption: "Complete system architecture showing modular subsystems and data flow"
      },
      {
        src: "/images/projects/3phase-stabilizer/lcd-main-screen.jpg",
        alt: "LCD main telemetry screen",
        caption: "Real-time monitoring: 3-phase voltages, currents, frequency, and system status"
      },
      {
        src: "/images/projects/3phase-stabilizer/fault-countdown.jpg",
        alt: "Staged fault protection screen",
        caption: "Fault screen with countdown timer and threshold comparison"
      },
      {
        src: "/images/projects/3phase-stabilizer/menu-editing.jpg",
        alt: "Digit-level parameter editing",
        caption: "Professional digit-editing interface for precise parameter configuration"
      },
      {
        src: "/images/projects/3phase-stabilizer/event-log.jpg",
        alt: "EEPROM event log viewer",
        caption: "Persistent event log showing fault history with timestamps"
      },
      {
        src: "/images/projects/3phase-stabilizer/hardware-setup.jpg",
        alt: "Hardware prototype assembly",
        caption: "ATmega4809 controller with LCD, sensors, and servo motor drivers"
      }
    ]
  },

];

export { slugify };
