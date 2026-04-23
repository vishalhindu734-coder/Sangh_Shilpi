export enum Status {
  SAKRIYA = 'सक्रिय',
  SANCHIT = 'संचित',
  SAJJAN = 'सज्जन',
  UTSUK = 'उत्सुक'
}

export interface VisitHistory {
  id: string;
  date: string;
  notes: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  village: string;
  category: string;
  status: Status;
  history: VisitHistory[];
}

export interface Trip {
  id: string;
  date: string;
  location: string;
  isCompleted: boolean;
}