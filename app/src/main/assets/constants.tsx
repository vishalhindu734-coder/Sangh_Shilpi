import { Status, Contact } from './types';

export const CATEGORIES = ['कार्यकर्ता', 'स्वयंसेवक', 'समाजसेवी', 'सहयोगी'];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'रमेश पटेल',
    phone: '9826012345',
    village: 'आदर्श नगर',
    category: 'कार्यकर्ता',
    status: Status.SAKRIYA,
    history: []
  }
];