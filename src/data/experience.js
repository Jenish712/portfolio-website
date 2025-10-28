export const EXPERIENCE = [
  {
    role: "Teaching Assistant",
    org: "Ontario Tech University",
    location: "Ontario, Canada",
    period: "Aug 2024 – Dec 2024",
    bullets: [
      {
        text: "Systems Programming (SOFE 3200) – Tutorials & Labs",
        nested: [
          "Conducted tutorials and lab sessions to help students understand system-level programming concepts, including process management, memory management, and synchronization.",
          "Designed and graded quizzes and assignments to assess students' grasp of low-level programming and operating system interactions.",
          "Provided one-on-one support, debugging assistance, and insights into best practices for systems programming in C and Linux environments.",
        ]
      },
      {
        text: "Distributed Systems (SOFE 4790) – Lab",
        nested: [
          "Guided students through hands-on labs covering containerization, microservices, and cloud-based distributed systems.",
          "Assisted in implementing scalable and fault-tolerant distributed applications using Docker, Kubernetes, and messaging protocols.",
          "Offered technical support on concurrency, networking, and load balancing strategies in distributed environments.",
        ]
      },
    ],
  },
  {
    role: "R&D Embedded Firmware Developer",
    org: "Hindustan Electronics Line Control Systems (HELICS)",
    location: "India",
    period: "Apr 2022 – Mar 2024",
    bullets: [
      "Developed real-time firmware for industrial automation and safety-critical electronics.",
      "Designed firmware for Microchip AVR MCUs (Mega-0, AVRDA/DB/DD) in real-time control applications.",
      {
        text: "Completed 7+ embedded firmware projects, including:",
        nested: [
          "Servo Stabilizers: Integrated TTT & DOSAP for advanced voltage regulation.",
          "Earth-Leakage Circuit Breaker (ELCB): Developed firmware for leakage detection & auto shutoff.",
          "Smart Motor Starters: Engineered control logic for single/three-phase motors with water level monitoring.",
          "IoT Remote Monitoring: Integrated MQTT & Google Cloud for real-time diagnostics.",
        ]
      },
      "Debugged & optimized firmware using JTAG, Oscilloscope, and Logic Analyzer, improving fault detection efficiency.",
    ],
  },
  {
    role: "Jr. Embedded Firmware Engineer",
    org: "Quad SoftTech",
    location: "India",
    period: "Dec 2021 – Mar 2022",
    bullets: [
      "Developed real-time firmware for industrial automation systems in textile & diamond industries.",
      "Optimized automation logic, enhancing machine efficiency, accuracy, and power usage.",
      "Enhanced embedded-to-cloud connectivity, enabling data-driven operational improvements.",
    ],
  },
];