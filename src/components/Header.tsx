import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import {
  Calendar,
  Users,
  Wallet,
  BookOpen,
  Calculator,
  Cake,
  Lightbulb,
  Settings,
  Sparkles,
  Download,
} from 'lucide-react';

export type { TabType };

interface HeaderProps {
  activeTab: TabType;
  setActiveTab?: (tab: TabType) => void;
  onSelectTab?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onSelectTab }) => {
  const handleTabChange = (tab: TabType) => {
    if (setActiveTab) setActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };
  const { churchProfile, balance, currentMeeting, exportAllDataJSON } = useApp();

  const navItems: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'saturday', label: 'Visão do Sábado', icon: Calendar },
    { id: 'youth', label: 'Jovens & Chamada', icon: Users },
    { id: 'finance', label: 'Caixa da Mocidade', icon: Wallet },
    { id: 'studies', label: 'Estudos & IA', icon: BookOpen },
    { id: 'events', label: 'Calculadora de Eventos', icon: Calculator },
    { id: 'birthdays', label: 'Aniversariantes', icon: Cake },
    { id: 'suppliers_ideas', label: 'Fornecedores & Ideias', icon: Lightbulb },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              MJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-none">
                  {churchProfile.name}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                  {churchProfile.themeYear.split(' ')[0]}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Liderança: <span className="font-medium text-slate-700">{churchProfile.leaders}</span> • {churchProfile.subname}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Balance Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Caixa:</span>
              <span className="text-emerald-900 font-bold">
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Next Meeting Date Badge */}
            {currentMeeting && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Próximo Sábado:</span>
                <span className="font-bold text-slate-900">
                  {new Date(currentMeeting.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
              </div>
            )}

            {/* Quick backup button */}
            <button
              onClick={exportAllDataJSON}
              title="Baixar backup completo em JSON"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar" aria-label="Navegação Principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.id === 'studies' && (
                  <Sparkles className={`w-3 h-3 ${isActive ? 'text-amber-300' : 'text-amber-500'}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
