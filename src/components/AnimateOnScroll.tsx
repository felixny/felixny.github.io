"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

type Props = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

export default function AnimateOnScroll({
  children,
  className,
  delayMs = 0,
}: Props) {
  const { ref, isVisible } = useInView();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: isVisible ? `${delayMs}ms` : "0ms" }}
      className={cn(
        "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out",
        isVisible
          ? "motion-safe:translate-y-0 motion-safe:opacity-100"
          : "motion-safe:translate-y-8 motion-safe:opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
