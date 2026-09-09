import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { YouthMember } from '../types';
import {
  Cake,
  Calendar,
  MessageCircle,
  Download,
  Sparkles,
  Share2,
  Gift,
  Send,
  Check,
} from 'lucide-react';
import { createWhatsAppLink, WHATSAPP_TEMPLATES } from '../utils/whatsapp';

export const BirthdayModule: React.FC = () => {
  const { youthMembers, churchProfile } = useApp();

  const [selectedYouth, setSelectedYouth] = useState<YouthMember>(youthMembers[0]);
  const [isGeneratingAiMsg, setIsGeneratingAiMsg] = useState(false);
  const [aiMsg, setAiMsg] = useState<{ shortMsg: string; groupMsg: string; verse: string } | null>(
    null
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentDay = today.getDate();

  // Filter birthdays this month
  const birthdaysThisMonth = youthMembers
    .filter((y) => {
      const parts = y.birthDate.split('-');
      const month = parseInt(parts[1], 10);
      return month === currentMonth;
    })
    .sort((a, b) => {
      const dayA = parseInt(a.birthDate.split('-')[2], 10);
      const dayB = parseInt(b.birthDate.split('-')[2], 10);
      return dayA - dayB;
    });

  // Generate Card Image in HTML Canvas
  const handleDownloadCard = (youth: YouthMember) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient (Elegant Royal Indigo / Purple)
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#1e1b4b'); // deep indigo
    gradient.addColorStop(0.5, '#312e81');
    gradient.addColorStop(1, '#4338ca');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Decorative circular glowing rings
    ctx.beginPath();
    ctx.arc(540, 480, 320, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)'; // amber glow
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(540, 480, 340, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Small stars/dots
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(280, 240, 6, 0, 2 * Math.PI);
    ctx.arc(800, 300, 8, 0, 2 * Math.PI);
    ctx.arc(750, 780, 5, 0, 2 * Math.PI);
    ctx.arc(320, 820, 7, 0, 2 * Math.PI);
    ctx.fill();

    // Church / Ministry Header
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.textAlign = 'center';
    ctx.fillText(churchProfile.name.toUpperCase(), 540, 160);

    // Subtitle Tag
    ctx.font = 'bold 44px sans-serif';
    ctx.fillStyle = '#fbbf24'; // amber
    ctx.fillText('FELIZ ANIVERSÁRIO!', 540, 260);

    // Youth Name
    ctx.font = '900 80px sans-serif';
    ctx.fillStyle = '#ffffff';
    const displayName = youth.nickname ? `${youth.name} ("${youth.nickname}")` : youth.name;
    ctx.fillText(displayName, 540, 480);

    // Birth Date Text
    const birthFormatted = new Date(youth.birthDate + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
    });
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = '#a5b4fc';
    ctx.fillText(`🎉 Celebrando sua vida neste ${birthFormatted} 🎉`, 540, 560);

    // Blessing Verse Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.roundRect(140, 660, 800, 180, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    ctx.font = 'italic 32px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('"O Senhor te abençoe e te guarde; o Senhor faça', 540, 725);
    ctx.fillText('resplandecer o seu rosto sobre ti." — Números 6:24', 540, 775);

    // Footer signature
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Com carinho, ${churchProfile.leaders} & Família Conectados`, 540, 940);

    // Download triggered
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `aniversario_${youth.name.toLowerCase().replace(/\s+/g, '_')}.png`;
    a.click();
  };

  // Generate AI Birthday Message
  const handleGenerateAiMessage = async (youth: YouthMember) => {
    setIsGeneratingAiMsg(true);
    try {
      const res = await fetch('/api/ai/birthday-msg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: youth.name,
          nickname: youth.nickname,
          traits: youth.notes || 'jovem dedicado do ministério',
        }),
      });

      if (!res.ok) throw new Error('Erro na API');
      const data = await res.json();
      setAiMsg(data);
    } catch (e) {
      console.error(e);
      setAiMsg({
        shortMsg: WHATSAPP_TEMPLATES.birthdayPrivate(youth.nickname || youth.name.split(' ')[0]),
        groupMsg: WHATSAPP_TEMPLATES.birthdayGroup(
          youth.name,
          'O Senhor te abençoe e te guarde — Números 6:24'
        ),
        verse: 'Números 6:24-25',
      });
    } finally {
      setIsGeneratingAiMsg(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Módulo de Aniversariantes</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Identificação automática do mês/semana, gerador de arte personalizada para baixar e mensagens prontas para WhatsApp.
        </p>
      </div>

      {/* Birthdays This Month Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20">
              <Cake className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Mês Vigente (Setembro)
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {birthdaysThisMonth.length} Aniversariantes neste Mês
              </h3>
            </div>
          </div>

          <span className="text-xs text-indigo-200 self-start sm:self-auto">
            Gere a arte personalizada e parabenize no grupo!
          </span>
        </div>

        {/* List of Birthdays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-5">
          {birthdaysThisMonth.map((youth) => {
            const birthDay = parseInt(youth.birthDate.split('-')[2], 10);
            const isToday = birthDay === currentDay;

            return (
              <div
                key={youth.id}
                className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{youth.name}</span>
                    {isToday && (
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                        HOJE!
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-indigo-200">
                    Dia {birthDay} de Setembro
                  </span>
                </div>

                <button
                  onClick={() => setSelectedYouth(youth)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  Gerar Arte
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Generator Preview & Actions */}
      {selectedYouth && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Card Mockup (Left Column) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Arte Personalizada: {selectedYouth.name}
                </h3>
                <p className="text-xs text-slate-500">Template oficial do Ministério de Jovens</p>
              </div>

              <button
                onClick={() => handleDownloadCard(selectedYouth)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Arte (PNG)</span>
              </button>
            </div>

            {/* Visual Preview Container */}
            <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-inner relative overflow-hidden">
              {/* Top watermark */}
              <span className="text-[10px] sm:text-xs font-bold text-indigo-300 tracking-widest uppercase">
                {churchProfile.name}
              </span>

              {/* Title & Name */}
              <div className="space-y-2 my-auto">
                <span className="text-xs sm:text-sm font-extrabold text-amber-400 tracking-wider">
                  ✨ FELIZ ANIVERSÁRIO! ✨
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {selectedYouth.name}
                </h4>
                {selectedYouth.nickname && (
                  <span className="text-sm font-bold text-indigo-300 block">
                    "{selectedYouth.nickname}"
                  </span>
                )}
                <span className="text-xs text-indigo-200 block pt-1">
                  {new Date(selectedYouth.birthDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                  })}
                </span>
              </div>

              {/* Verse */}
              <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs text-slate-200 italic max-w-xs">
                "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti." — Nm 6:24
              </div>

              {/* Footer */}
              <span className="text-[10px] text-indigo-300/80 pt-2">
                Com carinho, {churchProfile.leaders}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Dica: baixe o arquivo PNG e anexe no WhatsApp individual ou no grupo da mocidade.
            </p>
          </div>

          {/* WhatsApp Greetings & AI Generator (Right Column) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Mensagens Prontas de WhatsApp</h3>
                <p className="text-xs text-slate-500">Envio individual ou para o grupo geral</p>
              </div>

              <button
                onClick={() => handleGenerateAiMessage(selectedYouth)}
                disabled={isGeneratingAiMsg}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-xs transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingAiMsg ? 'Gerando...' : 'Mensagem com IA'}</span>
              </button>
            </div>

            {/* Message 1: Mensagem para o Privado */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                Mensagem para o Privado do Jovem
              </span>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed italic">
                "{aiMsg ? aiMsg.shortMsg : WHATSAPP_TEMPLATES.birthdayPrivate(selectedYouth.nickname || selectedYouth.name.split(' ')[0])}"
              </p>
              <a
                href={createWhatsAppLink(
                  selectedYouth.phone,
                  aiMsg ? aiMsg.shortMsg : WHATSAPP_TEMPLATES.birthdayPrivate(selectedYouth.nickname || selectedYouth.name.split(' ')[0])
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar no Privado</span>
              </a>
            </div>

            {/* Message 2: Mensagem para o Grupo da Mocidade */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-purple-600" />
                Mensagem para o Grupo da Mocidade
              </span>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed italic">
                "{aiMsg ? aiMsg.groupMsg : WHATSAPP_TEMPLATES.birthdayGroup(selectedYouth.name, 'O Senhor te abençoe e te guarde — Números 6:24')}"
              </p>
              <a
                href={createWhatsAppLink(
                  '',
                  aiMsg ? aiMsg.groupMsg : WHATSAPP_TEMPLATES.birthdayGroup(selectedYouth.name, 'O Senhor te abençoe e te guarde — Números 6:24')
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar no Grupo Geral</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
