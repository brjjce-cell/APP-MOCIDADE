import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Download,
  Upload,
  FileSpreadsheet,
  Building,
  RotateCcw,
  Check,
  ShieldCheck,
  Layers,
  Save,
} from 'lucide-react';

export const BackupAndMultiTenant: React.FC = () => {
  const {
    churchProfile,
    setChurchProfile,
    exportAllDataJSON,
    importDataJSON,
    exportYouthCSV,
    exportFinanceCSV,
    resetToDefaults,
  } = useApp();

  const [name, setName] = useState(churchProfile.name);
  const [subname, setSubname] = useState(churchProfile.subname);
  const [leaders, setLeaders] = useState(churchProfile.leaders);
  const [verseOfTheYear, setVerseOfTheYear] = useState(churchProfile.verseOfTheYear);
  const [themeYear, setThemeYear] = useState(churchProfile.themeYear);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setChurchProfile({
      ...churchProfile,
      name,
      subname,
      leaders,
      verseOfTheYear,
      themeYear,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          alert('Backup restaurado com sucesso!');
        } else {
          alert('Arquivo de backup inválido.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Configurações, Backup & Multi-Igreja</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Gerenciamento de perfil do ministério, exportação de segurança e preparação para multi-igrejas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Church Profile Config (Left Column) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Perfil do Ministério & Liderança
              </h3>
              <p className="text-xs text-slate-500">Dados exibidos no cabeçalho e nos relatórios</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nome do Ministério de Jovens *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Igreja Local / Congregação
                </label>
                <input
                  type="text"
                  value={subname}
                  onChange={(e) => setSubname(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Líderes Responsáveis
                </label>
                <input
                  type="text"
                  value={leaders}
                  onChange={(e) => setLeaders(e.target.value)}
                  placeholder="Ex: Breno & Esposa"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tema do Ano
                </label>
                <input
                  type="text"
                  value={themeYear}
                  onChange={(e) => setThemeYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Versículo Oficial do Ano
                </label>
                <input
                  type="text"
                  value={verseOfTheYear}
                  onChange={(e) => setVerseOfTheYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Dados atualizados com sucesso!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>

          {/* Multi-tenant Architecture Notice (Módulo 2.14) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Preparado para Multi-Igreja (Multi-Tenant)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              O banco de dados armazena os dados sob o identificador único <code>{churchProfile.id}</code>.
              Cada igreja mantém seus jovens, caixas e estudos 100% isolados, pronto para expansão ou venda para outros ministérios.
            </p>
          </div>
        </div>

        {/* Backup & Export (Right Column) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Export / Import Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Backup & Segurança</h3>
                <p className="text-xs text-slate-500">Nunca dependa exclusivamente do app</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={exportAllDataJSON}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Baixar Backup Completo (JSON)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Inclui jovens, finanças, estudos e eventos
                  </span>
                </div>
                <Download className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={exportYouthCSV}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Exportar Cadastro de Jovens (CSV/Excel)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Planilha com telefones, aniversários e notas
                  </span>
                </div>
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={exportFinanceCSV}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Exportar Livro Caixa (CSV/Excel)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Planilha detalhada de entradas, saídas e equipes
                  </span>
                </div>
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              </button>

              {/* Restore JSON */}
              <div className="pt-2 border-t border-slate-100">
                <label className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-left cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Restaurar Backup (JSON)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Subir arquivo gerado anteriormente
                    </span>
                  </div>
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Reset Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Restaurar Dados Padrão</span>
              <span className="text-[11px] text-slate-500">
                Recarrega os exemplos iniciais do Ministério Conectados
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm('Deseja recarregar os dados de demonstração iniciais?')) {
                  resetToDefaults();
                }
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Restaurar dados de teste"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
