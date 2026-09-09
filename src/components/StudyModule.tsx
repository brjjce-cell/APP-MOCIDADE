import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BibleStudy } from '../types';
import {
  BookOpen,
  PlusCircle,
  Sparkles,
  Copy,
  ExternalLink,
  Share2,
  Check,
  Edit2,
  FileText,
  X,
  MessageCircle,
  HelpCircle,
  Send,
} from 'lucide-react';
import { createWhatsAppLink } from '../utils/whatsapp';

export const StudyModule: React.FC = () => {
  const { bibleStudies, addBibleStudy, updateBibleStudy } = useApp();

  const [selectedStudy, setSelectedStudy] = useState<BibleStudy>(bibleStudies[0]);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [copiedStudy, setCopiedStudy] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedDevotional, setCopiedDevotional] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [passage, setPassage] = useState('');
  const [theme, setTheme] = useState('');
  const [outline, setOutline] = useState('');
  const [practicalApplication, setPracticalApplication] = useState('');

  const openNewStudyModal = () => {
    setTitle('');
    setPassage('');
    setTheme('');
    setOutline('');
    setPracticalApplication('');
    setIsNewModalOpen(true);
  };

  const handleSaveStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addBibleStudy({
      title,
      passage,
      theme,
      outline,
      practicalApplication,
    });

    setIsNewModalOpen(false);
  };

  // Trigger Gemini AI generation for social media & WhatsApp devotionals
  const handleGenerateAIPosts = async () => {
    if (!selectedStudy) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/study-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedStudy.title,
          passage: selectedStudy.passage,
          outline: selectedStudy.outline,
          application: selectedStudy.practicalApplication,
        }),
      });

      if (!res.ok) throw new Error('Falha na resposta do servidor');
      const data = await res.json();

      if (data.socialPost) {
        updateBibleStudy(selectedStudy.id, {
          aiGeneratedPosts: {
            socialPost: data.socialPost,
            devotionalMessage: data.devotionalMessage,
            discussionQuestions: data.discussionQuestions || [],
          },
        });
        setSelectedStudy((prev) => ({
          ...prev,
          aiGeneratedPosts: {
            socialPost: data.socialPost,
            devotionalMessage: data.devotionalMessage,
            discussionQuestions: data.discussionQuestions || [],
          },
        }));
      }
    } catch (err) {
      console.error('Erro ao gerar com IA:', err);
      alert('Não foi possível conectar com o serviço de IA no momento.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Copy complete study to clipboard
  const handleCopyStudyFull = () => {
    if (!selectedStudy) return;
    const fullText = `📖 ESTUDO BÍBLICO: ${selectedStudy.title}\nPassagem Bíblica: ${selectedStudy.passage}\nTema Geral: ${selectedStudy.theme}\n\nESBOÇO DE MENSAGEM:\n${selectedStudy.outline}\n\nAPLICAÇÃO PRÁTICA:\n${selectedStudy.practicalApplication}\n\n— Ministério de Jovens`;
    navigator.clipboard.writeText(fullText);
    setCopiedStudy(true);
    setTimeout(() => setCopiedStudy(false), 2500);
  };

  // Copy study and jump to NotebookLM
  const handleJumpToNotebookLM = () => {
    handleCopyStudyFull();
    window.open('https://notebooklm.google.com', '_blank');
  };

  // Open Google Docs
  const handleOpenGoogleDocs = () => {
    handleCopyStudyFull();
    window.open('https://docs.google.com/document/create', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Estudos Bíblicos & IA</h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Criação de mensagens, gerador de posts para redes sociais, atalho para NotebookLM e Google Docs.
          </p>
        </div>

        <button
          onClick={openNewStudyModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Criar Novo Estudo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Studies List (Left Column) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Biblioteca de Estudos ({bibleStudies.length})
          </span>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {bibleStudies.map((study) => {
              const isSelected = selectedStudy?.id === study.id;
              return (
                <button
                  key={study.id}
                  onClick={() => setSelectedStudy(study)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-bold block line-clamp-1">{study.title}</span>
                  <span className="text-[11px] text-indigo-600 font-semibold block mt-0.5">
                    {study.passage}
                  </span>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {study.outline}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
                    <span>Criado em: {new Date(study.createdAt + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                    {study.aiGeneratedPosts && (
                      <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> IA Ativa
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Study Detail & AI Generation (Right Column) */}
        {selectedStudy ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Study Content Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {selectedStudy.theme}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {selectedStudy.title}
                  </h3>
                  <span className="text-xs font-semibold text-indigo-700 block mt-0.5">
                    📖 {selectedStudy.passage}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyStudyFull}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    {copiedStudy ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Estudo</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleJumpToNotebookLM}
                    title="Copia o estudo e abre o NotebookLM"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>NotebookLM</span>
                  </button>

                  <button
                    onClick={handleOpenGoogleDocs}
                    title="Copia o estudo e abre o Google Docs para criar documento formatado"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Google Docs</span>
                  </button>
                </div>
              </div>

              {/* Esboço */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Esboço da Mensagem / Tópicos:
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                  {selectedStudy.outline}
                </div>
              </div>

              {/* Aplicação Prática */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Aplicação Prática no Dia a Dia dos Jovens:
                </span>
                <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 leading-relaxed whitespace-pre-line font-medium">
                  {selectedStudy.practicalApplication}
                </div>
              </div>
            </div>

            {/* AI Assistant Section (Módulo 2.5: Resumos, Post de Instagram & Devocional de Terça) */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-indigo-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Assistente de Conteúdo com IA (Gemini)
                    </h4>
                    <p className="text-xs text-indigo-200">
                      Gera automaticamente posts de Instagram, devocional de terça-feira e perguntas de célula.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAIPosts}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingAI ? 'Gerando com IA...' : 'Gerar Posts com IA'}</span>
                </button>
              </div>

              {selectedStudy.aiGeneratedPosts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Instagram Post Box */}
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          📸 Post para o Instagram
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedStudy.aiGeneratedPosts!.socialPost);
                            setCopiedPost(true);
                            setTimeout(() => setCopiedPost(false), 2000);
                          }}
                          className="text-[11px] font-semibold text-indigo-200 hover:text-white flex items-center gap-1"
                        >
                          {copiedPost ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedPost ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                      <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed mt-2 max-h-48 overflow-y-auto pr-1">
                        {selectedStudy.aiGeneratedPosts.socialPost}
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Tuesday Devotional */}
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          💬 Devocional de Terça (WhatsApp)
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedStudy.aiGeneratedPosts!.devotionalMessage
                            );
                            setCopiedDevotional(true);
                            setTimeout(() => setCopiedDevotional(false), 2000);
                          }}
                          className="text-[11px] font-semibold text-indigo-200 hover:text-white flex items-center gap-1"
                        >
                          {copiedDevotional ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedDevotional ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                      <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed mt-2 max-h-48 overflow-y-auto pr-1">
                        {selectedStudy.aiGeneratedPosts.devotionalMessage}
                      </div>
                    </div>

                    <a
                      href={createWhatsAppLink(
                        '',
                        selectedStudy.aiGeneratedPosts.devotionalMessage
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar para o Grupo no WhatsApp</span>
                    </a>
                  </div>

                  {/* Discussion Questions */}
                  {selectedStudy.aiGeneratedPosts.discussionQuestions && (
                    <div className="md:col-span-2 bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10 space-y-2">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4" />
                        Perguntas para Reflexão / Pequenos Grupos
                      </span>
                      <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-200">
                        {selectedStudy.aiGeneratedPosts.discussionQuestions.map((q, idx) => (
                          <li key={idx} className="leading-normal">{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-indigo-200">
                  Clique no botão acima para gerar postagens para Instagram e mensagens devocionais com IA para este estudo.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Selecione ou crie um estudo na lista ao lado.</p>
          </div>
        )}
      </div>

      {/* New Study Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Novo Estudo Bíblico</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudy} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Título do Estudo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Vivendo com Propósito em Tempos Difíceis"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Passagem Bíblica Principal
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Romanos 12:1-2"
                    value={passage}
                    onChange={(e) => setPassage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tema / Categoria
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Caráter, Identidade, Namoro"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Esboço / Tópicos Principais
                </label>
                <textarea
                  rows={4}
                  placeholder="1. Ponto 1&#10;2. Ponto 2&#10;3. Ponto 3"
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Aplicação Prática no Dia a Dia Jovem
                </label>
                <textarea
                  rows={2}
                  placeholder="O que o jovem deve colocar em prática nesta semana?"
                  value={practicalApplication}
                  onChange={(e) => setPracticalApplication(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs transition-colors"
                >
                  Salvar Estudo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
