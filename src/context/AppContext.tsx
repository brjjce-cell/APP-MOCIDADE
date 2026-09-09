import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ChurchProfile,
  YouthMember,
  Meeting,
  FinancialTransaction,
  BibleStudy,
  EventPlanning,
  Supplier,
  CreativeIdea,
} from '../types';
import {
  INITIAL_CHURCH_PROFILE,
  INITIAL_YOUTH_MEMBERS,
  INITIAL_MEETINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_BIBLE_STUDIES,
  INITIAL_EVENTS,
  INITIAL_SUPPLIERS,
  INITIAL_CREATIVE_IDEAS,
} from '../data/initialData';

interface AppContextType {
  churchProfile: ChurchProfile;
  setChurchProfile: (profile: ChurchProfile) => void;
  youthMembers: YouthMember[];
  addYouthMember: (member: Omit<YouthMember, 'id' | 'consecutiveAbsences' | 'totalMeetingsPresent'>) => void;
  updateYouthMember: (id: string, updates: Partial<YouthMember>) => void;
  deleteYouthMember: (id: string) => void;
  meetings: Meeting[];
  currentMeeting: Meeting | undefined;
  setCurrentMeetingId: (id: string) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  toggleAttendance: (meetingId: string, youthId: string) => void;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  transactions: FinancialTransaction[];
  addTransaction: (tx: Omit<FinancialTransaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  bibleStudies: BibleStudy[];
  addBibleStudy: (study: Omit<BibleStudy, 'id' | 'createdAt'>) => void;
  updateBibleStudy: (id: string, updates: Partial<BibleStudy>) => void;
  events: EventPlanning[];
  addEvent: (event: Omit<EventPlanning, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<EventPlanning>) => void;
  toggleChecklistItem: (eventId: string, itemId: string) => void;
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  creativeIdeas: CreativeIdea[];
  addCreativeIdea: (idea: Omit<CreativeIdea, 'id'>) => void;
  exportAllDataJSON: () => void;
  importDataJSON: (jsonStr: string) => boolean;
  exportYouthCSV: () => void;
  exportFinanceCSV: () => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'gestao_jovens_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [churchProfile, setChurchProfileState] = useState<ChurchProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}profile`);
    return saved ? JSON.parse(saved) : INITIAL_CHURCH_PROFILE;
  });

  const [youthMembers, setYouthMembers] = useState<YouthMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}youth`);
    return saved ? JSON.parse(saved) : INITIAL_YOUTH_MEMBERS;
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}meetings`);
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [currentMeetingId, setCurrentMeetingId] = useState<string>(() => {
    return meetings[0]?.id || 'meet_next';
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [bibleStudies, setBibleStudies] = useState<BibleStudy[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}studies`);
    return saved ? JSON.parse(saved) : INITIAL_BIBLE_STUDIES;
  });

  const [events, setEvents] = useState<EventPlanning[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}suppliers`);
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [creativeIdeas, setCreativeIdeas] = useState<CreativeIdea[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}ideas`);
    return saved ? JSON.parse(saved) : INITIAL_CREATIVE_IDEAS;
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}profile`, JSON.stringify(churchProfile));
  }, [churchProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}youth`, JSON.stringify(youthMembers));
  }, [youthMembers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}meetings`, JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}studies`, JSON.stringify(bibleStudies));
  }, [bibleStudies]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}suppliers`, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}ideas`, JSON.stringify(creativeIdeas));
  }, [creativeIdeas]);

  // Financial metrics
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const currentMeeting = meetings.find((m) => m.id === currentMeetingId) || meetings[0];

  // Youth Actions
  const addYouthMember = (data: Omit<YouthMember, 'id' | 'consecutiveAbsences' | 'totalMeetingsPresent'>) => {
    const newMember: YouthMember = {
      ...data,
      id: `y_${Date.now()}`,
      consecutiveAbsences: 0,
      totalMeetingsPresent: 0,
    };
    setYouthMembers((prev) => [newMember, ...prev]);
  };

  const updateYouthMember = (id: string, updates: Partial<YouthMember>) => {
    setYouthMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteYouthMember = (id: string) => {
    setYouthMembers((prev) => prev.filter((item) => item.id !== id));
  };

  // Meeting & Attendance Actions
  const toggleAttendance = (meetingId: string, youthId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        const exists = m.attendees.includes(youthId);
        const newAttendees = exists
          ? m.attendees.filter((id) => id !== youthId)
          : [...m.attendees, youthId];
        return { ...m, attendees: newAttendees };
      })
    );

    // Update youth stats
    setYouthMembers((prev) =>
      prev.map((y) => {
        if (y.id !== youthId) return y;
        const meeting = meetings.find((m) => m.id === meetingId);
        const wasPresent = meeting?.attendees.includes(youthId);
        if (!wasPresent) {
          // Marked present
          return {
            ...y,
            consecutiveAbsences: 0,
            status: 'active' as const,
            totalMeetingsPresent: y.totalMeetingsPresent + 1,
          };
        } else {
          // Unmarked
          return {
            ...y,
            totalMeetingsPresent: Math.max(0, y.totalMeetingsPresent - 1),
          };
        }
      })
    );
  };

  const addMeeting = (data: Omit<Meeting, 'id'>) => {
    const newMeeting: Meeting = {
      ...data,
      id: `meet_${Date.now()}`,
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    setCurrentMeetingId(newMeeting.id);
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  // Financial Actions
  const addTransaction = (tx: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = {
      ...tx,
      id: `tx_${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Studies Actions
  const addBibleStudy = (data: Omit<BibleStudy, 'id' | 'createdAt'>) => {
    const newStudy: BibleStudy = {
      ...data,
      id: `study_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBibleStudies((prev) => [newStudy, ...prev]);
  };

  const updateBibleStudy = (id: string, updates: Partial<BibleStudy>) => {
    setBibleStudies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  // Events Actions
  const addEvent = (data: Omit<EventPlanning, 'id'>) => {
    const newEvent: EventPlanning = {
      ...data,
      id: `ev_${Date.now()}`,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (id: string, updates: Partial<EventPlanning>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const toggleChecklistItem = (eventId: string, itemId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        return {
          ...e,
          checklist: e.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          ),
        };
      })
    );
  };

  // Suppliers Actions
  const addSupplier = (data: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = { ...data, id: `sup_${Date.now()}` };
    setSuppliers((prev) => [newSup, ...prev]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  // Ideas Actions
  const addCreativeIdea = (data: Omit<CreativeIdea, 'id'>) => {
    const newIdea: CreativeIdea = { ...data, id: `idea_${Date.now()}` };
    setCreativeIdeas((prev) => [newIdea, ...prev]);
  };

  // Backup & Export (Módulo 2.15)
  const exportAllDataJSON = () => {
    const fullBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      churchProfile,
      youthMembers,
      meetings,
      transactions,
      bibleStudies,
      events,
      suppliers,
      creativeIdeas,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_ministerio_jovens_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.youthMembers) setYouthMembers(data.youthMembers);
      if (data.meetings) setMeetings(data.meetings);
      if (data.transactions) setTransactions(data.transactions);
      if (data.bibleStudies) setBibleStudies(data.bibleStudies);
      if (data.events) setEvents(data.events);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.creativeIdeas) setCreativeIdeas(data.creativeIdeas);
      if (data.churchProfile) setChurchProfileState(data.churchProfile);
      return true;
    } catch (e) {
      console.error('Erro ao importar backup:', e);
      return false;
    }
  };

  const exportYouthCSV = () => {
    const headers = ['Nome', 'Apelido', 'Telefone', 'Aniversário', 'Status', 'Faltas Consecutivas', 'Presenças Totais', 'Funções', 'Observações'];
    const rows = youthMembers.map((y) => [
      `"${y.name}"`,
      `"${y.nickname || ''}"`,
      `"${y.phone}"`,
      `"${y.birthDate}"`,
      `"${y.status}"`,
      y.consecutiveAbsences,
      y.totalMeetingsPresent,
      `"${(y.roles || []).join(', ')}"`,
      `"${(y.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jovens_cadastro_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportFinanceCSV = () => {
    const headers = ['Data', 'Tipo', 'Valor (R$)', 'Descrição', 'Categoria', 'Equipe que Trabalhou', 'Observações'];
    const rows = transactions.map((t) => [
      `"${t.date}"`,
      `"${t.type === 'income' ? 'Entrada' : 'Saída'}"`,
      t.amount.toFixed(2).replace('.', ','),
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${(t.workers || []).join(', ')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caixa_mocidade_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToDefaults = () => {
    setChurchProfileState(INITIAL_CHURCH_PROFILE);
    setYouthMembers(INITIAL_YOUTH_MEMBERS);
    setMeetings(INITIAL_MEETINGS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBibleStudies(INITIAL_BIBLE_STUDIES);
    setEvents(INITIAL_EVENTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setCreativeIdeas(INITIAL_CREATIVE_IDEAS);
  };

  return (
    <AppContext.Provider
      value={{
        churchProfile,
        setChurchProfile: setChurchProfileState,
        youthMembers,
        addYouthMember,
        updateYouthMember,
        deleteYouthMember,
        meetings,
        currentMeeting,
        setCurrentMeetingId,
        updateMeeting,
        toggleAttendance,
        addMeeting,
        transactions,
        addTransaction,
        deleteTransaction,
        balance,
        totalIncome,
        totalExpense,
        bibleStudies,
        addBibleStudy,
        updateBibleStudy,
        events,
        addEvent,
        updateEvent,
        toggleChecklistItem,
        suppliers,
        addSupplier,
        updateSupplier,
        creativeIdeas,
        addCreativeIdea,
        exportAllDataJSON,
        importDataJSON,
        exportYouthCSV,
        exportFinanceCSV,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
