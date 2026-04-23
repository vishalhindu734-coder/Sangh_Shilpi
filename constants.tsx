
import { Status, Khand, Mandal, Village, Contact, TripPlan, CustomList, VillageStage, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'कार्यकर्ता', icon: 'User' },
  { id: 'cat2', name: 'स्वयंसेवक', icon: 'Users' },
  { id: 'cat3', name: 'समाजसेवी', icon: 'Heart' },
  { id: 'cat4', name: 'विविध संगठन', icon: 'Building2' },
];

export const INITIAL_EVENT_CATEGORIES: Category[] = [
  { id: 'ecat1', name: 'बैठक', icon: 'MessageSquare' },
  { id: 'ecat2', name: 'प्रशिक्षण', icon: 'Award' },
  { id: 'ecat3', name: 'उत्सव', icon: 'Star' },
  { id: 'ecat4', name: 'सम्मेलन', icon: 'Users' },
  { id: 'ecat5', name: 'अभियान', icon: 'Flag' },
];

export const INITIAL_KHANDS: Khand[] = [
  { id: 'k1', name: 'खंड अ' },
  { id: 'k2', name: 'खंड ब' },
];

export const INITIAL_MANDALS: Mandal[] = [
  { id: 'm1', name: 'मंडल 1', khandId: 'k1' },
  { id: 'm2', name: 'मंडल 2', khandId: 'k1' },
  { id: 'm3', name: 'मंडल 3', khandId: 'k1' },
  { id: 'm4', name: 'मंडल 4', khandId: 'k1' },
  { id: 'm5', name: 'मंडल 5', khandId: 'k1' },
  { id: 'm6', name: 'मंडल 6', khandId: 'k2' },
  { id: 'm7', name: 'मंडल 7', khandId: 'k2' },
  { id: 'm8', name: 'मंडल 8', khandId: 'k2' },
  { id: 'm9', name: 'मंडल 9', khandId: 'k2' },
];

export const INITIAL_VILLAGES: Village[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `v${i + 1}`,
  name: `गांव ${i + 1}`,
  mandalId: `m${Math.floor(i / 5) + 1}`,
  stage: VillageStage.NONE,
}));

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'राजेश कुमार',
    phone: '9876543210',
    khandId: 'k1',
    mandalId: 'm1',
    villageId: 'v1',
    category: 'कार्यकर्ता',
    status: Status.SAKRIYA,
    lastVisited: '2023-10-25',
    listIds: ['l1'],
    history: [{ id: 'h1', date: '2023-10-25', notes: 'अच्छी बैठक हुई।', nextFollowUp: '2023-11-01' }]
  }
];

export const INITIAL_TRIPS: TripPlan[] = [];

export const INITIAL_LISTS: CustomList[] = [
  { id: 'l1', name: 'विशेष संपर्क', peopleIds: ['c1'] }
];
