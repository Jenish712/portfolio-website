import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

// Skeleton loader component
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-700/50",
        className
      )}
      {...props}
    />
  );
}

// Spinner component
export function Spinner({ size = "default", className, ...props }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-neutral-600 border-t-emerald-400",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

// Loading dots animation
export function LoadingDots({ className }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="h-2 w-2 bg-emerald-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Project card skeleton
export function ProjectCardSkeleton() {
  return (
    <div className="p-6 bg-neutral-800/50 border border-neutral-700/50 rounded-lg">
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

// Loading state for project list
export function ProjectListLoading({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

// AI Matrix Loader — lightweight JSX version of the provided HTML/CSS
export function AiMatrixLoader({ className }) {
  return (
    <div className={cn("ai-matrix-loader", className)} aria-label="Loading" role="status">
      <div className="digit">0</div>
      <div className="digit">1</div>
      <div className="digit">0</div>
      <div className="digit">1</div>
      <div className="digit">1</div>
      <div className="digit">0</div>
      <div className="digit">0</div>
      <div className="digit">1</div>
      <div className="glow" aria-hidden="true"></div>
      <span className="sr-only">Loading</span>
    </div>
  );
}