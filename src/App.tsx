import React, { useState, useEffect } from 'react';
import { TabKey } from './types';
import { TABS, SEED_DATA } from './data/seedData';
import { formatMoney, formatMoney0 } from './utils/formatters';
import { NavigationRail } from './components/NavigationRail';
import { MobileNav } from './components/MobileNav';
import { EditorialHeader, StatItem } from './components/EditorialHeader';
import { SabadoScreen } from './components/SabadoScreen';
import { PlaceholderScreen } from './components/PlaceholderScreen';

export const App: React.FC = () => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<TabKey>('sabado');

  // Sidebar expanded / collapsed
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('conectados_sidebar_open');
    return saved !== null ? saved === 'true' : true;
  });

  // Dark / Light theme
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('conectados_theme');
    return saved === 'dark';
  });

  // Attendance map (default from seed data)
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>({
    y1: true,
    y2: true,
    y4: true,
    y6: true,
    y7: true,
    y8: true,
    y10: true,
  });

  // Apply theme to root html element and persist
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('conectados_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('conectados_theme', 'light');
    }
  }, [isDark]);

  // Persist sidebar preference
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('conectados_sidebar_open', String(next));
      return next;
    });
  };

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Financial calculations
  const totalIncome = SEED_DATA.txs
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = SEED_DATA.txs
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Attendance calculations
  const presentCount = Object.values(presentMap).filter(Boolean).length;
  const expectedCount = 22;

  // Find active tab configuration
  const currentTabDef = TABS.find((t) => t.key === activeTab) || TABS[0];

  // Dynamically compute header stats based on active tab
  const getHeaderStats = (): StatItem[] => {
    switch (activeTab) {
      case 'sabado':
        return [
          { label: 'Confirmados', value: `${presentCount} / ${expectedCount}` },
          { label: 'Caixa', value: formatMoney(balance) },
        ];
      case 'jovens':
        return [
          { label: 'Presentes hoje', value: String(presentCount) },
          {
            label: 'Em alerta',
            value: String(
              SEED_DATA.members.filter((m) => m.status !== 'active').length
            ),
          },
        ];
      case 'caixa':
        return [
          { label: 'Entradas', value: formatMoney0(totalIncome) },
          { label: 'Saídas', value: formatMoney0(totalExpense) },
        ];
      case 'estudos':
        return [
          { label: 'Estudo', value: 'Daniel 1' },
          { label: 'Post', value: 'terça' },
        ];
      case 'eventos':
        return [{ label: 'Próximo retiro', value: 'em 5 meses' }];
      case 'ideias':
        return [
          { label: 'Ideias', value: String(SEED_DATA.ideas.length) },
          { label: 'Custo médio', value: 'R$ 5' },
        ];
      default:
        return [];
    }
  };

  return (
    <div
      id="app-root-shell"
      className="min-h-screen flex flex-col md:flex-row items-stretch selection:bg-[var(--accent)] selection:text-white"
      style={{
        backgroundColor: 'var(--shell)',
        color: 'var(--ink)',
        transition: 'background-color 0.45s ease, color 0.45s ease',
      }}
    >
      {/* Desktop Navigation Rail (220px <-> 66px) */}
      <NavigationRail
        tabs={TABS}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isSidebarOpen}
        onToggleOpen={handleToggleSidebar}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Mobile Top Header */}
      <MobileNav
        tabs={TABS}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Workspace */}
      <main
        id="main-app-content"
        className="flex-1 min-w-0 flex flex-col pb-[72px] md:pb-0"
        style={{
          backgroundColor: 'var(--paper)',
          transition: 'background-color 0.45s ease',
        }}
      >
        {/* Editorial Top Page Header */}
        <EditorialHeader
          eyebrow={currentTabDef.eyebrow}
          title={currentTabDef.title}
          stats={getHeaderStats()}
        />

        {/* Dynamic Tab Body */}
        {activeTab === 'sabado' ? (
          <SabadoScreen
            presentCount={presentCount}
            expectedCount={expectedCount}
            members={SEED_DATA.members}
            onNavigateToJovens={() => setActiveTab('jovens')}
            onNavigateToEstudos={() => setActiveTab('estudos')}
          />
        ) : (
          <PlaceholderScreen
            tabKey={activeTab}
            onBackToSabado={() => setActiveTab('sabado')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
