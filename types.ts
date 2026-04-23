
export enum Status {
  SAKRIYA = 'सक्रिय शक्ति',
  SANCHIT = 'संचित शक्ति',
  SAJJAN = 'सज्जन शक्ति',
  UTSUK = 'उत्सुक शक्ति'
}

export enum VillageStage {
  SHAKHA = 'शाखा',
  MILAN = 'मिलन',
  MANDALI = 'मंडली',
  NONE = 'कुछ नहीं'
}

export enum ShakhaPosition {
  MUKHYA_SHIKSHAK = 'मुख्य शिक्षक',
  SAHA_MUKHYA_SHIKSHAK = 'सह मुख्य शिक्षक',
  GAN_SHIKSHAK = 'गण शिक्षक',
  GAT_NATAK = 'गट नाटक',
  SHAKHA_KARYAVAH = 'शाखा कार्यवाह',
  GAT_NATAK_PRAMUKH = 'गट नाटक प्रमुख'
}

export interface ShakhaData {
  shakhaName: string;
  positions: Partial<Record<ShakhaPosition, string>>; // Stores contactId
}

export interface Village {
  id: string;
  name: string;
  mandalId: string;
  stage: VillageStage;
  shakhaData?: ShakhaData;
}

export interface Mandal {
  id: string;
  name: string;
  khandId: string;
}

export interface Khand {
  id: string;
  name: string;
}

export interface VisitHistory {
  id: string;
  date: string;
  notes: string;
  nextFollowUp?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  khandId: string;
  mandalId: string;
  villageId: string;
  category: string; // Changed from Enum to string for dynamic support
  status: Status;
  lastVisited?: string;
  listIds: string[];
  history: VisitHistory[];
}

export interface TripPlan {
  id: string;
  date: string;
  khandId: string;
  mandalId: string;
  villageIds: string[];
  peopleIds: string[];
  notes: string;
  isCompleted: boolean;
}

export interface CustomList {
  id: string;
  name: string;
  peopleIds: string[];
}

export enum AttendanceStatus {
  COMING = 'आ रहे हैं',
  NOT_COMING = 'नहीं आ रहे',
  NOT_CONFIRMED = 'निश्चित नहीं',
  PENDING = 'लंबित'
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
}

export interface Meeting {
  id: string;
  listId: string;
  title: string;
  date: string;
  location?: string;
  notes?: string;
  category: string;
  attendance: Record<string, AttendanceStatus>; // RSVP: volunteerId -> status
  presentPeopleIds: string[]; // Actual attendance
}
