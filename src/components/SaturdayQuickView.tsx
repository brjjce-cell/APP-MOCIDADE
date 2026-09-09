import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Users,
  Copy,
  ExternalLink,
  MessageCircle,
  Share2,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { createWhatsAppLink, WHATSAPP_TEMPLATES } from '../utils/whatsapp';

export const SaturdayQuickView: React.FC = () => {
  const {
    currentMeeting,
    meetings,
    setCurrentMeetingId,
    youthMembers,
    toggleAttendance,
    bibleStudies,
  } = useApp();

  const [copiedStudy, setCopiedStudy] = useState(false);
  const [copiedScale, setCopiedScale] = useState(false);

  if (!currentMeeting) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-500">Nenhum encontro cadastrado no calendário.</p>
      </div>
    );
  }

  // Find linked study if available
  const study = bibleStudies.find(
    (s) => s.id === currentMeeting.studyId || s.title === currentMeeting.studyTitle
  ) || bibleStudies[0];

  // Calculate attendance statistics
  const presentCount = currentMeeting.attendees.length;
  const attendanceRate = Math.round(
    (presentCount / (currentMeeting.expectedAttendees || 1)) * 100
  );

  // Youths in warning state (absent 3+ weeks)
  const warningYouth = youthMembers.filter((y) => y.consecutiveAbsences >= 3);

  // Birthdays in the current week/month
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const birthdayYouthThisMonth = youthMembers.filter((y) => {
    const birthMonth = parseInt(y.birthDate.split('-')[1], 10);
    return birthMonth === currentMonth;
  });

  // Calculate days until meeting
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const meetingDate = new Date(currentMeeting.date + 'T00:00:00');
  const diffTime = meetingDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Copy full study text
  const handleCopyStudy = () => {
    if (!study) return;
    const studyFullText = `📖 ESTUDO BÍBLICO: ${study.title}\nPassagem: ${study.passage}\nTema: ${study.theme}\n\nESBOÇO:\n${study.outline}\n\nAPLICAÇÃO PRÁTICA:\n${study.practicalApplication}`;
    navigator.clipboard.writeText(studyFullText);
    setCopiedStudy(true);
    setTimeout(() => setCopiedStudy(false), 2500);
  };

  // Copy meeting scale for WhatsApp
  const handleCopyScale = () => {
    const dateFormatted = new Date(currentMeeting.date + 'T00:00:00').toLocaleDateString('pt-BR');
    const scaleText = `📋 *ESCALA DO CULTO JOVEM — ${dateFormatted}*\n_${currentMeeting.title}_\n\n` +
      `🎤 *Louvor:* ${currentMeeting.roles.praise.join(', ') || 'A definir'}\n` +
      `🤝 *Recepção:* ${currentMeeting.roles.reception.join(', ') || 'A definir'}\n` +
      `🥪 *Cantina/Lanche:* ${currentMeeting.roles.snack.join(', ') || 'A definir'}\n` +
      `📱 *Mídia/Projeção:* ${currentMeeting.roles.media.join(', ') || 'A definir'}\n` +
      `📖 *Palavra/Estudo:* ${currentMeeting.roles.preacher}\n\n` +
      `💡 *Estudo:* ${currentMeeting.studyTitle}\n` +
      `Vamos juntos com alegria servir ao Senhor! 🔥`;

    navigator.clipboard.writeText(scaleText);
    setCopiedScale(true);
    setTimeout(() => setCopiedScale(false), 2500);
  };

  // Open NotebookLM with quick helper
  const handleOpenNotebookLM = () => {
    handleCopyStudy();
    window.open('https://notebooklm.google.com', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                {diffDays === 0
                  ? '⚡ HOJE É SÁBADO DE ENCONTRO!'
                  : diffDays > 0
                  ? `📅 Faltam ${diffDays} dias para o sábado`
                  : 'Sábado concluído'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {new Date(currentMeeting.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
              {currentMeeting.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Trocar encontro:</label>
            <select
              value={currentMeeting.id}
              onChange={(e) => setCurrentMeetingId(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {meetings.map((m) => (
                <option key={m.id} value={m.id}>
                  {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-500 font-medium block">Confirmados Hoje</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{presentCount}</span>
              <span className="text-xs text-slate-500">/ {currentMeeting.expectedAttendees}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, attendanceRate)}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-500 font-medium block">Escalados no Serviço</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {currentMeeting.roles.praise.length +
                currentMeeting.roles.reception.length +
                currentMeeting.roles.snack.length +
                currentMeeting.roles.media.length +
                (currentMeeting.roles.preacher ? 1 : 0)}
            </span>
            <span className="text-xs text-emerald-600 font-medium">5 funções ativas</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-500 font-medium block">Em Alerta (Faltas)</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
              {warningYouth.length}
            </span>
            <span className="text-xs text-slate-500">3+ ausências</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-500 font-medium block">Aniversariantes no Mês</span>
            <span className="text-2xl font-extrabold text-purple-700 mt-1 block">
              {birthdayYouthThisMonth.length}
            </span>
            <span className="text-xs text-slate-500">Neste mês</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Escala do Dia + Estudo do Dia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module: Escala de Serviço do Dia */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Escala da Equipe</h3>
                <p className="text-xs text-slate-500">Funções organizadas para o sábado</p>
              </div>
            </div>

            <button
              onClick={handleCopyScale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {copiedScale ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Escala Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar para WhatsApp</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Louvor & Adoração
              </span>
              <span className="text-xs font-medium text-slate-900">
                {currentMeeting.roles.praise.join(', ') || 'Ninguém escalado'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Recepção & Boas-Vindas
              </span>
              <span className="text-xs font-medium text-slate-900">
                {currentMeeting.roles.reception.join(', ') || 'Ninguém escalado'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Cantina & Arrecadação
              </span>
              <span className="text-xs font-medium text-slate-900">
                {currentMeeting.roles.snack.join(', ') || 'Ninguém escalado'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-600" />
                Mídia & Som
              </span>
              <span className="text-xs font-medium text-slate-900">
                {currentMeeting.roles.media.join(', ') || 'Ninguém escalado'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                Palavra / Ministração
              </span>
              <span className="text-xs font-bold text-slate-900">
                {currentMeeting.roles.preacher || 'Breno & Esposa'}
              </span>
            </div>
          </div>

          {currentMeeting.generalNotes && (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-xs text-amber-900">
              <span className="font-semibold block mb-0.5">Lembrete para sábado:</span>
              {currentMeeting.generalNotes}
            </div>
          )}
        </div>

        {/* Module: Estudo Bíblico do Dia */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Estudo do Dia</h3>
                  <p className="text-xs text-slate-500">Tema a ser ministrado no encontro</p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Definido
              </span>
            </div>

            {study ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-sm font-bold text-slate-900">{study.title}</h4>
                <p className="text-xs text-indigo-700 font-semibold">
                  📖 {study.passage}
                </p>
                <p className="text-xs text-slate-600 line-clamp-3">
                  {study.outline}
                </p>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-xs font-semibold text-slate-700 block">Aplicação Prática:</span>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                    {study.practicalApplication}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 text-amber-800 text-xs">
                Nenhum estudo vinculado a este encontro ainda.
              </div>
            )}
          </div>

          {/* Action Buttons for Study */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleCopyStudy}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {copiedStudy ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Texto Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Conteúdo</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenNotebookLM}
              title="Copia o estudo e abre o NotebookLM para gerar resumos de áudio ou estudo aprofundado"
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir NotebookLM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Check-in & Pastoral Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fast Attendance Check-in for Saturday */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Chamada Rápida do Dia</h3>
              <p className="text-xs text-slate-500">
                Toque no nome para marcar ou desmarcar presença ({presentCount} presentes)
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {attendanceRate}% da meta
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
            {youthMembers.map((youth) => {
              const isPresent = currentMeeting.attendees.includes(youth.id);
              return (
                <button
                  key={youth.id}
                  onClick={() => toggleAttendance(currentMeeting.id, youth.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    isPresent
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                      : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="text-xs block truncate font-medium">
                      {youth.name}
                    </span>
                    {youth.nickname && (
                      <span className="text-[10px] text-slate-500 block">
                        "{youth.nickname}"
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      isPresent
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isPresent && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pastoral Care & Warning Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Atenção Pastoral</h3>
              <p className="text-xs text-slate-500">Jovens com 3+ faltas seguidas</p>
            </div>
          </div>

          {warningYouth.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
              Nenhum jovem em alerta de afastamento no momento! 🎉
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {warningYouth.map((youth) => {
                const waLink = createWhatsAppLink(
                  youth.phone,
                  WHATSAPP_TEMPLATES.absenceWarning(youth.nickname || youth.name.split(' ')[0])
                );
                return (
                  <div
                    key={youth.id}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {youth.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                        {youth.consecutiveAbsences} faltas
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {youth.notes || 'Sem observação pastoral registrada.'}
                    </p>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Mandar "Sentimos sua falta"</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
