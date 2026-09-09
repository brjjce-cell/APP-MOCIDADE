export type TabKey = 'sabado' | 'jovens' | 'caixa' | 'estudos' | 'eventos' | 'ideias';

export interface TabDefinition {
  key: TabKey;
  num: string;
  label: string;
  short: string;
  eyebrow: string;
  title: string;
}

export interface MemberData {
  id: string;
  name: string;
  nick: string;
  birth: string; // YYYY-MM-DD
  phone: string;
  status: 'active' | 'warning' | 'inactive';
  abs: number;
  pres: number;
  notes: string;
  join: string;
  roles: string[];
}

export interface TransactionData {
  date: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  workers: number;
}

export interface SupplyData {
  item: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface ChecklistData {
  id: string;
  task: string;
  category: string;
  done: boolean;
  responsible: string;
}

export interface SupplierData {
  name: string;
  contact: string;
  phone: string;
  price: string;
}

export interface IdeaData {
  title: string;
  cat: 'gifts' | 'evangelism';
  sub: string;
  description: string;
  cost: string;
  how: string;
}

export interface AppSeedData {
  members: MemberData[];
  txs: TransactionData[];
  supplies: SupplyData[];
  checklist: ChecklistData[];
  suppliers: SupplierData[];
  ideas: IdeaData[];
}

export interface ChurchProfile {
  id: string;
  name: string;
  subname: string;
  leaders: string;
  verseOfTheYear: string;
  themeYear: string;
}

export interface YouthMember {
  id: string;
  name: string;
  nickname?: string;
  birthDate: string;
  phone: string;
  status: 'active' | 'warning' | 'inactive';
  consecutiveAbsences: number;
  totalMeetingsPresent: number;
  notes: string;
  joinDate: string;
  roles?: string[];
}

export interface MeetingRoleAssignment {
  praise: string[];
  reception: string[];
  snack: string[];
  media: string[];
  preacher: string;
}

export interface Meeting {
  id: string;
  date: string;
  title: string;
  studyTitle: string;
  studyId?: string;
  roles: MeetingRoleAssignment;
  attendees: string[];
  expectedAttendees: number;
  generalNotes?: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  workers?: string[];
  notes?: string;
}

export interface BibleStudy {
  id: string;
  title: string;
  passage: string;
  theme: string;
  outline: string;
  practicalApplication: string;
  createdAt: string;
  lastTaughtDate?: string;
  aiGeneratedPosts?: {
    socialPost: string;
    devotionalMessage: string;
    discussionQuestions: string[];
  };
}

export interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  done: boolean;
  responsible: string;
}

export interface SupplyItem {
  item: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
}

export interface EventRetrospective {
  rating: number;
  attendance: number;
  whatWentWell: string;
  whatToImprove: string;
  notes: string;
}

export interface EventPlanning {
  id: string;
  name: string;
  type: string;
  date: string;
  daysDuration: number;
  confirmedPeople: number;
  estimatedBudget: number;
  actualBudget?: number;
  checklist: ChecklistItem[];
  supplies: SupplyItem[];
  retrospective?: EventRetrospective;
  isPast?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  recommended: boolean;
  notes: string;
  lastPriceObs: string;
}

export interface CreativeIdea {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedCost: string;
  howToExecute: string;
  type?: string;
  context?: string;
}

export type TabType =
  | 'saturday'
  | 'youth'
  | 'finance'
  | 'studies'
  | 'events'
  | 'birthdays'
  | 'suppliers_ideas'
  | 'settings';

