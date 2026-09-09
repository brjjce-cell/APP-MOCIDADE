import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Users,
  FileSpreadsheet,
  Trash2,
  X,
  TrendingUp,
} from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    balance,
    totalIncome,
    totalExpense,
    youthMembers,
    exportFinanceCSV,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // New Transaction Form State
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<
    'trabalho_arrecadacao' | 'oferta' | 'evento' | 'insumos' | 'outros'
  >('trabalho_arrecadacao');
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const openNewTransactionModal = (forcedType: 'income' | 'expense' = 'income') => {
    setType(forcedType);
    setAmount('');
    setDescription('');
    setCategory(forcedType === 'income' ? 'trabalho_arrecadacao' : 'insumos');
    setSelectedWorkers([]);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0 || !description.trim()) return;

    addTransaction({
      date: new Date().toISOString().split('T')[0],
      type,
      amount: numAmount,
      description,
      category,
      workers: type === 'income' && category === 'trabalho_arrecadacao' ? selectedWorkers : undefined,
      notes: notes.trim() ? notes : undefined,
    });

    setIsModalOpen(false);
  };

  const toggleWorkerSelection = (workerName: string) => {
    setSelectedWorkers((prev) =>
      prev.includes(workerName) ? prev.filter((w) => w !== workerName) : [...prev, workerName]
    );
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Caixa da Mocidade</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Controle descomplicado de entradas, despesas e arrecadações coletivas com registro da equipe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportFinanceCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => openNewTransactionModal('income')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Arrecadação / Entrada</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Balance */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Saldo Líquido em Caixa
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Recursos disponíveis para os encontros e retiros
          </span>
        </div>

        {/* Total Income */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Arrecadado (Entradas)
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            + R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-500 block mt-1">
            {transactions.filter((t) => t.type === 'income').length} arrecadações registradas
          </span>
        </div>

        {/* Total Expenses */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total de Gastos (Saídas)
            </span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-600 mt-2">
            - R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <button
            onClick={() => openNewTransactionModal('expense')}
            className="text-xs font-semibold text-red-700 hover:text-red-800 underline block mt-1"
          >
            + Registrar nova despesa
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Extrato de Movimentações</h3>
            <p className="text-xs text-slate-500">Histórico detalhado com equipe participante</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Saídas
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const dateFormatted = new Date(tx.date + 'T00:00:00').toLocaleDateString('pt-BR');

            return (
              <div
                key={tx.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isIncome
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {tx.description}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                        {tx.category.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Data: {dateFormatted} {tx.notes && `• ${tx.notes}`}
                    </p>

                    {/* Team that worked on the fundraiser */}
                    {tx.workers && tx.workers.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-indigo-700 font-medium">
                        <Users className="w-3.5 h-3.5" />
                        <span>Equipe que trabalhou: {tx.workers.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span
                    className={`text-base font-extrabold ${
                      isIncome ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {isIncome ? '+' : '-'} R${' '}
                    {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>

                  <button
                    onClick={() => {
                      if (confirm('Excluir este lançamento financeiro?')) {
                        deleteTransaction(tx.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {type === 'income' ? 'Registrar Nova Arrecadação / Entrada' : 'Registrar Nova Saída'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-3">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setType('income');
                    setCategory('trabalho_arrecadacao');
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    type === 'income'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Entrada (Arrecadação)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('expense');
                    setCategory('insumos');
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    type === 'expense'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Saída (Despesa)
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Descrição da Ação *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    type === 'income'
                      ? 'Ex: Venda de Doces no Bairro / Cantina do Retiro'
                      : 'Ex: Compra de carne e descartáveis'
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Valor (R$) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 350,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="trabalho_arrecadacao">Trabalho / Arrecadação</option>
                    <option value="oferta">Oferta / Doação</option>
                    <option value="evento">Evento / Inscrições</option>
                    <option value="insumos">Insumos & Compras</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>

              {/* Workers selector if fundraising work */}
              {type === 'income' && category === 'trabalho_arrecadacao' && (
                <div className="space-y-1.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Quem trabalhou nesta arrecadação?
                    </span>
                    <span className="text-[10px] text-indigo-700 font-medium">
                      {selectedWorkers.length} selecionados
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pt-1">
                    {youthMembers.map((y) => {
                      const isSelected = selectedWorkers.includes(y.name);
                      return (
                        <button
                          key={y.id}
                          type="button"
                          onClick={() => toggleWorkerSelection(y.name)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {y.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Observações complementares
                </label>
                <input
                  type="text"
                  placeholder="Ex: Doações de ingredientes pela família do Lucas"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs transition-colors"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
