import React from 'react';

export interface StatItem {
  label: string;
  value: string;
}

interface EditorialHeaderProps {
  eyebrow: string;
  title: string;
  stats: StatItem[];
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  eyebrow,
  title,
  stats,
}) => {
  return (
    <header
      id="editorial-page-header"
      className="p-[20px_20px_16px] md:p-[26px_30px_20px] border-b border-[var(--rule)] flex flex-wrap gap-4 items-end justify-between select-none"
      style={{ background: 'var(--paper)', transition: 'background-color 0.45s ease' }}
    >
      {/* Title & Eyebrow */}
      <div className="min-w-0 flex-1 basis-[260px]">
        <div
          className="text-[9.5px] tracking-[0.14em] uppercase"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            color: 'var(--faint)',
          }}
        >
          {eyebrow}
        </div>
        <h1
          className="m-0 mt-[7px] text-[30px] md:text-[40px] font-normal leading-none tracking-[-0.015em]"
          style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
        >
          {title}
        </h1>
        <div
          key={title}
          className="h-[1px] mt-3 max-w-[170px] animate-inkline"
          style={{ background: 'var(--accent)' }}
        />
      </div>

      {/* Header Stats */}
      <div className="flex gap-5 md:gap-[22px] items-end flex-wrap">
        {stats.map((stat, idx) => (
          <div key={idx} id={`header-stat-${idx}`}>
            <div
              className="text-[9.5px] tracking-[0.1em] uppercase"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                color: 'var(--faint)',
              }}
            >
              {stat.label}
            </div>
            <div
              className="text-[22px] md:text-[25px] mt-[2px] whitespace-nowrap"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};
