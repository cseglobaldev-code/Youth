import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface StatsGridItem {
  label: string;
  value: number;
}

export interface StatsGridProps {
  stats: StatsGridItem[];
  variant?: 'home' | 'about';
  animated?: boolean;
  className?: string;
}

function formatStatValue(value: number) {
  return `+${value.toLocaleString('en-US').replace(/,/g, ' ')}`;
}

export function StatsGrid({ stats, variant = 'home', animated = false, className }: StatsGridProps) {
  const [hasStarted, setHasStarted] = useState(!animated);
  const [values, setValues] = useState(() => (animated ? stats.map(() => 0) : stats.map((stat) => stat.value)));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated) return;
    const element = containerRef.current;
    if (!element || hasStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [animated, hasStarted]);

  useEffect(() => {
    if (!animated || !hasStarted) return;

    const targets = stats.map((stat) => stat.value);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValues(targets);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setValues(targets.map((target) => Math.round(target * easedProgress)));

      if (progress < 1) frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated, hasStarted]);

  if (variant === 'about') {
    return (
      <div ref={containerRef} className={cn('rounded-2xl bg-[#F2F7FF] px-4 py-6 md:px-8 lg:px-10', className)}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center">
              <div className="flex w-full flex-col items-center text-center">
                <span className="text-[clamp(0.875rem,1.2vw,1.125rem)] text-neutral-700">{stat.label}</span>
                <span className="mt-2 text-[clamp(1.875rem,2.5vw,2.25rem)] font-semibold text-black">
                  {formatStatValue(values[index])}
                </span>
              </div>
              {index < stats.length - 1 && (
                <svg width="24" height="88" viewBox="0 0 24 88" className="hidden lg:block shrink-0" aria-hidden="true">
                  <line x1="20" y1="0" x2="4" y2="88" stroke="#C0D8FF" strokeWidth="1.5" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('bg-[#F2F7FF] rounded-3xl lg:rounded-[40px] px-4 sm:px-6 lg:px-10 py-6 lg:py-10 mt-10 lg:mt-0', className)}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
        {stats.map((stat, index) => (
          <div key={stat.label} className="flex items-center min-w-0">
            <div className="flex flex-col items-center text-center w-full py-2">
              <span
                className="text-neutral-500 text-[clamp(0.875rem,1.56vw,1.5rem)] font-normal"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {stat.label}
              </span>
              <span
                className="font-semibold text-[clamp(1.75rem,3.13vw,3rem)] text-[#1E293B]"
                aria-label={`${stat.value} ${stat.label}`}
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {formatStatValue(values[index])}
              </span>
            </div>
            {index < stats.length - 1 && (
              <svg width="24" height="120" viewBox="0 0 24 120" className="hidden lg:block flex-shrink-0" aria-hidden="true">
                <line x1="20" y1="0" x2="4" y2="120" stroke="#C0D8FF" strokeWidth="1.5" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
