import React, { useState } from 'react';
import { createWhatsAppUrl } from '../utils/formatters';

interface BirthdayModalProps {
  person: {
    name: string;
    day: string;
    age: number;
    phone?: string;
  } | null;
  onClose: () => void;
}

export const BirthdayModal: React.FC<BirthdayModalProps> = ({ person, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!person) return null;

  const defaultMessage = `🎂 Parabéns, ${person.name}! Hoje a mocidade Conectados celebra sua vida e agradece a Deus pelo privilégio de caminhar com você. Que este novo ciclo (${person.age} anos) seja repleto da graça, sabedoria e fidelidade do Senhor! "O Senhor te abençoe e te guarde" (Nm 6:24) ✨🎉`;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const waUrl = person.phone
    ? createWhatsAppUrl(person.phone, defaultMessage)
    : `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      id="birthday-art-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-rise"
      onClick={onClose}
    >
      <div
        id="birthday-art-modal-content"
        className="w-full max-w-md rounded-[22px] border p-6 flex flex-col gap-5 shadow-2xl relative"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--rule)',
          color: 'var(--ink)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3">
          <div className="flex items-center gap-2">
            <span
              className="text-[9.5px] uppercase tracking-[0.12em]"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                color: 'var(--faint)',
              }}
            >
              Arte de Aniversário · Setembro
            </span>
          </div>
          <button
            id="close-birthday-modal"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center border border-[var(--rule)] bg-transparent text-sm cursor-pointer hover:bg-[var(--accentSoft)]"
            style={{ color: 'var(--mute)' }}
          >
            ✕
          </button>
        </div>

        {/* Card Mockup Preview */}
        <div
          id="birthday-card-mockup"
          className="rounded-[18px] border p-6 flex flex-col items-center text-center gap-3 relative overflow-hidden"
          style={{
            background: 'var(--accentSoft)',
            borderColor: 'var(--accent)',
          }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--accent)',
            }}
          >
            Mocidade Conectados
          </div>

          <div
            className="text-[34px] leading-tight font-normal text-[var(--accent)]"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
          >
            Feliz Aniversário!
          </div>

          <div
            className="text-[22px] font-semibold text-[var(--ink)]"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
          >
            {person.name}
          </div>

          <div
            className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold"
            style={{
              background: 'var(--accent)',
              color: '#fff',
            }}
          >
            {person.day} de Setembro · {person.age} anos
          </div>

          <p className="text-[12.5px] leading-relaxed text-[var(--mute)] max-w-[32ch] mt-1 italic">
            "Ninguém o despreze pelo fato de você ser jovem, mas seja um exemplo para os fiéis na palavra, no procedimento, no amor, na fé e na pureza."
          </p>
          <span className="text-[10.5px] font-mono text-[var(--faint)]">
            1 Timóteo 4:12
          </span>
        </div>

        {/* Pre-written message box */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-[9.5px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--faint)',
            }}
          >
            Mensagem para WhatsApp & Redes
          </label>
          <div
            className="p-3 rounded-[14px] text-[12.5px] leading-relaxed border select-all"
            style={{
              background: 'var(--paper)',
              borderColor: 'var(--rule)',
              color: 'var(--mute)',
            }}
          >
            {defaultMessage}
          </div>
        </div>

        {/* Action Buttons in Pill Shape */}
        <div className="flex gap-2.5 flex-wrap">
          <button
            id="copy-birthday-message-btn"
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 rounded-full text-[12.5px] font-semibold border cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5"
            style={{
              background: copied ? 'var(--good)' : 'var(--ink)',
              borderColor: copied ? 'var(--good)' : 'var(--ink)',
              color: 'var(--paper)',
            }}
          >
            {copied ? '✓ Mensagem copiada!' : 'Copiar mensagem'}
          </button>

          <a
            id="share-whatsapp-birthday-btn"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-5 rounded-full text-[12.5px] font-semibold border cursor-pointer transition-all duration-300 flex items-center justify-center gap-1"
            style={{
              background: 'transparent',
              borderColor: 'var(--ink)',
              color: 'var(--ink)',
            }}
          >
            Abrir WhatsApp ↗
          </a>
        </div>
      </div>
    </div>
  );
};
