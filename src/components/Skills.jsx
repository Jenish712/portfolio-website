import React from 'react';
import { Section, Pill } from "./ui/section";
import { ScrollReveal } from "./ui/scroll-reveal";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Cpu, 
  Radio, 
  Code2, 
  Settings, 
  Wrench, 
  Zap, 
  Shield, 
  Bug,
  GitBranch,
  Layers
} from "lucide-react";
import { motion } from "framer-motion";

const SKILLS = [
  {
    category: "MCUs / SoCs",
    icon: Cpu,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    items: [
      "STM32G4 / STM32H7",
      "ATmega1608 / ATmega4809",
      "ESP32",
      "nRF52"
    ]
  },
  {
    category: "Protocols",
    icon: Radio,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    items: [
      "UART", "SPI", "I²C", "CAN", "RS-485",
      "Modbus RTU/TCP",
      "TCP/IP stack, MQTT",
      "BLE"
    ]
  },
  {
    category: "Languages",
    icon: Code2,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    items: [
      "C, C++",
      "Python (tooling, automation, testing)"
    ]
  },
  {
    category: "RTOS / Bare-Metal",
    icon: Settings,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    items: [
      "FreeRTOS (tasks, queues, semaphores, timers)",
      "Bare-metal firmware design",
      "Interrupt design and ISR safety"
    ]
  },
  {
    category: "Embedded Linux / BSP",
    icon: Layers,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    items: [
      "Yocto Project",
      "Device Tree, U-Boot",
      "Kernel module basics, driver integration"
    ]
  },
  {
    category: "Tooling",
    icon: Wrench,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    items: [
      "PlatformIO, CMake, GCC/Clang",
      "GDB, Git, Ceedling, CTest",
      "GitHub Actions (CI/CD)"
    ]
  },
  {
    category: "Power / Control Systems",
    icon: Zap,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    items: [
      "Servo stabilizers, VFD control",
      "PWM/ADC feedback loops",
      "KVA-based overload detection and trip logic"
    ]
  },
  {
    category: "Connectivity / Security",
    icon: Shield,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    items: [
      "OTA update flows",
      "Secure boot concepts",
      "Basic encryption and firmware signing"
    ]
  },
  {
    category: "Debug / Instrumentation",
    icon: Bug,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    items: [
      "JTAG/SWD debugging",
      "Logic analyzer, oscilloscope, serial trace"
    ]
  },
  {
    category: "System Architecture",
    icon: GitBranch,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    items: [
      "FSM design patterns",
      "HAL/LL layering",
      "Real-time control system design",
      "Industrial safety & protection standards (IEC/UL awareness)"
    ]
  }
];

const Skills = () => {
  return (
    <ScrollReveal delay={0.2} direction="up" duration={0.8}>
      <Section id="skills" title="Technical Skills" icon={Cpu}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {SKILLS.map((skillGroup, index) => {
            const Icon = skillGroup.icon;
            return (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
              >
                <Card className="h-full hover:shadow-[0_0_0_1px_rgba(16,185,129,.25),0_10px_30px_rgba(16,185,129,.05)] transition-all duration-300 bg-card dark:bg-neutral-900/40 border dark:border-emerald-800/40 group">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-base">
                      <div className={`p-2 rounded-lg ${skillGroup.bgColor} border ${skillGroup.borderColor} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-4 w-4 ${skillGroup.color}`} />
                      </div>
                      <span className="text-foreground">{skillGroup.category}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {skillGroup.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                      >
                        <Pill 
                          variant="secondary" 
                          className="w-full justify-start text-left text-xs sm:text-sm bg-neutral-800/40 text-muted-foreground hover:bg-neutral-800/60 border-neutral-700/40 transition-colors"
                        >
                          {item}
                        </Pill>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>
    </ScrollReveal>
  );
};

export default Skills;
