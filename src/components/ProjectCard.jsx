import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Pill } from "./ui/section";
import { Cpu, Link, ExternalLink, Github, Eye, ArrowUpRight, Zap } from "lucide-react";
import { goProject } from "../utils/router";
import { motion } from "framer-motion";

// Icon mapping for different link types
const linkIcons = {
  'Code': Github,
  'GitHub': Github,
  'Demo': ExternalLink,
  'Live': ExternalLink,
  'View': Eye,
  'Docs': Link,
  'Design': Eye,
  'Report': Link,
  'Roadmap': Link,
};

export function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="group hover:shadow-[0_0_0_1px_rgba(16,185,129,.35),0_10px_30px_rgba(16,185,129,.08)] transition-all duration-300 bg-card dark:bg-neutral-900/40 border dark:border-emerald-800/40 cursor-pointer h-full flex flex-col relative overflow-hidden"
        onClick={() => goProject(project.slug)}
      >
        {/* Subtle gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Header with enhanced styling */}
        <CardHeader className="pb-3 sm:pb-4 relative z-10">
          <CardTitle className="text-sm sm:text-base flex items-start gap-2 leading-tight">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border group-hover:bg-emerald-500/20 transition-colors">
              <Cpu className="h-3.5 w-3.5 flex-shrink-0" />
            </div>
            <span className="line-clamp-2">{project.title}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col relative z-10">
          {/* Enhanced description */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
            {project.summary}
          </p>
          
          {/* Enhanced tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 4).map((t, index) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Pill>{t}</Pill>
              </motion.div>
            ))}
            {project.tags.length > 4 && (
              <span className="text-xs text-muted-foreground self-center">
                +{project.tags.length - 4} more
              </span>
            )}
          </div>
          
          {/* Enhanced action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            {project.links.slice(0, 2).map((l) => {
              const IconComponent = linkIcons[l.label] || Link;
              const href = l.url || l.href;
              return (
                <Button
                  key={l.label}
                  variant="outline"
                  size="sm"
                  asChild
                  className="border text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 text-xs group/btn transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-1.5"
                  >
                    <IconComponent className="h-3 w-3 group-hover/btn:scale-110 transition-transform" />
                    <span>{l.label}</span>
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </a>
                </Button>
              );
            })}
          </div>
          
          {/* Enhanced metrics with icons */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-xs mt-auto">
              {project.metrics.map((m, index) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border dark:border-emerald-800/40 p-2.5 transition-all duration-200"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                    <div className="font-semibold text-emerald-700 dark:text-emerald-300 truncate text-xs sm:text-sm">
                      {m.value}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-[10px] sm:text-xs truncate pl-4">
                    {m.label}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Hover indicator */}
          <motion.div
            className="absolute bottom-2 right-2 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100"
            initial={{ scale: 0.8, rotate: -45 }}
            animate={{ 
              scale: isHovered ? 1 : 0.8, 
              rotate: isHovered ? 0 : -45,
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

