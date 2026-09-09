import React from 'react';
import { TabKey } from '../types';

interface PlaceholderScreenProps {
  tabKey: TabKey;
  onBackToSabado: () => void;
}

const TAB_DETAILS: Record<
  string,
  {
    title: string;
    description: string;
    plannedHighlights: string[];
    actionLabel: string;
  }
> = {
  jovens: {
    title: 'Jovens & chamada',
    description:
      'Gestão pastoral de presença e acompanhamento individual da mocidade.',
    plannedHighlights: [
      'Lista dos 10 jovens com marcadores de presença circulares (círculo 20px)',
      'Painel de perfil com iniciais, apelido, funções e tempo de ministério',
      'Contador de faltas seguidas com alerta automático visual em terracota',
      'Banco de mensagens prontas para envio rápido pastoral pelo WhatsApp',
    ],
    actionLabel: 'Voltar para Visão do sábado',
  },
  caixa: {
    title: 'Caixa da mocidade',
    description:
      'Transparência financeira das arrecadações, cantinas e compras do ministério.',
    plannedHighlights: [
      'Saldo em destaque em Instrument Serif de 56px na cor positiva',
      'Barra proporcional de entradas e saídas',
      'Acompanhamento do orçamento e meta para o Retiro 2027',
      'Extrato cronológico com efeito stagger slide-in',
    ],
    actionLabel: 'Voltar para Visão do sábado',
  },
  estudos: {
    title: 'Estudos & posts',
    description:
      'Roteiros teológicos e desdobramento em mídias sociais para a juventude.',
    plannedHighlights: [
      'Estudo de Daniel 1:8-16 com esboço numerado em grade 34px | 1fr',
      'Bloco de aplicação prática para o cotidiano na universidade e trabalho',
      'Post para Instagram gerado com cópia de um clique',
      'Perguntas para discussão nos pequenos grupos',
    ],
    actionLabel: 'Voltar para Visão do sábado',
  },
  eventos: {
    title: 'Eventos & retiros',
    description:
      'Planejamento do Retiro 2027 "Raízes Profundas" e retrospectiva de eventos.',
    plannedHighlights: [
      'Checklist interativo de tarefas com categoria e responsáveis',
      'Calculadora de compras para 35 pessoas durante 3 dias',
      'Retrospectiva de aprendizados do Carnaval 2026',
      'Tabela de fornecedores locais com condições comerciais',
    ],
    actionLabel: 'Voltar para Visão do sábado',
  },
  ideias: {
    title: 'Assistente criativo',
    description:
      'Banco de ideias para brindes, evangelismo de impacto e ações externas.',
    plannedHighlights: [
      'Grade de cartões com tags temáticas (brindes / evangelismo)',
      'Área hachurada para mockup visual',
      'Estimativa de custo por unidade e instruções de execução',
      'Stagger e elevação no hover (+4px)',
    ],
    actionLabel: 'Voltar para Visão do sábado',
  },
};

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  tabKey,
  onBackToSabado,
}) => {
  const info = TAB_DETAILS[tabKey] || {
    title: 'Em breve',
    description: 'Tela em desenvolvimento.',
    plannedHighlights: [],
    actionLabel: 'Voltar para Visão geral',
  };

  return (
    <div
      id={`screen-placeholder-${tabKey}`}
      className="p-[20px] md:p-[26px_30px_34px] animate-rise flex flex-col gap-6"
    >
      <div
        className="rounded-[22px] border p-8 md:p-10 flex flex-col gap-6 max-w-3xl"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--rule)',
          color: 'var(--ink)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.14em]"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--faint)',
            }}
          >
            Próximo passo na implementação
          </span>
        </div>

        <div>
          <h2
            className="text-[32px] md:text-[38px] font-normal m-0"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
          >
            {info.title}
          </h2>
          <p
            className="text-[14px] leading-relaxed mt-2"
            style={{ color: 'var(--mute)' }}
          >
            {info.description}
          </p>
        </div>

        <div className="border-t border-b border-[var(--rule)] py-5 flex flex-col gap-3">
          <span
            className="text-[9.5px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--faint)',
            }}
          >
            Especificações prontas para renderizar:
          </span>
          <div className="flex flex-col gap-2">
            {info.plannedHighlights.map((hl, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span
                  className="font-mono text-[11px] mt-0.5"
                  style={{ color: 'var(--accent)' }}
                >
                  0{idx + 1}.
                </span>
                <span className="text-[13.5px]" style={{ color: 'var(--ink)' }}>
                  {hl}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <button
            id="btn-return-sabado"
            onClick={onBackToSabado}
            className="py-3 px-6 rounded-full text-[13px] font-semibold cursor-pointer border transition-all duration-300 hover:translate-y-[-2px]"
            style={{
              background: 'var(--ink)',
              color: 'var(--paper)',
              borderColor: 'var(--ink)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--ink)';
              e.currentTarget.style.borderColor = 'var(--ink)';
              e.currentTarget.style.color = 'var(--paper)';
            }}
          >
            ← {info.actionLabel}
          </button>

          <span
            className="text-[12px] italic"
            style={{ color: 'var(--faint)' }}
          >
            Aguardando sua validação da tela "Visão do sábado" e da navegação.
          </span>
        </div>
      </div>
    </div>
  );
};
