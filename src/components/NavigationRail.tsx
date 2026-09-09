import React from 'react';
import { TabKey, TabDefinition } from '../types';

interface NavigationRailProps {
  tabs: TabDefinition[];
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  isOpen,
  onToggleOpen,
  isDark,
  onToggleTheme,
}) => {
  return (
    <aside
      id="desktop-navigation-rail"
      className="hidden md:flex flex-col gap-[22px] sticky top-0 self-start h-screen overflow-hidden select-none shrink-0"
      style={{
        width: isOpen ? '220px' : '66px',
        background: 'var(--railBg)',
        color: 'var(--railInk)',
        padding: '20px 12px',
        transition: 'width 0.42s cubic-bezier(0.2, 0.9, 0.2, 1), background 0.45s ease',
      }}
    >
      {/* Logo & Expand/Collapse */}
      <button
        id="nav-logo-button"
        onClick={onToggleOpen}
        title={isOpen ? 'Recolher menu' : 'Expandir menu'}
        className="text-left flex items-center gap-[11px] p-1 px-2 border-0 bg-transparent cursor-pointer rounded-full hover:bg-[rgba(246,244,239,0.08)] transition-colors"
      >
        <span
          className="w-8 h-8 rounded-[11px] text-white flex items-center justify-center shrink-0"
          style={{
            background: 'var(--accent)',
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: '18px',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.45s cubic-bezier(0.2, 0.9, 0.2, 1)',
          }}
        >
          C
        </span>
        <span
          className="whitespace-nowrap overflow-hidden transition-opacity duration-300"
          style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: '20px',
            opacity: isOpen ? 1 : 0,
          }}
        >
          Conectados
        </span>
      </button>

      {/* Navigation List */}
      <nav id="nav-tabs-list" className="flex flex-col gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              id={`nav-item-${tab.key}`}
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              title={tab.label}
              className="relative flex items-center gap-3 p-[11px_10px] rounded-full text-left border-0 cursor-pointer transition-all duration-300 group"
              style={{
                background: isActive ? 'rgba(246, 244, 239, 0.1)' : 'transparent',
                color: isActive ? 'var(--railInk)' : 'var(--railMute)',
                transform: isActive ? 'translateX(5px)' : 'translateX(0px)',
              }}
            >
              {/* Active Indicator Bar */}
              <span
                className="absolute left-[-6px] top-1/2 w-[3px] rounded-[9px] pointer-events-none transition-all duration-300"
                style={{
                  background: 'var(--accent)',
                  height: isActive ? '20px' : '0px',
                  marginTop: isActive ? '-10px' : '0px',
                }}
              />

              {/* Number */}
              <span
                className="font-mono text-[10px] opacity-60 w-4 text-center shrink-0"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {tab.num}
              </span>

              {/* Label */}
              <span
                className="text-[13.5px] font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300"
                style={{
                  opacity: isOpen ? 1 : 0,
                  fontFamily: '"Public Sans", system-ui, sans-serif',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Area: Theme Switcher & Year Verse */}
      <div className="mt-auto flex flex-col gap-[14px]">
        {/* Theme Switcher Button */}
        <button
          id="nav-theme-toggle"
          onClick={onToggleTheme}
          title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          className="flex items-center gap-2.5 p-[9px_12px] rounded-full cursor-pointer bg-transparent transition-all duration-300 hover:border-[rgba(246,244,239,0.4)]"
          style={{
            border: '1px solid var(--railHair)',
            color: 'var(--railMute)',
          }}
        >
          {/* Pill Switch */}
          <span
            className="w-[26px] h-[15px] rounded-full shrink-0 relative transition-colors duration-350"
            style={{
              background: isDark ? 'var(--accent)' : 'rgba(246, 244, 239, 0.28)',
            }}
          >
            <span
              className="absolute top-[2px] left-[2px] w-[11px] h-[11px] rounded-full transition-transform duration-350"
              style={{
                background: 'var(--railInk)',
                transform: isDark ? 'translateX(11px)' : 'translateX(0px)',
              }}
            />
          </span>

          <span
            className="text-[12px] font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300"
            style={{ opacity: isOpen ? 1 : 0 }}
          >
            {isDark ? 'Tema escuro' : 'Tema claro'}
          </span>
        </button>

        {/* Verse of the Year */}
        <div
          className="p-[0_10px_4px] transition-opacity duration-300 overflow-hidden"
          style={{ opacity: isOpen ? 1 : 0 }}
        >
          <div
            className="text-[9px] uppercase tracking-[0.14em] mb-[7px]"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--railMute)',
            }}
          >
            Versículo do ano
          </div>
          <div
            className="text-[17px] leading-[1.28]"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
          >
            Seja um exemplo para os fiéis.
          </div>
          <div
            className="text-[11px] mt-1.5"
            style={{ color: 'var(--railMute)' }}
          >
            1 Timóteo 4:12
          </div>
        </div>
      </div>
    </aside>
  );
};
