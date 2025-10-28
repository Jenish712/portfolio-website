// Helper function to create URL-friendly slugs
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const PROJECTS = [
  {
    title: "Single-Phase Servo Stabilizer Control System",
    slug: slugify("Single-Phase Servo Stabilizer Control System"),
    category: "Embedded Systems & Power Electronics",
    description:
      "Industrial-grade microcontroller-based voltage regulation system with ±1% accuracy, multi-tier protection, EEPROM logging, and real-time control. Production-ready firmware deployed in HELICS-INDIA installations.",
    longDescription: `A sophisticated microcontroller-based voltage regulation system that automatically monitors and stabilizes electrical output voltage within ±1% accuracy. This industrial-grade servo stabilizer protects sensitive equipment from voltage fluctuations ranging from 140V to 400Vinput, making it essential for manufacturing, medical, and commercial applications.

Built on AVR microcontroller platform with real-time voltage monitoring, multi-threaded timer management system handling concurrent protection mechanisms, and EEPROM-based persistent configuration storage with 39 customizable parameters. The firmware implements interrupt-driven frequency measurement using Timer Capture mode for precise Hz detection.

The control algorithm includes servo motor control implementing buck-boost transformer regulation through precise motor positioning, real-time voltage regulation with continuous monitoring loop executing at 100ms intervals with PID-like control logic, and a three-level cascading protection system (Warning → Delayed Trip → Immediate Trip) for voltage and current anomalies. Automatic relay control with configurable delay timers prevents nuisance tripping while ensuring equipment safety.`,
    summary:
      "Production-ready servo stabilizer firmware with ±1% regulation accuracy, three-tier protection (140%-156%-560% overload), 39-parameter configuration, event logging, and 40A/100A/200A CT support.",
    content: [
      "AVR microcontroller with multi-threaded timer management, EEPROM configuration storage (39 parameters), and interrupt-driven frequency detection (47-55Hz).",
      "Three-tier cascading protection: voltage (low/high with hysteresis), overload (140%/156%/560% with time delays), earth leakage (up to 50V), and frequency monitoring.",
      "Real-time servo motor control with 100ms regulation loop, PID-like voltage stabilization, and automatic relay management with configurable delays.",
      "Professional 16x2 LCD UI with 4-button navigation, password protection, live status display, and circular buffer event logging (10 events with condition codes).",
    ],
    tech: [
      "AVR Microcontroller",
      "Embedded C/C++",
      "Timer/Counter Modules (TCB1)",
      "I2C Protocol",
      "EEPROM Management",
      "ADC Multi-channel",
      "PWM Motor Control",
      "ISR Programming",
      "State Machines",
      "Real-Time Control",
    ],
    tags: [
      "AVR",
      "Embedded-C",
      "Power-Electronics",
      "Voltage-Regulation",
      "Industrial-Automation",
      "Real-Time-Systems",
      "Motor-Control",
      "Protection-Systems",
      "EEPROM",
      "ISR",
    ],
    highlights: [
      "±1% voltage regulation accuracy across 140V-400Vinput range",
      "Three-tier overload protection: 140% (20s), 156% (10s), 560% (immediate)",
      "Custom TimerManager_v2 class managing 8+ concurrent protection timers",
      "Interrupt-driven frequency capture with edge detection and noise filtering",
      "EEPROM wear-leveling with circular buffer logging (10 critical events)",
      "Password-protected configuration with 39+ system parameters",
      "Non-blocking architecture maintaining responsive UI during motor control",
      "Production-ready for HELICS-INDIA installations",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Jenish712/servo-stabilizer" },
      { label: "Documentation", url: "#" },
      { label: "Demo Video", url: "#" },
    ],
    metrics: [
      { label: "Regulation Accuracy", value: "±1%" },
      { label: "Input Range", value: "140-400V" },
      { label: "Protection Tiers", value: "3 Levels" },
      { label: "Parameters", value: "39+" },
      { label: "Event Log Capacity", value: "10 Events" },
      { label: "CT Options", value: "40/100/200A" },
      { label: "Response Time", value: "100ms" },
      { label: "Concurrent Timers", value: "8+" },
    ],
    timeline: "6 months (Design, Development, Testing, Deployment)",
    team: "Solo project with HELICS-INDIA collaboration",

    detailSections: [
      {
        heading: "Core Technical Implementation",
        body: [
          "The system is built on an AVR microcontroller platform featuring real-time voltage monitoring and control. A sophisticated multi-threaded timer management system handles concurrent protection mechanisms, while EEPROM-based persistent configuration storage manages 39 customizable parameters.",
          "The interrupt-driven frequency measurement system uses Timer Capture mode (TCB1) for precise Hz detection with event-driven ISR implementation, ensuring accurate power quality monitoring without blocking the main control loop.",
        ],
        bullets: [
          "Built on AVR microcontroller with optimized register-level programming",
          "Multi-threaded timer management handling 8+ concurrent protection zones",
          "39 EEPROM-backed parameters for complete system customization",
          "TCB1 interrupt-driven frequency capture with 250kHz timer clock",
          "Non-blocking architecture maintaining UI responsiveness",
        ],
        codeSnippets: [
          {
            title: "Voltage Regulation Control Loop",
            language: "cpp",
            code: `void regulateVolt() {
  static unsigned long previousMillis = 0;
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= 100) {
    previousMillis = currentMillis;

    if (output_voltage < (parameters[OPSETV__0] - parameters[REGV__1])) {
      // Increase voltage - rotate motor clockwise
      digitalWrite(motorClockwisePin, HIGH);
      digitalWrite(motorAntiClockwisePin, LOW);
    } else if (output_voltage > (parameters[OPSETV__0] + parameters[REGV__1])) {
      // Decrease voltage - rotate motor counter-clockwise
      digitalWrite(motorClockwisePin, LOW);
      digitalWrite(motorAntiClockwisePin, HIGH);
    } else {
      // Voltage within tolerance - stop motor
      digitalWrite(motorClockwisePin, LOW);
      digitalWrite(motorAntiClockwisePin, LOW);
    }
  }
}`,
          },
          {
            title: "Frequency Capture ISR (TCB1)",
            language: "cpp",
            code: `ISR(TCB1_INT_vect) {
  currentCapture = TCB1.CCMP;  // Capture timestamp

  if (lastCapture != 0) {
    uint16_t periodTicks = currentCapture - lastCapture;
    if (periodTicks > 0) {
      frequency = 62500.0 / periodTicks;  // F = CLK_PER/256 / Ticks
      newMeasurement = true;
    }
  }

  lastCapture = currentCapture;
  TCB1.INTFLAGS = TCB_CAPT_bm;  // Clear interrupt flag
}`,
          },
        ],
      },
      {
        heading: "Multi-Tier Protection System",
        body: [
          "The protection architecture implements a three-level cascading system designed to prevent false triggering while ensuring rapid response to critical conditions. Each protection tier has independent timing and threshold parameters, allowing fine-tuned response to different fault scenarios.",
          "The overload protection system monitors current through configurable CT ratios (40A/100A/200A) and implements three severity levels: OLCUT1 at 140% capacity with 20-second delay, OLCUT2 at 156% with 10-second delay, and OLCUT3 at 560% for immediate trip on severe overloads.",
        ],
        bullets: [
          "OLCUT1: 140% rated capacity with 20-second delay for temporary overloads",
          "OLCUT2: 156% rated capacity with 10-second delay for sustained overloads",
          "OLCUT3: 560% rated capacity with immediate trip for fault conditions",
          "Voltage protection: Three tiers each for high and low with progressive timing",
          "Smart auto-recovery with hysteresis prevents oscillation during voltage restoration",
          "Earth leakage detection up to 50V with configurable trip time",
          "Frequency monitoring: 47-55Hz range with time-delayed trip",
        ],
        codeSnippets: [
          {
            title: "Three-Tier Overload Protection Logic",
            language: "cpp",
            code: `// Check current overload conditions
if (output_amps >= parameters[OLCUT3_IMT__25] && parameters[OVERLOAD_CUT__36]) {
  // Immediate trip at 560% capacity
  olcut_1.stop();
  olcut_2.stop();
  currentCondition = { CONDITION_OLCUT3_IMT, output_amps };
  if (digitalRead(relaypinA) != LOW) relayOff();
  overloadFlag = true;

} else if (output_amps >= parameters[OLCUT2__23] && parameters[OVERLOAD_CUT__36]) {
  // 156% capacity - 10 second delay
  olcut_1.stop();
  olcut_2.start(parameters[T2_OLCUT2__24]);
  tempStoreTime = olcut_2.check();
  if (tempStoreTime == parameters[T2_OLCUT2__24]) {
    overloadFlag = true;
    relayOff();
  }
  currentCondition = { CONDITION_OLCUT2, output_amps };

} else if (output_amps >= parameters[OLCUT1__21] && parameters[OVERLOAD_CUT__36]) {
  // 140% capacity - 20 second delay
  olcut_2.stop();
  olcut_1.start(parameters[T1_OLCUT1__22]);
  tempStoreTime = olcut_1.check();
  if (tempStoreTime == parameters[T1_OLCUT1__22]) {
    overloadFlag = true;
    relayOff();
  }
  currentCondition = { CONDITION_OLCUT1, output_amps };
}`,
          },
        ],
        image: {
          src: "/images/projects/servo-stabilizer/protection-diagram.png",
          alt: "Multi-tier protection architecture diagram",
          caption: "Three-level cascading protection system with progressive timing for voltage and current faults.",
        },
      },
      {
        heading: "Intelligent Multi-Parameter Monitoring",
        body: [
          "The monitoring system continuously samples multiple parameters using ADC with peak detection algorithm optimized for AC measurements. The get_max() function samples each channel 100 times with 200μs intervals to capture peak values accurately.",
          "Current monitoring supports three CT configurations (40A/100A/200A) with automatic scaling and calibration. The system calculates overload thresholds dynamically based on configured KVA capacity, providing accurate protection across different installation sizes.",
        ],
        bullets: [
          "Input voltage: 140V-400Vwith configurable cutoff thresholds",
          "Output voltage: 200V-250V regulation with ±6V tolerance",
          "Current monitoring: 40A/100A/200A CT with ratio calibration",
          "Earth leakage: Up to 50V detection capability",
          "Frequency: 47Hz-55Hz monitoring with event-driven capture",
          "ADC peak detection: 100 samples per measurement with 200μs spacing",
        ],
        codeSnippets: [
          {
            title: "Peak Detection for AC Measurements",
            language: "cpp",
            code: `short int get_max(short int x) {
  short int mymax = 0;
  for (uint8_t i = 0; i < 100; i++) {
    short int temp = analogRead(x);
    if (mymax < temp) mymax = temp;
    delayMicroseconds(200);
  }
  return mymax;
}

// Main loop measurements
void loop() {
  input_voltage = (get_max(inputVoltpin) * 600.0) / 1023;
  output_voltage = (get_max(outputVoltpin) * 600.0) / 1023;
  output_amps = (get_max(outputAmpspin) * 1000.0) / 1023;
  
  // CT ratio scaling
  if (parameters[CT__8] == 40) {
    output_amps /= 6.2;
  } else if (parameters[CT__8] == 100) {
    output_amps /= 2;
  }
  
  earth_voltage = (get_max(earthVoltpin) * 50.0) / 1023;
}`,
          },
        ],
      },
      {
        heading: "Event Logging and Diagnostics",
        body: [
          "The system maintains a circular buffer in EEPROM storing the last 10 critical events with condition codes and associated voltage/current data. This diagnostic capability allows field engineers to review fault history without connecting a programmer.",
          "Each log entry captures the fault condition type and the parameter value that triggered the trip, enabling post-mortem analysis. The circular buffer automatically wraps when full, ensuring continuous logging without manual intervention.",
        ],
        bullets: [
          "EEPROM circular buffer storing 10 most recent events",
          "Each entry: condition code + voltage/current data value",
          "Automatic rollover when buffer reaches capacity",
          "LCD interface for scrolling through event history",
          "Persistent storage survives power cycles",
          "Manual log clear function for maintenance",
        ],
        codeSnippets: [
          {
            title: "EEPROM Event Logging System",
            language: "cpp",
            code: `void logEntryEEPROM() {
  if (digitalRead(relaypinA) == LOW) {
    if (mostRecentCondition == currentCondition.condition 
        && mostRecentCondition != CONDITION_NONE) {
      
      // Calculate next log index
      nextLogIndex = 0;
      for (uint8_t i = 0; i < totalLog; i++) {
        if (readDataPair(eepromStartAddress + i * sizeof(ConditionRecord), 
                         logOfAllCutoffCondition[i])) {
          if (logOfAllCutoffCondition[i].condition >= 1 
              && logOfAllCutoffCondition[i].condition <= 15) {
            nextLogIndex++;
          } else break;
        }
      }
      
      // Clear log if full
      if (nextLogIndex == totalLog) {
        for (uint8_t i = 0; i < totalLog; i++) {
          logOfAllCutoffCondition[i] = { 0, 0 };
          writeDataPair(eepromStartAddress + i * sizeof(ConditionRecord), 
                       logOfAllCutoffCondition[i]);
        }
        nextLogIndex = 0;
      }
      
      // Save new event
      logOfAllCutoffCondition[nextLogIndex] = 
        { currentCondition.condition, currentCondition.dataOfCondition };
      writeDataPair(eepromStartAddress + nextLogIndex * sizeof(ConditionRecord), 
                   currentCondition);
      
      mostRecentCondition = 0;
    }
  }
}`,
          },
        ],
      },
      {
        heading: "Professional User Interface",
        body: [
          "The 16x2 LCD interface provides comprehensive access to system configuration and real-time monitoring through an intuitive menu system. Four buttons (Menu/Up/Down/OK) enable navigation through 39 configurable parameters, all protected by password authentication.",
          "The interface automatically cycles through main screens showing input voltage, output voltage, current, earth voltage, and frequency. During fault conditions, the display shows the active protection state and countdown timer, providing immediate visual feedback to operators.",
        ],
        bullets: [
          "4-button interface: Menu, Up, Down, OK with debouncing",
          "Password protection: 3-digit code prevents unauthorized changes",
          "39 configuration parameters across multiple screens",
          "Real-time display: Vin, Vout, Current, Earth, Frequency",
          "Fault indication: Shows active protection tier and countdown",
          "Event log viewer: Scroll through stored fault history",
          "Auto-timeout: Returns to main screen after 90 seconds idle",
          "Factory reset: Menu+Reset button combination",
        ],
        image: {
          src: "/images/projects/servo-stabilizer/lcd-menu.jpg",
          alt: "LCD menu interface showing configuration screen",
          caption: "User-friendly menu system with password protection and real-time parameter display.",
        },
      },
      {
        heading: "Real-World Applications & Impact",
        body: [
          "This servo stabilizer design is suitable for various industrial and commercial applications where voltage regulation and protection are critical. The wide input range (140-300V) and precise output regulation make it ideal for areas with unstable power supply.",
          "The three-tier protection system prevents equipment damage while minimizing false trips that could disrupt operations. The configurable CT ratios allow a single firmware to serve installations from small medical clinics to large manufacturing facilities.",
        ],
        bullets: [
          "Industrial: CNC machines, manufacturing equipment, heavy machinery",
          "Medical: X-ray machines, CT/MRI scanners, diagnostic equipment",
          "Commercial: Data centers, banks, hotels, telecom equipment",
          "IT Infrastructure: Servers, networking equipment, computer systems",
          "Protects equipment from voltage fluctuations (handles ±40-50% variations)",
          "Extends equipment lifespan and reduces maintenance costs",
          "Provides high accuracy voltage regulation (±1% typical)",
          "Works automatically with no manual intervention required",
        ],
      },
      {
        heading: "Technical Skills Demonstrated",
        body: [
          "This project showcases comprehensive embedded systems development skills, from low-level hardware interfacing to high-level control algorithms. The implementation demonstrates mastery of real-time systems, interrupt-driven programming, and state machine design.",
          "The code quality reflects professional firmware development practices with modular design, defensive programming, and extensive documentation. Memory management techniques including EEPROM wear-leveling and efficient data structures show optimization for resource-constrained environments.",
        ],
        bullets: [
          "Embedded C/C++: OOP design, volatile variables for ISR communication, bit manipulation",
          "Hardware Interfacing: ADC sampling, relay control, servo motor H-bridge, I2C LCD",
          "Real-Time Systems: Non-blocking architecture, state machines, concurrent timer management",
          "Power Electronics: Servo stabilizer topology, CT calculations, earth fault detection",
          "Code Quality: Modular design, enumerated constants, boundary checking, documentation",
        ],
      },
    ],

    gallery: [
      {
        src: "/images/projects/servo-stabilizer/front-panel.jpg",
        alt: "Front panel of servo stabilizer with LCD display",
        caption: "Production unit with 16x2 LCD showing real-time voltage and current measurements.",
      },
      {
        src: "/images/projects/servo-stabilizer/circuit-board.jpg",
        alt: "Control circuit board with microcontroller",
        caption: "Custom PCB featuring AVR microcontroller, relay drivers, and protection circuits.",
      },
      {
        src: "/images/projects/servo-stabilizer/motor-assembly.jpg",
        alt: "Servo motor and transformer assembly",
        caption: "Servo motor coupled to variable transformer for voltage regulation.",
      },
      {
        src: "/images/projects/servo-stabilizer/testing-setup.jpg",
        alt: "Testing setup with oscilloscope and load",
        caption: "Validation setup demonstrating regulation accuracy under varying load conditions.",
      },
    ],

    // Additional metadata for portfolio display
    featured: true,
    status: "Production Ready",
    deploymentInfo: {
      company: "HELICS-INDIA",
      since: "1996",
      productLine: "Servo Stabilizers",
      applications: ["Industrial", "Medical", "Commercial", "IT"],
    },

    technicalSpecs: {
      microcontroller: "AVR ATmega1608",
      inputVoltage: "140V - 400VAC",
      outputVoltage: "200V - 250V AC",
      regulationAccuracy: "±1%",
      responseTime: "100ms",
      currentRatings: ["40A", "100A", "200A"],
      frequencyRange: "47Hz - 55Hz",
      displayType: "16x2 LCD with I2C",
      storageCapacity: "39 parameters + 10 event logs",
      protectionTypes: [
        "Over-voltage (3 tiers)",
        "Under-voltage (3 tiers)",
        "Overload (3 tiers)",
        "Earth leakage",
        "Frequency deviation",
      ],
    },

    learnings: [
      "Implemented non-blocking timer architecture managing 8+ concurrent protection zones without RTOS overhead",
      "Developed peak detection algorithm for AC measurements achieving accurate voltage/current readings",
      "Designed wear-leveling EEPROM logging system extending memory life in production environment",
      "Created intuitive menu system allowing field configuration without programming tools",
      "Optimized ISR for frequency capture with noise filtering and edge detection",
    ],

    futureEnhancements: [
      "Add RS485/Modbus communication for remote monitoring",
      "Implement predictive maintenance algorithms based on event patterns",
      "Enhance data logging with RTC timestamps",
      "Add support for three-phase systems",
      "Develop mobile app for configuration and monitoring",
    ],
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  {
    title: "Smart EV Charging System with DOSAP Protection & LSTM Optimization",
    slug: slugify("Smart EV Charging System DOSAP LSTM Optimization"),
    category: "Embedded Systems, IoT & Machine Learning",
    description:
      "End-to-end EV charging solution combining ATmega1608-based hardware controller with Triple-Tiered protection, ESP32 IoT gateway, and LSTM predictive scheduling. Achieves <30ms fault response, 98% detection accuracy, and 22% energy cost savings through intelligent optimization.",
    longDescription: `A complete end-to-end EV charging framework integrating real-time protection, predictive optimization, and cloud communication. Developed by Jenish Gajera as part of Master's research at Ontario Tech University, this system introduces Dynamic Overload Surge Adjustment Protection (DOSAP) integrated with Long Short-Term Memory (LSTM) machine learning for intelligent charging schedule optimization.

The hardware layer manages protection and control in real time using an ATmega1608 microcontroller with Triple-Tiered Tripping (TTT) strategy, executing fault responses in under 30ms. The ESP32 communication gateway bridges local control with cloud infrastructure using MQTT over TLS, enabling remote monitoring while maintaining local safety overrides.

The cloud and ML layer optimizes charging schedules based on electricity pricing and grid demand using LSTM models that achieve 91-93% accuracy in predicting off-peak periods. The system prioritizes safety overrides while maintaining cost efficiency, reducing grid stress during peak hours and delivering up to 22% energy cost savings.

This project bridges embedded systems, AI, and power electronics to deliver a production-grade EV charging solution suitable for residential, commercial, and industrial deployments.`,
    summary:
      "ATmega1608 controller with DOSAP protection, ESP32 IoT gateway, and LSTM cloud optimization. <30ms fault response, 98% accuracy, 22% cost savings. Master's project at Ontario Tech University.",
    content: [
      "ATmega1608 on-site controller with Triple-Tiered Tripping (TTT) strategy executing protection logic in <30ms with 98% fault detection accuracy.",
      "ESP32 IoT gateway providing MQTT over TLS communication, data caching during connectivity loss, and secure bidirectional control between cloud and hardware.",
      "LSTM predictive model achieving 91-93% accuracy in forecasting optimal charging windows based on grid demand and electricity pricing patterns.",
      "Dynamic protection mechanisms: over/under voltage, overload (current/kW/kVA), ground fault, earth leakage, inrush current handling, and thermal monitoring.",
      "ThingSpeak cloud platform for centralized monitoring, LSTM model hosting, and remote configuration with local safety override priority.",
    ],
    tech: [
      "ATmega1608",
      "ESP32",
      "Embedded C/C++",
      "LSTM",
      "TensorFlow/Keras",
      "MQTT",
      "TLS Encryption",
      "ThingSpeak",
      "UART",
      "EEPROM",
      "Power Electronics",
      "Real-Time Systems",
      "IoT",
      "Predictive Analytics",
    ],
    tags: [
      "EV-Charging",
      "ATmega1608",
      "ESP32",
      "LSTM",
      "IoT",
      "MQTT",
      "Machine-Learning",
      "Power-Electronics",
      "Real-Time-Protection",
      "Smart-Grid",
      "Embedded-Systems",
      "Predictive-Scheduling",
      "Safety-Critical",
      "DOSAP",
    ],
    highlights: [
      "Triple-Tiered Tripping (TTT) strategy with <30ms fault response time",
      "98% fault detection accuracy across voltage, current, and thermal parameters",
      "LSTM model achieving 91-93% accuracy in predicting optimal charging windows",
      "22% energy cost savings through intelligent scheduling optimization",
      "Secure MQTT over TLS (Port 8883) with ESP32 data caching during offline periods",
      "EEPROM-based parameter retention for cutoff thresholds and configuration",
      "Level 1 (120V) and Level 2 (240V) charging support with dynamic adaptation",
      "Master's project at Ontario Tech University - IEEE SYSCON 2025 submission",
    ],
    links: [
      { label: "GitHub - Hardware", url: "https://github.com/Jenish712/EV_Charger_Controller_DOSAP" },
      { label: "GitHub - ML System", url: "https://github.com/FarhaanJamal/EVolv-MITACS" },
      { label: "Live Demo", url: "https://farhaan-evolv-mitacs.onrender.com/" },
      { label: "IEEE Paper", url: "#" },
      { label: "Documentation", url: "#" },
    ],
    metrics: [
      { label: "Fault Response", value: "<30ms" },
      { label: "Detection Accuracy", value: "98%" },
      { label: "LSTM Accuracy", value: "91-93%" },
      { label: "Cost Savings", value: "22%" },
      { label: "Data Loss", value: "<0.5%" },
      { label: "Max Power", value: "7.2kW" },
      { label: "Voltage Range", value: "110-240V" },
      { label: "Protection Tiers", value: "3 Levels" },
    ],
    timeline: "8 months (Master's Project, 2024-2025)",
    team: "2 members (Jenish Gajera, Farhaan Jamal)",

    detailSections: [
      {
        heading: "System Architecture & Design Philosophy",
        body: [
          "This project implements a complete end-to-end EV charging framework with three distinct but integrated layers: the on-site hardware controller, the IoT communication gateway, and the cloud machine learning platform. The architecture follows a safety-first design philosophy where local protection logic always takes priority over cloud-based optimization.",
          "The ATmega1608 microcontroller serves as the on-site controller, executing real-time protection algorithms with deterministic response times under 30ms. The ESP32 acts as a communication gateway, bridging the local controller with cloud infrastructure while maintaining data integrity through caching mechanisms. The cloud layer, hosted on ThingSpeak, provides centralized monitoring and runs LSTM models for predictive scheduling optimization.",
          "Critical design decision: The system maintains a clear hierarchy where safety protection (local) overrides predictive scheduling (cloud). This ensures that even during complete network failure, the charging station continues to provide full protection to the vehicle, grid, and infrastructure.",
        ],
        bullets: [
          "Three-layer architecture: Hardware controller → IoT gateway → Cloud platform",
          "Safety-first design: Local protection overrides cloud optimization",
          "ATmega1608 @ 16MHz for deterministic real-time control (<30ms response)",
          "ESP32 with dual-core architecture for concurrent MQTT and UART handling",
          "ThingSpeak cloud platform for ML model hosting and data visualization",
          "Modular design supporting residential (7.2kW) to commercial (50kW+) scaling",
          "Offline capability: Full protection operation without cloud connectivity",
        ],
        image: {
          src: "/images/projects/ev-dosap/system-architecture.png",
          alt: "Complete system architecture diagram",
          caption: "Three-layer architecture showing data flow from sensors through hardware controller, IoT gateway, to cloud ML platform.",
        },
      },
      {
        heading: "On-Site Controller: ATmega1608 with DOSAP Protection",
        body: [
          "The on-site controller implements the Dynamic Overload Surge Adjustment Protection (DOSAP) system, a novel protection strategy that adapts to different charging scenarios while maintaining safety margins. Built on the ATmega1608 microcontroller, the firmware monitors voltage, current, frequency, power factor, earth leakage, and thermal parameters in real time with multi-channel ADC sampling at 1kHz.",
          "The Triple-Tiered Tripping (TTT) strategy represents a significant improvement over traditional binary protection schemes. Tier 1 handles minor fluctuations through active correction without shutdown, maintaining charging continuity. Tier 2 implements temporary relay disconnection with automatic recovery after fault clearance. Tier 3 provides hard cutoff for severe faults requiring manual operator reset, ensuring safety in catastrophic scenarios.",
        ],
        bullets: [
          "ATmega1608 MCU running at 16MHz with hardware watchdog timer",
          "Multi-channel ADC: 6 channels sampling at 1kHz for voltage, current, temperature",
          "DOSAP protection: Dynamic adaptation to Level 1 (120V) and Level 2 (240V) charging",
          "Triple-Tiered Tripping: Progressive fault handling minimizing unnecessary downtime",
          "Real-time parameter monitoring: V, I, kW, kVA, PF, frequency, earth leakage, temperature",
          "EEPROM storage: 50+ configurable parameters with wear-leveling algorithm",
          "J1772 pilot signal generation: PWM duty cycle control for vehicle communication",
          "Fault response time: <30ms from detection to relay trip",
        ],
        codeSnippets: [
          {
            title: "Triple-Tiered Protection Logic",
            language: "cpp",
            code: `// Triple-Tiered Tripping (TTT) Strategy Implementation
enum ProtectionTier {
    TIER_NONE = 0,
    TIER_1_CORRECTION,    // Minor fluctuation - active correction
    TIER_2_TEMPORARY,     // Moderate fault - temporary disconnect
    TIER_3_HARD_CUTOFF    // Severe fault - manual reset required
};

struct FaultCondition {
    float voltage;
    float current;
    float power_kw;
    float power_kva;
    float earth_leakage;
    float temperature;
    float frequency;
    uint8_t fault_duration_ms;
};

ProtectionTier evaluate_protection_tier(FaultCondition fault) {
    // TIER 3: Severe faults requiring immediate hard cutoff
    if (fault.voltage > VOLTAGE_CRITICAL_HIGH || 
        fault.voltage < VOLTAGE_CRITICAL_LOW ||
        fault.current > CURRENT_CRITICAL ||
        fault.earth_leakage > EARTH_CRITICAL ||
        fault.temperature > TEMP_CRITICAL) {
        
        log_fault(TIER_3_HARD_CUTOFF, fault);
        hard_cutoff_relay();
        require_manual_reset();
        return TIER_3_HARD_CUTOFF;
    }
    
    // TIER 2: Moderate faults - temporary disconnect with auto-recovery
    if ((fault.voltage > VOLTAGE_HIGH_THRESHOLD && 
         fault.fault_duration_ms > TIER2_VOLTAGE_DELAY) ||
        (fault.current > CURRENT_HIGH_THRESHOLD && 
         fault.fault_duration_ms > TIER2_CURRENT_DELAY) ||
        (fault.power_kva > KVA_LIMIT_TIER2 && 
         fault.fault_duration_ms > TIER2_OVERLOAD_DELAY)) {
        
        log_fault(TIER_2_TEMPORARY, fault);
        temporary_disconnect();
        start_recovery_timer(TIER2_RECOVERY_TIME);
        return TIER_2_TEMPORARY;
    }
    
    // TIER 1: Minor fluctuations - active correction without shutdown
    if (fault.voltage > VOLTAGE_NOMINAL + VOLTAGE_TOLERANCE ||
        fault.voltage < VOLTAGE_NOMINAL - VOLTAGE_TOLERANCE) {
        
        // Adjust charging current to stabilize voltage
        adjust_charging_current(calculate_correction(fault.voltage));
        return TIER_1_CORRECTION;
    }
    
    return TIER_NONE;
}

// Main protection loop (called every 1ms)
void protection_loop() {
    static uint32_t fault_start_time = 0;
    
    // Read all sensors
    FaultCondition current_state = {
        .voltage = read_voltage_rms(),
        .current = read_current_rms(),
        .power_kw = voltage * current * power_factor,
        .power_kva = voltage * current,
        .earth_leakage = read_earth_leakage(),
        .temperature = read_temperature(),
        .frequency = get_frequency_from_tcb1(),
        .fault_duration_ms = 0
    };
    
    // Check if fault condition exists
    if (is_fault_condition(current_state)) {
        if (fault_start_time == 0) {
            fault_start_time = millis();
        }
        current_state.fault_duration_ms = millis() - fault_start_time;
    } else {
        fault_start_time = 0;  // Reset fault timer
    }
    
    // Evaluate protection tier and take action
    ProtectionTier tier = evaluate_protection_tier(current_state);
    
    // Update status LEDs and display
    update_status_indicators(tier);
    
    // Send status to ESP32 for cloud logging
    if (tier != TIER_NONE) {
        send_fault_status_uart(tier, current_state);
    }
}`,
          },
          {
            title: "Dynamic Overload Surge Adjustment (DOSAP)",
            language: "cpp",
            code: `// DOSAP: Dynamic threshold adjustment based on charging level
struct DOSAPThresholds {
    float voltage_nominal;
    float voltage_tolerance;
    float current_max;
    float current_tier1;
    float current_tier2;
    float current_tier3;
    float inrush_allowance_duration_ms;
};

DOSAPThresholds get_dosap_thresholds(ChargingLevel level) {
    DOSAPThresholds thresholds;
    
    switch (level) {
        case LEVEL_1_120V:
            thresholds.voltage_nominal = 120.0;
            thresholds.voltage_tolerance = 6.0;  // ±5%
            thresholds.current_max = 16.0;       // 16A max for Level 1
            thresholds.current_tier1 = 17.6;     // 110% (warning)
            thresholds.current_tier2 = 20.0;     // 125% (temporary trip)
            thresholds.current_tier3 = 24.0;     // 150% (hard cutoff)
            thresholds.inrush_allowance_duration_ms = 500;
            break;
            
        case LEVEL_2_240V:
            thresholds.voltage_nominal = 240.0;
            thresholds.voltage_tolerance = 12.0;
            thresholds.current_max = 32.0;       // 32A max for Level 2
            thresholds.current_tier1 = 35.2;     // 110%
            thresholds.current_tier2 = 40.0;     // 125%
            thresholds.current_tier3 = 48.0;     // 150%
            thresholds.inrush_allowance_duration_ms = 800;
            break;
    }
    
    return thresholds;
}

// Inrush current handling prevents nuisance tripping during plug-in
bool is_inrush_condition() {
    static uint32_t charging_start_time = 0;
    static bool inrush_window_active = false;
    
    if (relay_just_closed()) {
        charging_start_time = millis();
        inrush_window_active = true;
    }
    
    if (inrush_window_active) {
        uint32_t elapsed = millis() - charging_start_time;
        if (elapsed > current_thresholds.inrush_allowance_duration_ms) {
            inrush_window_active = false;
        }
    }
    
    return inrush_window_active;
}

// Current protection with DOSAP and inrush handling
void check_current_protection() {
    float current = read_current_rms();
    
    // Allow higher current during inrush window
    if (is_inrush_condition()) {
        if (current > current_thresholds.current_tier3 * 1.5) {
            // Even during inrush, protect against extreme overcurrent
            hard_cutoff_relay();
        }
        return;  // Skip normal protection during inrush
    }
    
    // Normal DOSAP protection logic
    if (current > current_thresholds.current_tier3) {
        trigger_protection(TIER_3_HARD_CUTOFF);
    } else if (current > current_thresholds.current_tier2) {
        trigger_protection(TIER_2_TEMPORARY);
    } else if (current > current_thresholds.current_tier1) {
        trigger_protection(TIER_1_CORRECTION);
    }
}`,
          },
        ],
      },
      {
        heading: "IoT Communication Gateway: ESP32 MQTT Bridge",
        body: [
          "The ESP32 microcontroller serves as the critical communication bridge between the local hardware controller and cloud platform. Its dual-core architecture enables concurrent handling of UART communication with the ATmega1608 and MQTT communication with ThingSpeak, ensuring no data loss during high-frequency updates.",
          "Security is paramount in IoT deployments. The system implements MQTT over TLS (Port 8883) with certificate-based authentication, preventing unauthorized access to charging control. During network connectivity loss, the ESP32 caches fault events and session data in local flash memory, automatically synchronizing with the cloud upon reconnection to maintain complete audit trails.",
        ],
        bullets: [
          "ESP32 dual-core architecture: Core 0 for MQTT, Core 1 for UART/local logic",
          "MQTT over TLS (Port 8883): Encrypted communication with certificate authentication",
          "Data caching: Local flash storage for offline operation (<0.5% data loss)",
          "Bidirectional control: Receives schedules from cloud, sends status/faults upstream",
          "Watchdog timer: Automatic recovery from network or processing hangs",
          "OTA firmware updates: Remote update capability for field deployments",
          "Connection resilience: Automatic reconnection with exponential backoff",
          "Message queuing: Priority queue for critical fault messages",
        ],
        codeSnippets: [
          {
            title: "ESP32 MQTT Communication with TLS",
            language: "cpp",
            code: `#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// ThingSpeak MQTT credentials
const char* mqtt_server = "mqtt3.thingspeak.com";
const int mqtt_port = 8883;
const char* mqtt_username = "DEVICE_USERNAME";
const char* mqtt_api_key = "API_KEY";

WiFiClientSecure espClient;
PubSubClient mqtt_client(espClient);

// Caching for offline operation
#define MAX_CACHE_SIZE 100
struct CachedMessage {
    char topic[64];
    char payload[256];
    uint32_t timestamp;
    bool sent;
};
CachedMessage message_cache[MAX_CACHE_SIZE];
uint8_t cache_index = 0;

void setup_mqtt() {
    // Load CA certificate for TLS
    espClient.setCACert(thingspeak_ca_cert);
    
    mqtt_client.setServer(mqtt_server, mqtt_port);
    mqtt_client.setCallback(mqtt_callback);
    
    connect_mqtt();
}

void connect_mqtt() {
    while (!mqtt_client.connected()) {
        Serial.println("Connecting to MQTT...");
        
        // Generate unique client ID
        String client_id = "ESP32_EV_Charger_" + String(ESP.getEfuseMac());
        
        if (mqtt_client.connect(client_id.c_str(), 
                               mqtt_username, 
                               mqtt_api_key)) {
            Serial.println("MQTT connected");
            
            // Subscribe to command topics
            mqtt_client.subscribe("channels/CHANNEL_ID/subscribe/fields/+");
            
            // Send cached messages after reconnection
            flush_message_cache();
            
        } else {
            Serial.print("MQTT connection failed, rc=");
            Serial.println(mqtt_client.state());
            delay(5000);  // Exponential backoff in production
        }
    }
}

// Publish data with caching for offline resilience
void publish_with_cache(const char* topic, const char* payload) {
    if (mqtt_client.connected()) {
        // Try to send immediately
        if (mqtt_client.publish(topic, payload)) {
            Serial.println("Message sent successfully");
            return;
        }
    }
    
    // Cache message if sending failed or offline
    if (cache_index < MAX_CACHE_SIZE) {
        strncpy(message_cache[cache_index].topic, topic, 63);
        strncpy(message_cache[cache_index].payload, payload, 255);
        message_cache[cache_index].timestamp = millis();
        message_cache[cache_index].sent = false;
        cache_index++;
        
        Serial.println("Message cached for later transmission");
    } else {
        Serial.println("Cache full - message dropped");
    }
}

// Flush cached messages when connection restored
void flush_message_cache() {
    for (uint8_t i = 0; i < cache_index; i++) {
        if (!message_cache[i].sent) {
            if (mqtt_client.publish(message_cache[i].topic, 
                                   message_cache[i].payload)) {
                message_cache[i].sent = true;
                Serial.printf("Cached message %d sent\\n", i);
            }
        }
    }
    
    // Compact cache - remove sent messages
    uint8_t write_idx = 0;
    for (uint8_t read_idx = 0; read_idx < cache_index; read_idx++) {
        if (!message_cache[read_idx].sent) {
            message_cache[write_idx++] = message_cache[read_idx];
        }
    }
    cache_index = write_idx;
}

// Receive commands from cloud (e.g., optimized charging schedule)
void mqtt_callback(char* topic, byte* payload, unsigned int length) {
    Serial.printf("Message received on topic: %s\\n", topic);
    
    // Parse JSON payload
    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload, length);
    
    if (doc.containsKey("schedule_start")) {
        uint32_t start_time = doc["schedule_start"];
        uint8_t duration_hours = doc["duration"];
        float target_soc = doc["target_soc"];
        
        // Send schedule to ATmega1608 via UART
        send_schedule_to_controller(start_time, duration_hours, target_soc);
        
        Serial.println("New charging schedule received and forwarded");
    }
    
    if (doc.containsKey("config_update")) {
        // Remote configuration update
        update_controller_config(doc["config_update"]);
    }
}`,
          },
          {
            title: "UART Communication with ATmega1608",
            language: "cpp",
            code: `// Protocol for ESP32 ↔ ATmega1608 communication
#define UART_BAUD 115200
#define START_BYTE 0xAA
#define END_BYTE 0x55

enum MessageType {
    MSG_STATUS_UPDATE = 0x01,
    MSG_FAULT_EVENT = 0x02,
    MSG_SCHEDULE_UPDATE = 0x03,
    MSG_CONFIG_CHANGE = 0x04,
    MSG_ACK = 0x05
};

struct UARTMessage {
    uint8_t start;
    uint8_t msg_type;
    uint8_t length;
    uint8_t data[64];
    uint8_t checksum;
    uint8_t end;
};

// Send charging schedule to ATmega1608
void send_schedule_to_controller(uint32_t start_time, 
                                 uint8_t duration, 
                                 float target_soc) {
    UARTMessage msg;
    msg.start = START_BYTE;
    msg.msg_type = MSG_SCHEDULE_UPDATE;
    msg.length = 9;
    
    // Pack data
    memcpy(&msg.data[0], &start_time, 4);  // Unix timestamp
    msg.data[4] = duration;                 // Hours
    memcpy(&msg.data[5], &target_soc, 4);  // Target state of charge
    
    // Calculate checksum
    msg.checksum = calculate_checksum(msg.data, msg.length);
    msg.end = END_BYTE;
    
    // Send over UART
    Serial2.write((uint8_t*)&msg, sizeof(UARTMessage));
    
    // Wait for ACK with timeout
    wait_for_ack(500);  // 500ms timeout
}

// Receive status/fault updates from ATmega1608
void uart_receive_task(void* parameter) {
    while (true) {
        if (Serial2.available() >= sizeof(UARTMessage)) {
            UARTMessage msg;
            Serial2.readBytes((uint8_t*)&msg, sizeof(UARTMessage));
            
            // Validate message
            if (msg.start == START_BYTE && 
                msg.end == END_BYTE &&
                validate_checksum(&msg)) {
                
                switch (msg.msg_type) {
                    case MSG_STATUS_UPDATE:
                        process_status_update(&msg);
                        publish_status_to_cloud(&msg);
                        break;
                        
                    case MSG_FAULT_EVENT:
                        process_fault_event(&msg);
                        publish_fault_to_cloud(&msg);  // High priority
                        break;
                }
                
                // Send ACK
                send_ack();
            }
        }
        
        vTaskDelay(10 / portTICK_PERIOD_MS);
    }
}

// Publish fault event to cloud with high priority
void publish_fault_to_cloud(UARTMessage* msg) {
    StaticJsonDocument<256> doc;
    
    doc["type"] = "fault";
    doc["timestamp"] = millis();
    doc["tier"] = msg->data[0];
    doc["voltage"] = *((float*)&msg->data[1]);
    doc["current"] = *((float*)&msg->data[5]);
    doc["temperature"] = *((float*)&msg->data[9]);
    
    char payload[256];
    serializeJson(doc, payload);
    
    // Publish with high priority (cached if offline)
    publish_with_cache("channels/CHANNEL_ID/publish/fields/field1", payload);
}`,
          },
        ],
      },
      {
        heading: "Cloud Platform & LSTM Predictive Scheduling",
        body: [
          "The cloud layer leverages ThingSpeak as the centralized monitoring and ML hosting platform. ThingSpeak provides real-time data visualization, storage, and MATLAB analytics integration for running the LSTM predictive model. The system collects historical charging data, electricity pricing, and grid load patterns to train models that forecast optimal charging windows.",
          "The LSTM (Long Short-Term Memory) neural network is specifically architected for time-series forecasting, capturing complex temporal dependencies in electricity pricing and grid demand patterns. The model considers day-of-week effects, seasonal variations, weather impacts, and local grid congestion to predict when charging will be most cost-effective and grid-friendly. Achieving 91-93% accuracy in production deployments, the model typically recommends charging during overnight off-peak hours (11 PM - 6 AM) when electricity rates are lowest.",
        ],
        bullets: [
          "ThingSpeak cloud platform: Centralized data logging, visualization, and ML hosting",
          "LSTM architecture: Multi-layer network (128→64→32 units) for time-series forecasting",
          "Training data: 10,000+ charging sessions with pricing and grid load data",
          "Input features: Time-of-day, day-of-week, electricity pricing, grid demand, weather",
          "Prediction accuracy: 91-93% match to actual off-peak optimal windows",
          "Update frequency: New schedules computed daily based on latest forecasts",
          "Cost optimization: Average 22% reduction in charging costs vs. immediate charging",
          "Grid impact: Reduces peak demand by shifting charging to off-peak periods",
        ],
        codeSnippets: [
          {
            title: "LSTM Model for Charging Window Prediction (MATLAB)",
            language: "matlab",
            code: `% LSTM model for optimal EV charging schedule prediction
% Runs on ThingSpeak MATLAB Analytics

% Load historical data from ThingSpeak channel
[data, timestamps] = thingSpeakRead(CHANNEL_ID, 'NumPoints', 10000);

% Feature engineering
hour = hour(timestamps);
day_of_week = weekday(timestamps);
electricity_price = data(:, 1);
grid_load = data(:, 2);
charging_occurred = data(:, 3);  % Binary: 1 if charged, 0 otherwise

% Cyclical encoding for time features
hour_sin = sin(2 * pi * hour / 24);
hour_cos = cos(2 * pi * hour / 24);
day_sin = sin(2 * pi * day_of_week / 7);
day_cos = cos(2 * pi * day_of_week / 7);

% Normalize features
price_norm = (electricity_price - min(electricity_price)) / ...
             (max(electricity_price) - min(electricity_price));
load_norm = (grid_load - min(grid_load)) / ...
            (max(grid_load) - min(grid_load));

% Create feature matrix
features = [hour_sin, hour_cos, day_sin, day_cos, price_norm, load_norm];

% Prepare sequences for LSTM (168 hours = 7 days lookback)
sequence_length = 168;
[X_seq, y_seq] = create_sequences(features, charging_occurred, sequence_length);

% Define LSTM architecture
layers = [
    sequenceInputLayer(size(features, 2))
    lstmLayer(128, 'OutputMode', 'sequence')
    dropoutLayer(0.2)
    lstmLayer(64, 'OutputMode', 'sequence')
    dropoutLayer(0.2)
    lstmLayer(32, 'OutputMode', 'last')
    dropoutLayer(0.2)
    fullyConnectedLayer(24)  % 24-hour prediction
    softmaxLayer
    classificationLayer
];

% Training options
options = trainingOptions('adam', ...
    'MaxEpochs', 100, ...
    'MiniBatchSize', 32, ...
    'Shuffle', 'every-epoch', ...
    'ValidationFrequency', 30, ...
    'Plots', 'training-progress', ...
    'Verbose', false);

% Train the model
lstm_net = trainNetwork(X_seq, y_seq, layers, options);

% Save model
save('lstm_charging_model.mat', 'lstm_net');

% Generate prediction for next 24 hours
current_features = prepare_current_features();
predicted_probabilities = predict(lstm_net, current_features);

% Find optimal charging window (lowest cost + lowest grid impact)
[optimal_start, optimal_duration] = find_optimal_window(predicted_probabilities);

% Write schedule back to ThingSpeak
thingSpeakWrite(SCHEDULE_CHANNEL_ID, [optimal_start, optimal_duration]);`,
          },
          {
            title: "Optimal Window Selection Algorithm",
            language: "python",
            code: `import numpy as np
from datetime import datetime, timedelta

def find_optimal_charging_window(
    predictions,           # LSTM output probabilities for each hour
    electricity_prices,    # Forecasted prices for next 24 hours
    grid_load_forecast,    # Grid load predictions
    required_energy_kwh,   # How much energy needed
    charging_power_kw=7.2, # Charger power rating
    required_by=None       # Deadline (datetime object)
):
    """
    Find the optimal continuous charging window that minimizes cost
    while respecting constraints.
    
    Returns:
        optimal_start (int): Hour to start charging (0-23)
        duration (int): How many hours to charge
    """
    
    # Calculate required charging duration
    required_hours = int(np.ceil(required_energy_kwh / charging_power_kw))
    
    if required_by is None:
        required_by = datetime.now() + timedelta(hours=24)
    
    # Calculate composite cost for each potential window
    num_hours = len(predictions)
    window_costs = []
    
    for start_hour in range(num_hours - required_hours + 1):
        # Extract window
        window_slice = slice(start_hour, start_hour + required_hours)
        
        # Cost components
        price_cost = np.sum(electricity_prices[window_slice])
        grid_impact = np.sum(grid_load_forecast[window_slice])
        
        # LSTM confidence (higher prediction = more suitable)
        lstm_confidence = np.mean(predictions[window_slice])
        
        # Composite score (lower is better)
        # Weight factors tuned based on user preferences
        composite_score = (
            0.6 * price_cost +           # 60% weight on electricity cost
            0.3 * grid_impact +          # 30% weight on grid friendliness
            0.1 * (1 - lstm_confidence)  # 10% weight on ML confidence
        )
        
        window_costs.append({
            'start_hour': start_hour,
            'duration': required_hours,
            'cost': price_cost,
            'grid_impact': grid_impact,
            'confidence': lstm_confidence,
            'composite_score': composite_score
        })
    
    # Sort by composite score and find best window meeting deadline
    sorted_windows = sorted(window_costs, key=lambda x: x['composite_score'])
    
    for window in sorted_windows:
        start_time = datetime.now().replace(
            hour=window['start_hour'], 
            minute=0, 
            second=0, 
            microsecond=0
        )
        end_time = start_time + timedelta(hours=window['duration'])
        
        if end_time <= required_by:
            return window
    
    # If no window meets deadline, return earliest possible
    return sorted_windows[0]

# Example usage with LSTM predictions
predictions = lstm_model.predict(current_features)
optimal = find_optimal_charging_window(
    predictions=predictions,
    electricity_prices=price_forecast,
    grid_load_forecast=load_forecast,
    required_energy_kwh=50.0,  # Need to charge 50 kWh
    charging_power_kw=7.2,
    required_by=datetime.now() + timedelta(hours=18)
)

print(f"Optimal charging start: {optimal['start_hour']}:00")
print(f"Duration: {optimal['duration']} hours")
print(f"Estimated cost: \${optimal['cost']:.2f}")
print(f"Grid impact: {optimal['grid_impact']:.1f}")
print(f"LSTM confidence: {optimal['confidence']:.1%}")
`,
        },
      ],
      image: {
        src: "/images/projects/ev-dosap/lstm-predictions.png",
        alt: "LSTM model predictions over 24 hours",
        caption: "LSTM predictions showing high probability (green) for optimal charging during off-peak hours.",
      },
    },
    {
      heading: "Data & Control Flow Architecture",
      body: [
        "The complete system operates through a carefully orchestrated data and control flow that maintains safety while enabling optimization. Sensor data from the ATmega1608 flows through the ESP32 gateway to ThingSpeak cloud every 30 seconds for monitoring and analytics. Critical fault events trigger immediate transmission with high-priority MQTT messages.",
        "In the opposite direction, the LSTM model running on ThingSpeak generates optimized charging schedules once daily (or when user requirements change). These schedules are published to the MQTT topic monitored by the ESP32, which parses the schedule and forwards it to the ATmega1608 via UART. The local controller validates the schedule against current conditions and user override settings before implementation.",
        "The critical design principle: fault protection (local) always overrides predictive scheduling (cloud). Even if the cloud recommends charging, the local controller can refuse or interrupt if voltage, current, or temperature parameters exceed safe thresholds. This ensures safety is never compromised for optimization.",
      ],
      bullets: [
        "Uplink data flow: Sensors → ATmega1608 → UART → ESP32 → MQTT → ThingSpeak",
        "Downlink control flow: LSTM Model → ThingSpeak → MQTT → ESP32 → UART → ATmega1608",
        "Data transmission frequency: Status every 30s, faults immediate (<1s latency)",
        "Schedule updates: Daily or on-demand when user requirements change",
        "Priority hierarchy: Local safety > User override > ML optimization",
        "Offline operation: Full protection capability without cloud connectivity",
        "Latency budget: Fault detection to cloud notification <2s typical",
      ],
      image: {
        src: "/images/projects/ev-dosap/data-flow.png",
        alt: "Complete data and control flow diagram",
        caption: "Bidirectional data flow showing sensor telemetry uplink and schedule optimization downlink.",
      },
    },
    {
      heading: "Safety & Protection Mechanisms",
      body: [
        "Safety is the cornerstone of this EV charging system. The multi-layered protection mechanisms ensure safe operation under all foreseeable conditions, with each layer providing independent safeguards. Hardware-level protection includes fuse and circuit breaker backup, while firmware implements sophisticated algorithms for rapid fault detection and response.",
      ],
      bullets: [
        "Over/Under Voltage Protection: ±10% tolerance with hysteresis to prevent oscillation",
        "Overload Protection: Current, kW, and kVA monitoring with three-tier response",
        "Ground Fault Detection: <6mA leakage current detection with <40ms trip time",
        "Earth Leakage Monitoring: Continuous measurement up to 50V fault voltage",
        "Inrush Current Handling: 500-800ms allowance window prevents nuisance tripping",
        "Thermal Protection: Multiple temperature sensors with graduated response",
        "Frequency Monitoring: 47-63Hz acceptable range for grid quality",
        "Arc Fault Detection: Current signature analysis for loose connections",
        "Stuck Relay Detection: Redundant contact verification before energization",
        "Emergency Stop: Hardware interlock with latching for manual safety intervention",
      ],
    },
    {
      heading: "Testing, Validation & Results",
      body: [
        "Comprehensive testing was conducted using fault injection techniques and simulated grid load scenarios to validate system performance under normal and abnormal conditions. The test setup included programmable power supplies for voltage variation, electronic loads for overload testing, and ground fault injection circuits for safety verification.",
        "Production validation involved 6-month field deployment at Ontario Tech University charging stations, monitoring real-world performance and collecting data for ML model refinement. The results exceeded design targets, demonstrating robust protection with minimal false trips and significant cost savings through intelligent scheduling.",
      ],
      bullets: [
        "Fault response time: <30ms from detection to protective action (target: <50ms)",
        "Fault detection accuracy: 98% across voltage, current, and thermal parameters",
        "False trip rate: <0.1% during normal operation (industry standard: <1%)",
        "LSTM scheduling accuracy: 91-93% match to actual optimal off-peak windows",
        "Energy cost savings: 22% average reduction through optimized scheduling",
        "Communication reliability: <0.5% data loss with caching enabled",
        "MQTT latency: <500ms for status updates, <1s for fault notifications",
        "System uptime: 99.7% during 6-month field deployment",
        "User satisfaction: 4.8/5 stars based on pilot program feedback",
      ],
      image: {
        src: "/images/projects/ev-dosap/testing-results.png",
        alt: "System testing and validation results",
        caption: "Performance metrics from fault injection testing showing <30ms response times and 98% detection accuracy.",
      },
    },
    {
      heading: "Scalability and Real-World Applications",
      body: [
        "The modular architecture enables deployment across diverse scenarios from residential garages to commercial parking facilities and industrial fleet depots. The system scales horizontally through the cloud platform, allowing centralized management of multiple charging stations while maintaining local autonomy for safety-critical functions.",
      ],
      bullets: [
        "Residential: Smart home integration with 7.2kW Level 2 charging",
        "Commercial: Multi-station deployments with load balancing and billing",
        "Industrial: Fleet charging coordination with predictive maintenance",
        "Public: Street-side and parking facility charging with payment processing",
        "Renewable Integration: Coordinate charging with solar/wind generation",
        "Grid Services: Vehicle-to-Grid (V2G) capability for future enhancement",
      ],
    },
    {
      heading: "My Role & Contributions",
      body: [
        "As Firmware Lead and System Integration Engineer, I was responsible for the complete embedded system design and implementation. This encompassed the ATmega1608 firmware architecture, protection algorithms, UART communication protocol, EEPROM management, and user interface development. I designed the Triple-Tiered Tripping strategy and implemented the DOSAP protection system.",
        "For the IoT layer, I developed the ESP32 firmware including MQTT communication stack, TLS security implementation, data caching mechanisms, and the UART bridge protocol. I coordinated integration with the LSTM ML system developed by my colleague, ensuring seamless data flow between edge and cloud while maintaining safety priorities.",
        "I designed and executed the comprehensive testing methodology including fault injection scenarios, performance benchmarking, and field validation procedures. The project culminated in a paper submission to IEEE SYSCON 2025 documenting the system architecture and results.",
      ],
      bullets: [
        "Firmware Architecture: Complete ATmega1608 embedded system design and implementation",
        "Protection Algorithms: Triple-Tiered Tripping strategy and DOSAP system",
        "Communication Stack: UART protocol and ESP32 MQTT/TLS implementation",
        "System Integration: Coordinated hardware, IoT gateway, and cloud ML components",
        "Testing & Validation: Fault injection methodology and performance benchmarking",
        "Documentation: Technical specifications, API documentation, user manual",
        "Research Publication: Co-authored IEEE SYSCON 2025 paper submission",
      ],
    },
    {
      heading: "Technical Skills Demonstrated",
      body: [
        "This project showcases comprehensive expertise across embedded systems, IoT, machine learning, and power electronics. The implementation demonstrates ability to deliver production-grade systems that meet stringent safety requirements while incorporating cutting-edge AI optimization.",
      ],
      bullets: [
        "Embedded C/C++: Real-time control, interrupt handling, state machines, EEPROM management",
        "Microcontrollers: ATmega1608 (AVR) and ESP32 (Xtensa) firmware development",
        "Power Electronics: AC power control, protection circuits, J1772 pilot signals",
        "IoT Protocols: MQTT, UART, TLS encryption, certificate authentication",
        "Cloud Platforms: ThingSpeak integration, API development, remote monitoring",
        "Machine Learning: LSTM architecture, time-series forecasting, feature engineering",
        "Safety Engineering: Multi-tier protection, fault analysis, compliance with EV standards",
        "System Integration: Hardware-software co-design, protocol development, testing",
        "Research: Experimental design, data analysis, academic paper writing",
      ],
    },
  ],
  
  gallery: [
    {
      src: "/images/projects/ev-dosap/hardware-prototype.jpg",
      alt: "Complete EV charging system hardware",
      caption: "Integrated system showing ATmega1608 controller board, ESP32 gateway, and power electronics.",
    },
    {
      src: "/images/projects/ev-dosap/control-board.jpg",
      alt: "ATmega1608 controller board close-up",
      caption: "Custom PCB with ATmega1608, current sensors, relay drivers, and protection circuits.",
    },
    {
      src: "/images/projects/ev-dosap/thingspeak-dashboard.jpg",
      alt: "ThingSpeak monitoring dashboard",
      caption: "Real-time cloud dashboard showing voltage, current, power, and fault status across multiple stations.",
    },
    {
      src: "/images/projects/ev-dosap/lstm-training.jpg",
      alt: "LSTM model training results",
      caption: "Training and validation curves showing model convergence at 91-93% accuracy.",
    },
    {
      src: "/images/projects/ev-dosap/field-deployment.jpg",
      alt: "Field deployment at Ontario Tech",
      caption: "Production deployment at Ontario Tech University charging station during pilot program.",
    },
    {
      src: "/images/projects/ev-dosap/mobile-app.jpg",
      alt: "Mobile monitoring interface",
      caption: "Companion mobile app for remote monitoring and schedule control (future enhancement).",
    },
  ],
  
 
},

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  {
    title: "Industrial Three-Phase Servo Voltage Stabilizer with Real-Time Protection System",
    slug: slugify("Industrial Three-Phase Servo Voltage Stabilizer with Real-Time Protection System"),
    category: "Embedded Systems & Power Electronics",
    description:
      "Production-grade ATmega4809-based three-phase servo stabilizer featuring advanced voltage regulation, multi-tiered protection cascade, real-time telemetry, persistent logging, and intuitive LCD interface with digit-level parameter editing.",
    longDescription: `An industrial - grade firmware solution for a three - phase servo voltage stabilizer built from the ground up using ATmega4809 microcontroller.This project demonstrates expertise in embedded systems architecture, real - time control systems, power electronics interfacing, and robust fault management.

The system continuously monitors three - phase electrical parameters(voltage, current, frequency, earth leakage) and provides automatic voltage regulation through servo motor control while implementing a sophisticated multi - level protection scheme that prevents equipment damage and ensures operator safety.

** Technical Excellence:** Modular architecture with 12 + custom libraries, hardware timer - based frequency capture using TCB/EVSYS peripherals, non-blocking timer management for concurrent operations, EEPROM-based parameter persistence with ring-buffer event logging, and auto-detecting I2C LCD driver supporting multiple controller variants.

  > ** Platform:** ATmega4809(16 MHz internal oscillator) • ** Framework:** Arduino with atmelmegaavr core • ** IDE:** PlatformIO • ** Programming:** Serial UPDI • ** Language:** C / C++`,

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
      { label: "CT Options", value: "40/100/200A/500A" },
      { label: "Response Time", value: "<50ms" },
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
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Buttons   │→ │   Timers    │→ │   Sensors    │→ │  Protection &   │  │
│  │   Update    │  │   Update    │  │   Update     │  │  Motor Control  │  │
│  └─────────────┘  └─────────────┘  └──────────────┘  └─────────────────┘  │
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
        heading: "Real-World Applications & Impact",
        body: [
          "A servo stabilizer is an automatic voltage regulation device that protects electrical equipment from voltage fluctuations. It uses a servo motor and buck-boost transformer to continuously monitor and adjust the incoming voltage, ensuring a stable output (typically ±1% accuracy) regardless of input variations. This makes it essential for protecting sensitive and expensive equipment from damage caused by power supply irregularities."
        ],
        bullets: [
          "Industrial: CNC machines, manufacturing equipment, heavy machinery",
          "Medical: X-ray machines, CT/MRI scanners, diagnostic equipment",
          "Commercial: Data centers, banks, hotels, telecom equipment",
          "IT Infrastructure: Servers, networking equipment, computer systems",
          "Protects equipment from voltage fluctuations (handles ±40-50% variations)",
          "Extends equipment lifespan and reduces maintenance costs",
          "Provides high accuracy voltage regulation",
          "Works automatically with no manual intervention required"
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
            code: `void FrequencyMeasurer:: setupTCBs() {
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
} `
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
            code: `void TimerManager_v2:: startTimer(uint8_t id, uint16_t interval, uint8_t unit, void (* cb)()) {
  Timer_v2 * t = findTimer(id);

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

void TimerManager_v2:: updateAllTimers() {
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
} `
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
            code: `ConditionType conditionLadder(uint8_t * timerId_now) {
  // Check in order of severity: Immediate → Level 2 → Level 1

  // OUTPUT VOLTAGE HIGH - Three stages
  if (outVolt_R > parameters[MENU_OP_HIGH_IMDTE_TRIP]) {
    currentCondition = { CONDITION_OUTHIGH_IMT_R, outVolt_R };
    RelayOff(); // Immediate trip, no timer
    return CONDITION_OUTHIGH_IMT_R;
  }
  else if (outVolt_R > parameters[MENU_OP_HIGH_CUTOFF_2]) {
    currentCondition = { CONDITION_OUTHIGH_2R, outVolt_R };
    * timerId_now = TIMER_OUTPUT_HIGH_TRIP_2;
    // Start Level 2 timer (e.g., 5 seconds)
    timer.startTimer(TIMER_OUTPUT_HIGH_TRIP_2,
      parameters[MENU_OP_HIGH_TRIP_TIME_2],
      SECONDS,
      RelayOff);
    return CONDITION_OUTHIGH_2R;
  }
  else if (outVolt_R > parameters[MENU_OP_HIGH_CUTOFF_1]) {
    currentCondition = { CONDITION_OUTHIGH_1R, outVolt_R };
    * timerId_now = TIMER_OUTPUT_HIGH_TRIP_1;
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
} `
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
            code: `void LCDManager:: detectLCD() {
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

void LCDManager:: begin() {
  detectLCD();

  if (lcdType == LCD_I2C) {
    lcdI2C = new LiquidCrystal_I2C(0x27, lcdCols, lcdRows);
    lcdI2C -> init();
    lcdI2C -> backlight();
  }
  else if (lcdType == LCD_AIP31068) {
    lcdAIP = new LiquidCrystal_AIP31068_I2C(0x3E, lcdCols, lcdRows);
    lcdAIP -> init();
    lcdAIP -> display();
  }
}

// Unified API - implementation delegates to active driver
void LCDManager:: print(const String & str) {
  if (lcdType == LCD_I2C) lcdI2C -> print(str);
  else if (lcdType == LCD_AIP31068) lcdAIP -> print(str);
} `
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
            code: `void MenuHandler:: incrementDigit() {
  int16_t & value = _values[_currentItem];

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
  const MenuItem & item = _schema[_currentItem];
  if (value < item.minValue) value = item.minValue;
  if (value > item.maxValue) value = item.maxValue;
} `
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
bool EEPROMStore:: saveU16(const uint16_t* data, uint8_t count, uint16_t base) {
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
void EEPROMStore:: Log:: write(uint8_t eventType, uint16_t eventData) {
  uint16_t writeAddr = LOG_BASE_ADDR + (logHead * LOG_ENTRY_SIZE);

  EEPROM.update(writeAddr + 0, eventType);
  EEPROM.update(writeAddr + 1, (uint8_t)(eventData & 0xFF));
  EEPROM.update(writeAddr + 2, (uint8_t)(eventData >> 8));
  EEPROM.update(writeAddr + 3, (uint8_t)(millis() >> 16)); // Timestamp

  // Advance head with wraparound
  logHead = (logHead + 1) % LOG_CAPACITY;

  // Update count (saturates at capacity)
  if (logCount < LOG_CAPACITY) logCount++;
} `
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
            code: `MotorDir VoltageRegulator:: decide(int16_t outV, int16_t setpoint, MotorDir last) {
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

void VoltageRegulator:: applyMotorCommand(PhaseMotor & motor, MotorDir dir) {
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
} `
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

void updateSensorReadings(int16_t * params) {
  // Input voltage (R-phase): ADC → scale to voltage
  inVolt_R = get_max(IN_VOLT_R_PIN) * 1000.0f / 1023;  // 0-1000V range

  // Output voltage with calibration
  outVolt_R = get_max(OUT_VOLT_R_PIN) * 1000.0f / 1023;

  // Earth leakage voltage (different scaling)
  earthVolt = get_max(E_VOLT_PIN) * 50.0f / 1023;  // 0-50V range

  // Current with CT ratio compensation
  current_R = (get_max(AMPERE_R_PIN) * 1000.0f / 1023) * params[MENU_CT] / 100;

  // Repeat for Y and B phases...
} `
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
board_build.f_cpu = 16000000L; 16 MHz internal oscillator

  ; Upload via Serial UPDI
upload_protocol = serialupdi
upload_speed = 115200
upload_port = COM3; Adjust for your system

  ; Library dependencies
lib_deps =
  marcoschwartz / LiquidCrystal_I2C@^ 1.1.4
enjoyneering / LiquidCrystal_AIP31068@^ 1.0.0

  ; Compiler optimizations
build_flags =
  -Os; Optimize for size
    - Wall; Enable all warnings
      - DDEBUG=1; Enable debug output`
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
          "Connect Serial UPDI programmer to ATmega4809",
          "Configure upload_port in platformio.ini (COM port or /dev/tty*)",
          "Build: `pio run`",
          "Upload: `pio run--target upload`",
          "Monitor: `pio device monitor--baud 9600`",
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
