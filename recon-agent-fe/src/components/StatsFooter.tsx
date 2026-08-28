import { useEffect, useState } from "react";

function useCountUp(endValue: number, duration: number = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!endValue || endValue === 0) return;
    let startTime: number;
    let animationFrame: number;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * endValue));
      if (progress < 1) animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [endValue, duration]);

  return count;
}

export default function StatsFooter({ results }: { results: any }) {
  const StatBlock = ({
    icon,
    label,
    value,
    symbol = "",
    index,
  }: {
    icon: string;
    label: string;
    value: number;
    symbol?: string;
    index: number;
  }) => {
    const animatedValue = useCountUp(value);

    const borderClasses = `
      flex items-center gap-3 md:gap-4 w-full md:w-auto justify-center md:justify-start
      ${index !== 0 ? "border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6 lg:pl-8" : ""} 
    `;

    return (
      <div className={borderClasses}>
        <span className="font-display text-[#8e8e8e] text-xl md:text-2xl shrink-0">
          {icon}
        </span>
        <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2 text-left">
          <span className="font-sans text-lg md:text-xl font-semibold text-white tabular-nums tracking-tight leading-none">
            {animatedValue.toLocaleString()}
            {symbol}
          </span>
          <span className="text-[10px] md:text-xs font-medium text-[#8e8e8e] uppercase tracking-widest leading-none">
            {label}
          </span>
        </div>
      </div>
    );
  };

  return (
    <footer className="shrink-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 py-3 md:py-4 px-4 md:px-8 anim-header z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:flex md:flex-row md:items-center justify-between gap-y-3 gap-x-4 md:gap-0">
        <StatBlock
          index={0}
          icon="<"
          label="Total Ingested"
          value={results?.metrics?.total_ledger_records || 0}
        />
        <StatBlock
          index={1}
          icon="%"
          label="Auto-Cleared"
          value={results?.metrics?.deterministic_matched_count || 0}
        />
        <StatBlock
          index={2}
          icon="*"
          label="AI Clearances"
          value={results?.data?.agent_matched?.length || 0}
        />
        <StatBlock
          index={3}
          icon="#"
          label="Manual Review"
          value={results?.data?.exceptions?.length || 0}
        />
      </div>
    </footer>
  );
}
