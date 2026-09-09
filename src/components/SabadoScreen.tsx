import React, { useState } from 'react';
import { MemberData } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';
import { BirthdayModal } from './BirthdayModal';

interface SabadoScreenProps {
  presentCount: number;
  expectedCount: number;
  members: MemberData[];
  onNavigateToJovens: () => void;
  onNavigateToEstudos: () => void;
}

export const SabadoScreen: React.FC<SabadoScreenProps> = ({
  presentCount,
  expectedCount,
  members,
  onNavigateToJovens,
  onNavigateToEstudos,
}) => {
  const [selectedBirthday, setSelectedBirthday] = useState<{
    name: string;
    day: string;
    age: number;
    phone?: string;
  } | null>(null);

  const presentPct = Math.round((presentCount / expectedCount) * 100);

  // Escala fixa do sábado conforme o protótipo
  const escala = [
    { label: 'Louvor', names: 'Gabriel Silva · Juliana Mendes · Mateus Oliveira', delay: '0s' },
    { label: 'Recepção', names: 'Beatriz Lima · Mariana Costa', delay: '0.06s' },
    { label: 'Cantina', names: 'Larissa Andrade', delay: '0.12s' },
    { label: 'Mídia', names: 'Mariana Costa', delay: '0.18s' },
    { label: 'Pregação', names: 'Breno (Líder)', delay: '0.24s' },
  ];

  // Jovens em alerta (status !== 'active')
  const statusMap: Record<string, string> = {
    warning: 'alerta',
    inactive: 'afastado',
    active: 'ativo',
  };

  const alerts = members
    .filter((m) => m.status !== 'active')
    .map((m) => ({
      ...m,
      detail: `${m.abs} faltas seguidas · ${statusMap[m.status] || 'alerta'}`,
      waUrl: createWhatsAppUrl(
        m.phone,
        `Oi, ${m.nick}! Aqui é o Breno da mocidade. Senti sua falta nos últimos sábados — tá tudo bem por aí? Bora tomar um açaí essa semana?`
      ),
    }));

  // Aniversariantes de setembro (mês 09)
  const birthdays = members
    .filter((m) => {
      const month = m.birth.slice(5, 7);
      return month === '09';
    })
    .map((m) => {
      const day = m.birth.slice(8, 10);
      const birthYear = parseInt(m.birth.slice(0, 4), 10);
      const age = 2026 - birthYear;
      return {
        name: m.name,
        day,
        age,
        phone: m.phone,
      };
    })
    .sort((a, b) => parseInt(a.day, 10) - parseInt(b.day, 10));

  // Lembretes automáticos
  const reminders = [
    {
      text: 'Estudo do sábado 12/09 já está definido e exportado.',
      dot: 'var(--good)',
    },
    {
      text: 'Transporte do Retiro 2027 sem orçamento fechado — 5 meses para o evento.',
      dot: 'var(--warn)',
    },
    {
      text: 'Caixa cobre 39% do retiro. Faltam R$ 1.959,50 em trabalhos de arrecadação.',
      dot: 'var(--warn)',
    },
    {
      text: '3 aniversariantes em setembro sem arte gerada.',
      dot: 'var(--accent)',
    },
  ];

  return (
    <div
      id="screen-sabado-container"
      className="flex flex-col gap-[30px] p-[20px] md:p-[26px_30px_34px] min-w-0"
    >
      {/* Top Section: Encontro da semana & Escala do sábado */}
      <section
        id="section-encontro-escala"
        className="grid grid-cols-1 md:grid-cols-2 gap-[30px] animate-rise"
      >
        {/* Left Column: Encontro da Semana */}
        <div>
          <div
            className="pb-[9px] border-b text-[9.5px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--faint)',
              borderColor: 'var(--ink)',
            }}
          >
            Encontro da semana
          </div>

          {/* Breathing Dot & Time */}
          <div className="flex items-center gap-[9px] mt-4">
            <span
              className="w-[6px] h-[6px] rounded-full shrink-0 animate-breathe"
              style={{ background: 'var(--accent)' }}
            />
            <span
              className="text-[11px]"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                color: 'var(--mute)',
              }}
            >
              faltam 4 dias · sábado 19h
            </span>
          </div>

          {/* Meeting Title */}
          <h2
            className="m-0 mt-[10px] text-[32px] md:text-[36px] font-normal leading-[1.06] tracking-[-0.015em]"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
          >
            Culto Jovem: Fé em Meio à Pressão
          </h2>

          {/* Description */}
          <p
            className="m-0 mt-3 text-[14px] leading-[1.62] max-w-[48ch]"
            style={{ color: 'var(--mute)' }}
          >
            Estudo em Daniel 1:8-16 sobre identidade cristã na universidade e no trabalho. Pregação com Breno.
          </p>

          {/* Pill Action Buttons */}
          <div className="flex gap-[9px] flex-wrap mt-5">
            <button
              id="btn-abrir-chamada"
              onClick={onNavigateToJovens}
              className="py-3 px-5 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'var(--ink)',
                color: 'var(--paper)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--ink)';
                e.currentTarget.style.color = 'var(--paper)';
              }}
            >
              Abrir chamada
            </button>

            <button
              id="btn-ver-estudo"
              onClick={onNavigateToEstudos}
              className="py-3 px-5 rounded-full text-[13px] font-semibold cursor-pointer border transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                borderColor: 'var(--ink)',
                color: 'var(--ink)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accentSoft)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Ver estudo
            </button>
          </div>

          {/* Presence Progress Bar */}
          <div className="mt-[26px]">
            <div className="flex items-baseline justify-between gap-2.5">
              <span className="text-[12.5px]" style={{ color: 'var(--mute)' }}>
                Presença confirmada
              </span>
              <span
                className="text-[28px] font-normal"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
              >
                {presentCount}
                <span
                  className="text-[15px] ml-1"
                  style={{ color: 'var(--faint)' }}
                >
                  / {expectedCount}
                </span>
              </span>
            </div>

            {/* 3px Progress Track */}
            <div
              className="h-[3px] rounded-full overflow-hidden mt-[9px]"
              style={{ background: 'var(--rule)' }}
            >
              <div
                className="h-full rounded-full animate-grow"
                style={{
                  width: `${presentPct}%`,
                  background: 'var(--accent)',
                  transition: 'width 0.5s cubic-bezier(0.2, 0.9, 0.2, 1)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Escala do sábado */}
        <div>
          <div
            className="pb-[9px] border-b text-[9.5px] uppercase tracking-[0.12em] flex justify-between items-center"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--faint)',
              borderColor: 'var(--ink)',
            }}
          >
            <span>Escala do sábado</span>
            <span>8 escalados</span>
          </div>

          {/* Escala Lines with Stagger and Rule Separators */}
          <div className="flex flex-col">
            {escala.map((item, idx) => (
              <div
                key={idx}
                id={`escala-item-${idx}`}
                className="grid grid-cols-[86px_minmax(0,1fr)] gap-[14px] py-3 border-b border-[var(--rule)] animate-slide-in"
                style={{ animationDelay: item.delay }}
              >
                <div
                  className="text-[10px] tracking-[0.06em] uppercase"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    color: 'var(--faint)',
                  }}
                >
                  {item.label}
                </div>
                <div
                  className="text-[13.5px] leading-[1.45]"
                  style={{ color: 'var(--ink)' }}
                >
                  {item.names}
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div
            className="mt-[14px] text-[12.5px] leading-[1.55]"
            style={{ color: 'var(--mute)' }}
          >
            <span className="font-semibold" style={{ color: 'var(--ink)' }}>
              Nota:{' '}
            </span>
            levar violão afinado e checar microfones sem fio com pilha nova.
          </div>
        </div>
      </section>

      {/* Bottom Section: Em alerta · Aniversariantes de setembro · Lembretes automáticos */}
      <section
        id="section-alertas-aniversarios-lembretes"
        className="grid grid-cols-1 md:grid-cols-3 gap-[30px] animate-rise"
        style={{ animationDelay: '0.08s' }}
      >
        {/* Column 1: Em alerta */}
        <div id="col-em-alerta">
          <div
            className="pb-[9px] border-b text-[9.5px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--faint)',
              borderColor: 'var(--ink)',
            }}
          >
            Em alerta
          </div>

          <div className="flex flex-col">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                id={`alerta-jovem-${alert.id}`}
                className="flex items-center gap-[13px] py-[13px] border-b border-[var(--rule)] transition-transform duration-300 hover:translate-x-1"
              >
                {/* Consecutive Absences in Instrument Serif 22px */}
                <div
                  className="text-[22px] shrink-0 w-6 text-center leading-none"
                  style={{
                    fontFamily: '"Instrument Serif", Georgia, serif',
                    color: 'var(--accent)',
                  }}
                >
                  {alert.abs}
                </div>

                {/* Name & Detail */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[13.5px] font-semibold truncate"
                    style={{ color: 'var(--ink)' }}
                  >
                    {alert.name}
                  </div>
                  <div
                    className="text-[11.5px] mt-0.5 truncate"
                    style={{ color: 'var(--mute)' }}
                  >
                    {alert.detail}
                  </div>
                </div>

                {/* Direct WhatsApp Pill Button */}
                <a
                  id={`btn-wa-${alert.id}`}
                  href={alert.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-[7px] px-[13px] rounded-full text-[11px] font-semibold shrink-0 cursor-pointer transition-colors duration-300"
                  style={{
                    background: 'var(--ink)',
                    color: 'var(--paper)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--ink)';
                    e.currentTarget.style.color = 'var(--paper)';
                  }}
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Aniversariantes de setembro */}
        <div id="col-aniversariantes">
          <div
            className="pb-[9px] border-b text-[9.5px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--faint)',
              borderColor: 'var(--ink)',
            }}
          >
            Aniversariantes de setembro
          </div>

          <div className="flex flex-col">
            {birthdays.map((bday, idx) => (
              <div
                key={idx}
                id={`aniversariante-${idx}`}
                className="flex items-center gap-[13px] py-[13px] border-b border-[var(--rule)]"
              >
                {/* Day */}
                <div
                  className="text-[22px] shrink-0 w-6 text-center leading-none"
                  style={{
                    fontFamily: '"Instrument Serif", Georgia, serif',
                    color: 'var(--ink)',
                  }}
                >
                  {bday.day}
                </div>

                {/* Name & Age */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[13.5px] font-semibold truncate"
                    style={{ color: 'var(--ink)' }}
                  >
                    {bday.name}
                  </div>
                  <div
                    className="text-[11.5px] mt-0.5"
                    style={{ color: 'var(--mute)' }}
                  >
                    faz {bday.age} anos
                  </div>
                </div>

                {/* Pill Button: Gerar arte */}
                <button
                  id={`btn-gerar-arte-${idx}`}
                  onClick={() => setSelectedBirthday(bday)}
                  className="py-[7px] px-[13px] rounded-full border text-[11px] font-semibold shrink-0 cursor-pointer transition-all duration-300"
                  style={{
                    borderColor: 'var(--rule)',
                    color: 'var(--ink)',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--ink)';
                    e.currentTarget.style.background = 'var(--accentSoft)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--rule)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Gerar arte
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Lembretes automáticos */}
        <div id="col-lembretes">
          <div
            className="pb-[9px] border-b text-[9.5px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--faint)',
              borderColor: 'var(--ink)',
            }}
          >
            Lembretes automáticos
          </div>

          <div className="flex flex-col">
            {reminders.map((rem, idx) => (
              <div
                key={idx}
                id={`lembrete-item-${idx}`}
                className="flex gap-[11px] items-start py-[13px] border-b border-[var(--rule)]"
              >
                {/* Dot */}
                <span
                  className="w-[5px] h-[5px] rounded-full shrink-0 mt-[7px]"
                  style={{ background: rem.dot }}
                />

                {/* Text */}
                <span
                  className="text-[13px] leading-[1.5]"
                  style={{ color: 'var(--mute)' }}
                >
                  {rem.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Birthday Art Generator Modal */}
      <BirthdayModal
        person={selectedBirthday}
        onClose={() => setSelectedBirthday(null)}
      />
    </div>
  );
};
