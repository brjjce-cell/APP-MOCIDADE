import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Supplier, CreativeIdea } from '../types';
import {
  Lightbulb,
  Truck,
  PlusCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Phone,
  Tag,
  DollarSign,
  X,
  Compass,
  Gift,
} from 'lucide-react';

export const SuppliersAndIdeas: React.FC = () => {
  const { suppliers, addSupplier, creativeIdeas, addCreativeIdea } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'suppliers' | 'ideas'>('ideas');
  const [ideasCategory, setIdeasCategory] = useState<'all' | 'gifts' | 'evangelism'>('all');
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);

  // New Supplier Form
  const [supName, setSupName] = useState('');
  const [supCategory, setSupCategory] = useState<any>('alimentacao');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supRecommended, setSupRecommended] = useState(true);
  const [supNotes, setSupNotes] = useState('');
  const [supPriceObs, setSupPriceObs] = useState('');

  // AI Idea prompt state
  const [aiContext, setAiContext] = useState('');
  const [aiBudget, setAiBudget] = useState('Econômico');

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim()) return;

    addSupplier({
      name: supName,
      category: supCategory,
      contact: supContact,
      phone: supPhone,
      recommended: supRecommended,
      notes: supNotes,
      lastPriceObs: supPriceObs,
    });

    setIsNewSupplierModalOpen(false);
  };

  // Generate AI Creative Ideas
  const handleGenerateCreativeIdeas = async () => {
    setIsGeneratingIdea(true);
    try {
      const res = await fetch('/api/ai/creative-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: ideasCategory === 'all' ? 'gifts' : ideasCategory,
          budget: aiBudget,
          context: aiContext,
        }),
      });

      if (!res.ok) throw new Error('Falha na API');
      const data = await res.json();

      if (data.ideas && Array.isArray(data.ideas)) {
        data.ideas.forEach((idea: any) => {
          addCreativeIdea({
            title: idea.title,
            category: ideasCategory === 'all' ? 'gifts' : ideasCategory,
            description: idea.description,
            estimatedCost: idea.estimatedCost,
            howToExecute: idea.howToExecute,
            type: idea.type,
            context: idea.context,
          });
        });
      }
    } catch (e) {
      console.error(e);
      alert('Não foi possível gerar ideias no momento.');
    } finally {
      setIsGeneratingIdea(false);
    }
  };

  const filteredIdeas = creativeIdeas.filter((idea) => {
    if (ideasCategory === 'all') return true;
    return idea.category === ideasCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Fornecedores & Assistente Criativo</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastro de parceiros de retiros e banco de ideias para brindes e evangelismo com IA.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('ideas')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'ideas'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Banco Criativo (IA)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('suppliers')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'suppliers'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Fornecedores ({suppliers.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW: Creative Ideas & AI Assistant */}
      {activeSubTab === 'ideas' && (
        <div className="space-y-6">
          {/* AI Idea Generator Bar */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Gerador de Ideias Criativas com IA
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Sugestões práticas de brindes artesanais/encomendados e ações de evangelismo.
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateCreativeIdeas}
                disabled={isGeneratingIdea}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-300 shadow-xs transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingIdea ? 'Gerando Ideias...' : 'Sugerir Ideias com IA'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-indigo-200 font-semibold block mb-1">Área de Interesse:</label>
                <select
                  value={ideasCategory}
                  onChange={(e) => setIdeasCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
                >
                  <option value="all" className="text-slate-900">Todas as Categorias</option>
                  <option value="gifts" className="text-slate-900">Brindes & Lembrancinhas</option>
                  <option value="evangelism" className="text-slate-900">Evangelismo & Ação Social</option>
                </select>
              </div>

              <div>
                <label className="text-indigo-200 font-semibold block mb-1">Faixa de Orçamento:</label>
                <input
                  type="text"
                  value={aiBudget}
                  onChange={(e) => setAiBudget(e.target.value)}
                  placeholder="Ex: R$ 5 a R$ 10 por jovem"
                  className="w-full px-2.5 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-indigo-200 font-semibold block mb-1">Contexto ou Tema:</label>
                <input
                  type="text"
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  placeholder="Ex: Retiro de Carnaval, Praça pública, Volta às aulas"
                  className="w-full px-2.5 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIdeas.map((idea) => {
              const isGift = idea.category === 'gifts';

              return (
                <div
                  key={idea.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isGift ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isGift ? <Gift className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{idea.title}</h4>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                        {idea.type || idea.context || (isGift ? 'Brinde' : 'Ação')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {idea.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                      <span className="font-bold text-slate-800 block mb-0.5">Como executar:</span>
                      {idea.howToExecute}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {idea.estimatedCost}
                    </span>
                    <span className="text-[10px] text-slate-400">Banco de Ideias do Casal</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: Suppliers Directory */}
      {activeSubTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsNewSupplierModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar Fornecedor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{sup.name}</h4>
                      <span className="text-xs text-indigo-600 font-medium capitalize">
                        Categoria: {sup.category.replace('_', ' ')}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        sup.recommended
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {sup.recommended ? (
                        <>
                          <ThumbsUp className="w-3 h-3" />
                          <span>Recomendo</span>
                        </>
                      ) : (
                        <>
                          <ThumbsDown className="w-3 h-3" />
                          <span>Não Recomendo</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p>
                      <strong>Contato:</strong> {sup.contact} ({sup.phone})
                    </p>
                    <p className="text-slate-500">{sup.notes}</p>
                  </div>

                  {sup.lastPriceObs && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <span className="font-semibold text-slate-800 block mb-0.5">
                        Referência de Preço:
                      </span>
                      {sup.lastPriceObs}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <a
                    href={`tel:${sup.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Ligar para fornecedor</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Supplier Modal */}
      {isNewSupplierModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Novo Fornecedor / Parceiro</h3>
              <button
                onClick={() => setIsNewSupplierModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nome da Empresa / Fornecedor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chácara Recanto Verde"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={supCategory}
                    onChange={(e) => setSupCategory(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="chacara_retiro">Chácara / Sítio</option>
                    <option value="alimentacao">Alimentação / Insumos</option>
                    <option value="transporte">Vans & Transporte</option>
                    <option value="grafica">Gráfica & Camisetas</option>
                    <option value="som_luz">Som & Iluminação</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Avaliação Rápida
                  </label>
                  <select
                    value={supRecommended ? 'yes' : 'no'}
                    onChange={(e) => setSupRecommended(e.target.value === 'yes')}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="yes">👍 Recomendo</option>
                    <option value="no">👎 Não Recomendo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nome do Contato
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dona Maria"
                    value={supContact}
                    onChange={(e) => setSupContact(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: (85) 99999-8888"
                    value={supPhone}
                    onChange={(e) => setSupPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Observações de Preço / Valores cobrados
                </label>
                <input
                  type="text"
                  placeholder="Ex: R$ 45 a diária por pessoa com piscina inclusa"
                  value={supPriceObs}
                  onChange={(e) => setSupPriceObs(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Detalhes e avaliação
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Atendimento excelente, mas precisa levar panelas grandes..."
                  value={supNotes}
                  onChange={(e) => setSupNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewSupplierModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs transition-colors"
                >
                  Salvar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
