import React from 'react';
import { TabKey, TabDefinition } from '../types';

interface MobileNavProps {
  tabs: TabDefinition[];
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  isDark,
  onToggleTheme,
}) => {
  const bottomTabs = tabs.slice(0, 5); // 01 to 05
  const ideasTab = tabs[5]; // 06: Assistente criativo

  return (
    <>
      {/* Mobile Top Header */}
      <header
        id="mobile-top-header"
        className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40 border-b border-[var(--rule)]"
        style={{
          background: 'var(--paper)',
          transition: 'background-color 0.45s ease',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-[28px] h-[28px] rounded-[9px] text-white flex items-center justify-center shrink-0"
            style={{
              background: 'var(--accent)',
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: '17px',
            }}
          >
            C
          </div>
          <span
            className="text-[19px] tracking-tight"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
          >
            Conectados
          </span>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          {/* 6th Tab Pill: Assistente Criativo */}
          {ideasTab && (
            <button
              id="mobile-ideas-tab-button"
              onClick={() => onSelectTab(ideasTab.key)}
              className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold border cursor-pointer transition-all duration-300 min-h-[36px] flex items-center"
              style={{
                background:
                  activeTab === 'ideias' ? 'var(--accentSoft)' : 'transparent',
                borderColor:
                  activeTab === 'ideias' ? 'var(--accent)' : 'var(--rule)',
                color:
                  activeTab === 'ideias' ? 'var(--accent)' : 'var(--mute)',
              }}
            >
              {ideasTab.short}
            </button>
          )}

          {/* Theme Switch Pill */}
          <button
            id="mobile-theme-toggle"
            onClick={onToggleTheme}
            aria-label="Alternar tema"
            className="w-[38px] h-[36px] flex items-center justify-center rounded-full border border-[var(--rule)] bg-transparent cursor-pointer text-xs"
            style={{ color: 'var(--ink)' }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-1.5 border-t border-[var(--railHair)] select-none"
        style={{
          background: 'var(--railBg)',
          color: 'var(--railInk)',
          paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
        }}
      >
        {bottomTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              id={`mobile-nav-tab-${tab.key}`}
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className="flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1.5 py-1 px-1 bg-transparent border-0 cursor-pointer transition-colors"
              style={{
                color: isActive ? 'var(--railInk)' : 'rgba(246, 244, 239, 0.55)',
              }}
            >
              {/* Dot indicator */}
              <span
                className="w-[5px] h-[5px] rounded-full transition-transform duration-300"
                style={{
                  background: isActive ? 'var(--accent)' : 'rgba(246, 244, 239, 0.35)',
                  transform: isActive ? 'scale(1.6)' : 'scale(1)',
                }}
              />

              {/* Short Label */}
              <span
                className="text-[9.5px] font-medium tracking-[0.01em] whitespace-nowrap"
                style={{ fontFamily: '"Public Sans", system-ui, sans-serif' }}
              >
                {tab.short}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
