import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventPlanning, ChecklistItem } from '../types';
import {
  Calculator,
  Calendar,
  Users,
  CheckSquare,
  PlusCircle,
  Star,
  Clock,
  History,
  AlertCircle,
  Check,
  ChevronRight,
} from 'lucide-react';

export const EventCalculator: React.FC = () => {
  const { events, updateEvent, toggleChecklistItem } = useApp();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [peopleCount, setPeopleCount] = useState<number>(events[0]?.confirmedPeople || 35);
  const [durationDays, setDurationDays] = useState<number>(events[0]?.daysDuration || 3);
  const [eventType, setEventType] = useState<'retiro' | 'confraternizacao' | 'culto_especial'>(
    'retiro'
  );

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Dynamic supply formulas based on people count & duration
  const calculateSupplies = (people: number, days: number, type: string) => {
    if (type === 'retiro') {
      // 3 meals/day: lunch, dinner, breakfast
      const meatKg = Math.round(people * 0.35 * (days * 1.5) * 10) / 10;
      const riceKg = Math.round(people * 0.12 * days * 10) / 10;
      const beansKg = Math.round(people * 0.08 * days * 10) / 10;
      const breadUnits = Math.round(people * 2 * days);
      const sodaLiters = Math.round(people * 1.2 * days);
      const disposablePlates = Math.round(people * 3 * days + 30);
      const disposableCups = Math.round(people * 6 * days + 50);

      return [
        { item: 'Carnes / Frango / Proteína', quantity: meatKg, unit: 'kg', estimatedPrice: meatKg * 30 },
        { item: 'Arroz (pacotes)', quantity: riceKg, unit: 'kg', estimatedPrice: riceKg * 6.5 },
        { item: 'Feijão (pacotes)', quantity: beansKg, unit: 'kg', estimatedPrice: beansKg * 8 },
        { item: 'Pães para Café da Manhã', quantity: breadUnits, unit: 'unidades', estimatedPrice: breadUnits * 0.8 },
        { item: 'Manteiga / Frios / Requeijão', quantity: Math.round(people * 0.15 * days), unit: 'kg', estimatedPrice: Math.round(people * 0.15 * days) * 35 },
        { item: 'Refrigerante e Sucos', quantity: Math.round(sodaLiters / 2), unit: 'garrafas 2L', estimatedPrice: Math.round(sodaLiters / 2) * 9 },
        { item: 'Pratos Descartáveis Reforçados', quantity: disposablePlates, unit: 'unidades', estimatedPrice: disposablePlates * 0.35 },
        { item: 'Copos Descartáveis (200ml)', quantity: disposableCups, unit: 'unidades', estimatedPrice: disposableCups * 0.12 },
        { item: 'Guardanapos e Talheres', quantity: Math.round(people * 4 * days), unit: 'itens', estimatedPrice: 60 },
      ];
    } else if (type === 'confraternizacao') {
      // Single meal (e.g. churrasco or burger night)
      const meatKg = Math.round(people * 0.4 * 10) / 10;
      const sodaBottles = Math.round((people * 0.8) / 2);
      const breadUnits = Math.round(people * 1.5);
      const charcoal = Math.round(people / 10) + 1;

      return [
        { item: 'Carne / Linguiça para Churrasco', quantity: meatKg, unit: 'kg', estimatedPrice: meatKg * 36 },
        { item: 'Carvão Vegetal', quantity: charcoal, unit: 'sacos 3kg', estimatedPrice: charcoal * 18 },
        { item: 'Pão de Alho / Pão Francês', quantity: breadUnits, unit: 'unidades', estimatedPrice: breadUnits * 1.2 },
        { item: 'Refrigerantes e Sucos', quantity: sodaBottles, unit: 'garrafas 2L', estimatedPrice: sodaBottles * 9.5 },
        { item: 'Farofa e Vinagrete', quantity: Math.round(people * 0.08), unit: 'kg', estimatedPrice: 35 },
        { item: 'Copos e Pratos Descartáveis', quantity: people * 3, unit: 'unidades', estimatedPrice: 40 },
      ];
    } else {
      // Culto especial / lanche coletivo
      const snacks = people * 4;
      const juiceBottles = Math.round(people / 4);

      return [
        { item: 'Salgadinhos / Mini Tortas', quantity: snacks, unit: 'unidades', estimatedPrice: snacks * 1.5 },
        { item: 'Sucos / Refrigerantes', quantity: juiceBottles, unit: 'garrafas 2L', estimatedPrice: juiceBottles * 9 },
        { item: 'Copos e Guardanapos', quantity: people * 2, unit: 'unidades', estimatedPrice: 25 },
      ];
    }
  };

  const calculatedItems = calculateSupplies(peopleCount, durationDays, eventType);
  const totalEstimatedCost = calculatedItems.reduce((acc, curr) => acc + curr.estimatedPrice, 0);

  // Past events for comparison
  const pastEvents = events.filter((e) => e.isPast);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Calculadora & Logística de Eventos</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Dimensionamento inteligente de alimentação, orçamento estimado vs histórico comparável e retrospectiva.
        </p>
      </div>

      {/* Event Selector & Calculator Control */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Simulador de Insumos & Comida</h3>
              <p className="text-xs text-slate-500">Ajuste o número de pessoas para calcular na hora</p>
            </div>
          </div>

          {/* Quick type selector */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setEventType('retiro')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                eventType === 'retiro'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Retiro (Vários Dias)
            </button>
            <button
              onClick={() => setEventType('confraternizacao')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                eventType === 'confraternizacao'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Confraternização / Churrasco
            </button>
            <button
              onClick={() => setEventType('culto_especial')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                eventType === 'culto_especial'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Lanche Especial
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">
              Jovens Confirmados:
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={5}
                max={200}
                value={peopleCount}
                onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 px-3 py-1.5 text-base font-extrabold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500">pessoas</span>
            </div>
          </div>

          {eventType === 'retiro' && (
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">
                Duração do Retiro:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-1.5 text-base font-extrabold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500">dias</span>
              </div>
            </div>
          )}

          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex flex-col justify-center">
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
              Estimativa de Custo Alimentar
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-indigo-950">
                R$ {totalEstimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-indigo-700 font-medium">
                (~R$ {(totalEstimatedCost / peopleCount).toFixed(2)}/pessoa)
              </span>
            </div>
          </div>
        </div>

        {/* Calculated Results Table */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Lista de Compras Sugerida:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {calculatedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{item.item}</span>
                  <span className="text-xs text-slate-500">
                    Aprox. R$ {item.estimatedPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-indigo-600 block">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Comparison & Retrospective Section (Módulo 2.8 & 2.11) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Past Events Reference */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Histórico de Eventos Passados</h3>
              <p className="text-xs text-slate-500">Compare com os custos e aprendizados anteriores</p>
            </div>
          </div>

          {pastEvents.length > 0 ? (
            <div className="space-y-3">
              {pastEvents.map((pe) => (
                <div
                  key={pe.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{pe.name}</h4>
                      <span className="text-xs text-slate-500">
                        {pe.confirmedPeople} pessoas • {pe.daysDuration} dias •{' '}
                        {new Date(pe.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {pe.retrospective?.rating && (
                      <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{pe.retrospective.rating}/5</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Gasto Real Total:</span>
                      <span className="font-bold text-slate-800">
                        R$ {pe.actualBudget?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Custo por Jovem:</span>
                      <span className="font-bold text-emerald-700">
                        R$ {((pe.actualBudget || 0) / pe.confirmedPeople).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {pe.retrospective && (
                    <div className="pt-2 border-t border-slate-200 text-xs space-y-1">
                      <p className="text-slate-700">
                        <strong className="text-emerald-700">O que funcionou bem:</strong>{' '}
                        {pe.retrospective.whatWentWell}
                      </p>
                      <p className="text-slate-700">
                        <strong className="text-amber-700">O que melhorar no próximo:</strong>{' '}
                        {pe.retrospective.whatToImprove}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Nenhum evento passado registrado ainda.</p>
          )}
        </div>

        {/* Current Event Checklist */}
        {currentEvent && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Checklist Logístico: {currentEvent.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentEvent.checklist.filter((c) => c.done).length} de{' '}
                    {currentEvent.checklist.length} tarefas prontas
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {currentEvent.checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklistItem(currentEvent.id, item.id)}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    item.done
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-500 line-through'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                        item.done
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {item.done && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-xs font-medium">{item.task}</span>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 shrink-0">
                    {item.responsible}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
