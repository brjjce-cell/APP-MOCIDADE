import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { YouthMember } from '../types';
import {
  Users,
  UserPlus,
  Search,
  MessageCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Phone,
  Edit2,
  Trash2,
  Filter,
  FileSpreadsheet,
  X,
  Send,
} from 'lucide-react';
import { createWhatsAppLink, WHATSAPP_TEMPLATES } from '../utils/whatsapp';

export const YouthManager: React.FC = () => {
  const {
    youthMembers,
    addYouthMember,
    updateYouthMember,
    deleteYouthMember,
    exportYouthCSV,
    currentMeeting,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'warning' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingYouth, setEditingYouth] = useState<YouthMember | null>(null);
  const [whatsappModalYouth, setWhatsappModalYouth] = useState<YouthMember | null>(null);
  const [customMsg, setCustomMsg] = useState('');

  // Form State for Add/Edit
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [roles, setRoles] = useState<string[]>([]);

  const availableRoles = ['Louvor', 'Recepção', 'Cantina', 'Mídia', 'Infra', 'Teatro/Dança'];

  const openAddModal = () => {
    setEditingYouth(null);
    setName('');
    setNickname('');
    setBirthDate('');
    setPhone('');
    setNotes('');
    setRoles([]);
    setIsAddModalOpen(true);
  };

  const openEditModal = (youth: YouthMember) => {
    setEditingYouth(youth);
    setName(youth.name);
    setNickname(youth.nickname || '');
    setBirthDate(youth.birthDate);
    setPhone(youth.phone);
    setNotes(youth.notes || '');
    setRoles(youth.roles || []);
    setIsAddModalOpen(true);
  };

  const handleSaveYouth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingYouth) {
      updateYouthMember(editingYouth.id, {
        name,
        nickname,
        birthDate,
        phone,
        notes,
        roles,
      });
    } else {
      addYouthMember({
        name,
        nickname,
        birthDate: birthDate || '2005-01-01',
        phone: phone || '(85) 90000-0000',
        notes,
        roles,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
      });
    }

    setIsAddModalOpen(false);
  };

  const toggleRoleSelection = (role: string) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  // Filter youths
  const filteredYouths = youthMembers.filter((youth) => {
    const matchesSearch =
      youth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (youth.nickname && youth.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (youth.notes && youth.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'warning'
        ? youth.consecutiveAbsences >= 3 || youth.status === 'warning'
        : youth.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Jovens & Acompanhamento</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastro, frequência aos encontros, alertas de ausência e comunicação direta via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportYouthCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar Planilha (CSV)</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Jovem</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, apelido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({youthMembers.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Ativos ({youthMembers.filter((y) => y.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('warning')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'warning'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⚠️ Em Alerta ({youthMembers.filter((y) => y.consecutiveAbsences >= 3).length})
          </button>
        </div>
      </div>

      {/* Youth Members Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredYouths.map((youth) => {
          const isWarning = youth.consecutiveAbsences >= 3;
          const birthFormatted = new Date(youth.birthDate + 'T00:00:00').toLocaleDateString(
            'pt-BR',
            { day: '2-digit', month: 'short' }
          );

          return (
            <div
              key={youth.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition-all ${
                isWarning
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {youth.name}
                    </h3>
                    {youth.nickname && (
                      <span className="text-xs text-indigo-600 font-medium">
                        "{youth.nickname}"
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isWarning
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isWarning
                      ? `${youth.consecutiveAbsences} faltas seguidas`
                      : `${youth.totalMeetingsPresent} presenças`}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{youth.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Aniversário: <strong>{birthFormatted}</strong></span>
                  </div>
                </div>

                {/* Roles Tags */}
                {youth.roles && youth.roles.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {youth.roles.map((r) => (
                      <span
                        key={r}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pastoral Notes */}
                {youth.notes && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700 block mb-0.5">Observação pastoral:</span>
                    {youth.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setWhatsappModalYouth(youth);
                    setCustomMsg('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(youth)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Editar dados"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Deseja remover ${youth.name} do cadastro?`)) {
                        deleteYouthMember(youth.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Excluir jovem"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Modal with Safe Direct Templates */}
      {whatsappModalYouth && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Enviar WhatsApp para {whatsappModalYouth.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Abre a conversa oficial no WhatsApp com a mensagem pronta no campo de texto.
                </p>
              </div>
              <button
                onClick={() => setWhatsappModalYouth(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Escolha um modelo pronto ou personalize:
              </span>

              {/* Template 1: Sentimos sua falta */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <span className="text-xs font-bold text-slate-800">1. "Sentimos sua falta"</span>
                <p className="text-xs text-slate-600 italic">
                  "{WHATSAPP_TEMPLATES.absenceWarning(whatsappModalYouth.nickname || whatsappModalYouth.name.split(' ')[0])}"
                </p>
                <a
                  href={createWhatsAppLink(
                    whatsappModalYouth.phone,
                    WHATSAPP_TEMPLATES.absenceWarning(whatsappModalYouth.nickname || whatsappModalYouth.name.split(' ')[0])
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar este modelo</span>
                </a>
              </div>

              {/* Template 2: Lembrete do Sábado */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <span className="text-xs font-bold text-slate-800">2. "Lembrete do Encontro de Sábado"</span>
                <p className="text-xs text-slate-600 italic">
                  "{WHATSAPP_TEMPLATES.meetingReminder(
                    whatsappModalYouth.nickname || whatsappModalYouth.name.split(' ')[0],
                    currentMeeting?.date ? new Date(currentMeeting.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'sábado',
                    currentMeeting?.studyTitle || 'nosso estudo'
                  )}"
                </p>
                <a
                  href={createWhatsAppLink(
                    whatsappModalYouth.phone,
                    WHATSAPP_TEMPLATES.meetingReminder(
                      whatsappModalYouth.nickname || whatsappModalYouth.name.split(' ')[0],
                      currentMeeting?.date ? new Date(currentMeeting.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'sábado',
                      currentMeeting?.studyTitle || 'nosso estudo'
                    )
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar este modelo</span>
                </a>
              </div>

              {/* Custom message field */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-semibold text-slate-700">Ou digite uma mensagem livre:</label>
                <textarea
                  rows={2}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Escreva algo específico..."
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {customMsg.trim() && (
                  <a
                    href={createWhatsAppLink(whatsappModalYouth.phone, customMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar mensagem digitada</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Youth Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingYouth ? 'Editar Jovem' : 'Cadastrar Novo Jovem'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveYouth} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Lucas Ferreira"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Apelido carinhoso
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Ex: Luquinhas"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (85) 98888-7777"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Áreas de Atuação / Funções
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableRoles.map((role) => (
                    <button
                      type="button"
                      key={role}
                      onClick={() => toggleRoleSelection(role)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                        roles.includes(role)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Observações Pastorais (Privadas para o casal)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Está prestando vestibular, precisa de incentivo. Mora com os avós."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
