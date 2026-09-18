import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface StatsGridItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export interface StatsGridProps {
  stats: StatsGridItem[];
  variant?: 'home' | 'about';
  animated?: boolean;
  className?: string;
}

function formatStatValue(value: number, prefix = '+', suffix = '') {
  const formatted = value.toLocaleString('en-US').replace(/,/g, ' ');
  return `${prefix}${formatted}${suffix}`;
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
  }, [animated, hasStarted, stats]);

  if (variant === 'about') {
    return (
      <div
        ref={containerRef}
        className={cn('rounded-2xl px-4 py-6 md:px-8 lg:px-10', className)}
        style={{ background: 'linear-gradient(180deg, #FBFDFF 0%, #EAF2FF 55%, #DCEAFF 100%)' }}
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, index) => (
            <div key={stat.label} className="relative flex min-w-0 items-center">
              <div className="relative z-10 flex w-full flex-col items-center text-center">
                <span className="you-stat-gradient whitespace-nowrap text-[clamp(0.875rem,1.2vw,1.125rem)]">{stat.label}</span>
                <span className="you-stat-gradient mt-2 text-[clamp(1.875rem,2.5vw,2.25rem)] font-semibold">
                  {formatStatValue(values[index], stat.prefix ?? '+', stat.suffix ?? '')}
                </span>
              </div>
              {index < stats.length - 1 && (
                <span className="absolute right-0 top-1/2 z-0 hidden h-[88px] w-px -translate-y-1/2 -rotate-[10deg] bg-[#C0D8FF] lg:block" aria-hidden="true" />
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
      className={cn(
        'rounded-3xl lg:rounded-[40px] px-4 sm:px-6 lg:px-10 py-6 lg:py-10 mt-10 lg:mt-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]',
        className
      )}
      style={{ background: 'linear-gradient(180deg, #FBFDFF 0%, #EAF2FF 55%, #DCEAFF 100%)' }}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
        {stats.map((stat, index) => (
          <div key={stat.label} className="relative flex min-w-0 items-center">
            <div className="relative z-10 flex flex-col items-center text-center w-full py-2">
              <span
                className="you-stat-gradient text-[clamp(0.75rem,1.15vw,1.25rem)] xl:text-[clamp(0.875rem,1.35vw,1.5rem)] font-normal whitespace-nowrap"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {stat.label}
              </span>
              <span
                className="you-stat-gradient font-extrabold text-[clamp(2rem,3.6vw,3.5rem)] tracking-tight"
                aria-label={`${stat.value} ${stat.label}`}
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {formatStatValue(values[index], stat.prefix ?? '+', stat.suffix ?? '')}
              </span>
            </div>
            {index < stats.length - 1 && (
              <span className="absolute right-0 top-1/2 z-0 hidden h-[120px] w-px -translate-y-1/2 -rotate-[10deg] bg-[#C0D8FF] lg:block" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
