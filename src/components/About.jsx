import React from 'react';
import { Section, Pill } from "./ui/section";
import { PROFILE } from "../data/profile";

const About = () => {
  return (
    <Section id="about" title="About Me">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 text-muted-foreground leading-relaxed text-sm sm:text-base">
          {PROFILE.about || PROFILE.summary}
        </div>
        <div className="bg-card border rounded-md p-4 text-sm text-muted-foreground">
          <div className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">Quick facts</div>
          <div className="flex flex-wrap gap-2">
            {PROFILE.location ? <Pill>{PROFILE.location}</Pill> : null}
            <Pill>Embedded Systems</Pill>
            <Pill>Firmware</Pill>
            <Pill>Real-time</Pill>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
