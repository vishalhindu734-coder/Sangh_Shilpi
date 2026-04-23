import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Home, 
  Users, 
  MapPin, 
  List as ListIcon, 
  Calendar as CalendarIcon, 
  Settings, 
  Plus, 
  ChevronRight, 
  Phone, 
  CheckCircle2, 
  ArrowLeft,
  Search,
  Trash2,
  Moon,
  Sun,
  Building2,
  Edit2,
  Download,
  RotateCcw,
  User,
  Upload,
  FolderOpen,
  Tag,
  UserPlus,
  UsersRound,
  MessageSquare,
  CalendarCheck,
  UserCheck,
  Award,
  Star,
  Flag,
  Rocket
} from 'lucide-react';
import { 
  Status, 
  Khand, 
  Mandal, 
  Village, 
  Contact, 
  TripPlan, 
  CustomList, 
  VisitHistory,
  VillageStage,
  ShakhaPosition,
  ShakhaData,
  Meeting,
  AttendanceStatus
} from './types';
import { 
  INITIAL_KHANDS, 
  INITIAL_MANDALS, 
  INITIAL_VILLAGES, 
  INITIAL_CONTACTS, 
  INITIAL_TRIPS, 
  INITIAL_LISTS,
  INITIAL_CATEGORIES,
  INITIAL_EVENT_CATEGORIES
} from './constants';
import { ICON_LIST, LucideIcon } from './icons';
import { IconPicker } from './components/IconPicker';

import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
  parseISO
} from 'date-fns';

type Tab = 'home' | 'people' | 'trips' | 'lists' | 'groups' | 'work-status' | 'settings' | 'area-mgmt' | 'cat-mgmt' | 'calendar' | 'event-cat-mgmt';

const loadData = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const App: React.FC = () => {
  // Core State
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [khands, setKhands] = useState<Khand[]>(() => loadData('khands', INITIAL_KHANDS));
  const [mandals, setMandals] = useState<Mandal[]>(() => loadData('mandals', INITIAL_MANDALS));
  const [villages, setVillages] = useState<Village[]>(() => loadData('villages', INITIAL_VILLAGES));
  const [contacts, setContacts] = useState<Contact[]>(() => loadData('contacts', INITIAL_CONTACTS));
  const [trips, setTrips] = useState<TripPlan[]>(() => loadData('trips', INITIAL_TRIPS));
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const data = loadData<any[]>('categories', INITIAL_CATEGORIES);
    if (data.length > 0 && typeof data[0] === 'string') {
      return data.map((name: string, i: number) => ({ id: `c${i}`, name, icon: 'User' }));
    }
    return data;
  });

  const [eventCategories, setEventCategories] = useState<Category[]>(() => {
    const data = loadData<any[]>('eventCategories', INITIAL_EVENT_CATEGORIES);
    if (data.length > 0 && typeof data[0] === 'string') {
      return data.map((name: string, i: number) => ({ id: `ec${i}`, name, icon: 'Calendar' }));
    }
    return data;
  });

  const [customLists, setCustomLists] = useState<CustomList[]>(() => loadData('customLists', INITIAL_LISTS));
  const [meetings, setMeetings] = useState<Meeting[]>(() => loadData('meetings', []));
  const [darkMode, setDarkMode] = useState(() => loadData('darkMode', false));
  const [userName, setUserName] = useState(() => loadData('userName', 'क्षेत्र कार्यकर्ता'));
  const [callRecords, setCallRecords] = useState<Record<string, string>>(() => loadData('callRecords', {}));

  // UI State
  const [dashKhand, setDashKhand] = useState<string>('all');
  const [dashMandal, setDashMandal] = useState<string>('all');
  const [peopleSearch, setPeopleSearch] = useState('');
  const [peopleStatusFilter, setPeopleStatusFilter] = useState<string | 'all'>('all');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [isManagingMembers, setIsManagingMembers] = useState(false);

  // Modals / Editing State
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingTrip, setEditingTrip] = useState<TripPlan | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [isAddingMeeting, setIsAddingMeeting] = useState(false);
  const [isLoggingVisit, setIsLoggingVisit] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('khands', JSON.stringify(khands));
    localStorage.setItem('mandals', JSON.stringify(mandals));
    localStorage.setItem('villages', JSON.stringify(villages));
    localStorage.setItem('contacts', JSON.stringify(contacts));
    localStorage.setItem('trips', JSON.stringify(trips));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('eventCategories', JSON.stringify(eventCategories));
    localStorage.setItem('customLists', JSON.stringify(customLists));
    localStorage.setItem('meetings', JSON.stringify(meetings));
    localStorage.setItem('userName', JSON.stringify(userName));
    localStorage.setItem('callRecords', JSON.stringify(callRecords));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [khands, mandals, villages, contacts, trips, categories, eventCategories, customLists, meetings, userName, darkMode, callRecords]);

  // Helpers
  const getKhandName = (id: string) => khands.find(k => k.id === id)?.name || id;
  const getMandalName = (id: string) => mandals.find(m => m.id === id)?.name || id;
  const getVillageName = (id: string) => villages.find(v => v.id === id)?.name || id;

  const isRecentlyCalled = (id: string) => {
    const lastCall = callRecords[id];
    if (!lastCall) return false;
    const diff = Date.now() - new Date(lastCall).getTime();
    return diff < 3600000; // 1 hour in ms
  };

  const handleDial = (id: string) => {
    setCallRecords(prev => ({ ...prev, [id]: new Date().toISOString() }));
  };

  const stats = useMemo(() => {
    const filtered = contacts.filter(c => (dashKhand === 'all' || c.khandId === dashKhand) && (dashMandal === 'all' || c.mandalId === dashMandal));
    return {
      total: filtered.length,
      active: filtered.filter(c => c.status === Status.SAKRIYA).length,
    };
  }, [contacts, dashKhand, dashMandal]);

  // Actions
  const handleUpdateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    setEditingContact(null);
  };

  const handleAddContact = (newContact: Omit<Contact, 'id' | 'listIds' | 'history'>) => {
    const contact: Contact = { ...newContact, id: `c${Date.now()}`, listIds: [], history: [] };
    setContacts(prev => [...prev, contact]);
    setIsAddingContact(false);
  };

  const handleUpdateTrip = (id: string, updates: Partial<TripPlan>) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    setEditingTrip(null);
  };

  const handleAddTrip = (newTrip: Omit<TripPlan, 'id' | 'isCompleted'>) => {
    const trip: TripPlan = { ...newTrip, id: `t${Date.now()}`, isCompleted: false };
    setTrips(prev => [...prev, trip]);
    setIsAddingTrip(false);
  };

  const handleLogVisit = (contactId: string, notes: string) => {
    const historyEntry: VisitHistory = {
      id: `h${Date.now()}`,
      date: new Date().toISOString(),
      notes,
    };
    setContacts(prev => prev.map(c => 
      c.id === contactId 
        ? { ...c, history: [...c.history, historyEntry], lastVisited: historyEntry.date } 
        : c
    ));
    setIsLoggingVisit(null);
  };

  const updateVillageStage = (id: string, stage: VillageStage) => {
    setVillages(prev => prev.map(v => v.id === id ? { ...v, stage } : v));
  };

  const updateShakhaData = (id: string, data: Partial<ShakhaData>) => {
    setVillages(prev => prev.map(v => v.id === id ? { ...v, shakhaData: { ...v.shakhaData, ...data } as ShakhaData } : v));
  };

  const exportData = () => {
    const data = { khands, mandals, villages, contacts, trips, categories, eventCategories, customLists, meetings, userName };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pravas_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetAllData = () => {
    setConfirmation({
      title: 'ऐप रिसेट करें?',
      message: 'क्या आप वाकई सारा डेटा मिटाना चाहते हैं? यह क्रिया वापस नहीं ली जा सकती।',
      onConfirm: () => {
        localStorage.clear();
        window.location.reload();
      }
    });
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.khands) setKhands(data.khands);
        if (data.mandals) setMandals(data.mandals);
        if (data.villages) setVillages(data.villages);
        if (data.contacts) setContacts(data.contacts);
        if (data.trips) setTrips(data.trips);
        if (data.categories) setCategories(data.categories);
        if (data.eventCategories) setEventCategories(data.eventCategories);
        if (data.customLists) setCustomLists(data.customLists);
        if (data.meetings) setMeetings(data.meetings);
        if (data.userName) setUserName(data.userName);
        alert('डेटा सफलतापूर्वक रिस्टोर हो गया है!');
      } catch (err) {
        alert('डेटा रिस्टोर करने में त्रुटि हुई। कृपया सही फाइल चुनें।');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Rendering Tabs
  const renderHome = () => {
    const upcomingMeetings = meetings
      .filter(m => new Date(m.date) >= new Date() || isToday(parseISO(m.date)))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);

    const getEventIcon = (cat: string) => {
      const iconName = eventCategories.find(c => c.name === cat)?.icon;
      if (iconName) return <LucideIcon name={iconName} size={16} />;
      return <Rocket size={16} />;
    };

    return (
      <div className="p-4 pb-24 space-y-6 animate-in fade-in duration-500">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-blue-900 dark:text-blue-400 tracking-tight">प्रवास प्लान</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5 tracking-widest">नमस्ते, {userName}</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 active:scale-95 transition-all">
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
          </button>
        </header>

        <section className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <select value={dashKhand} onChange={(e) => { setDashKhand(e.target.value); setDashMandal('all'); }} className="w-full bg-gray-50 dark:bg-gray-900 dark:text-gray-100 p-3 rounded-xl border dark:border-gray-700 font-bold text-xs outline-none">
              <option value="all">सभी खंड</option>
              {khands.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
            <select value={dashMandal} disabled={dashKhand === 'all'} onChange={(e) => setDashMandal(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 dark:text-gray-100 p-3 rounded-xl border dark:border-gray-700 font-bold text-xs outline-none disabled:opacity-50">
              <option value="all">सभी मंडल</option>
              {mandals.filter(m => m.khandId === dashKhand).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="कुल संपर्क" value={stats.total} color="bg-blue-50 dark:bg-blue-900/20 text-blue-800" onClick={() => setActiveTab('people')} />
          <StatCard label="सक्रिय" value={stats.active} color="bg-green-50 dark:bg-green-900/20 text-green-800" onClick={() => { setPeopleStatusFilter(Status.SAKRIYA); setActiveTab('people'); }} />
        </div>

        {/* Upcoming Events Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black dark:text-white uppercase tracking-widest text-gray-400">आगामी कार्यक्रम</h3>
            <button onClick={() => setActiveTab('calendar')} className="text-[10px] font-black text-blue-600 uppercase">सभी देखें</button>
          </div>
          <div className="space-y-3">
             {upcomingMeetings.map(m => (
                <div key={m.id} onClick={() => { setSelectedListId(m.listId); setSelectedMeetingId(m.id); setActiveTab('lists'); }} className="bg-white dark:bg-gray-800 p-4 rounded-3xl border dark:border-gray-700 flex items-center gap-4 shadow-sm active:scale-95 transition-all border-l-4 border-l-orange-500">
                   <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl">
                      {getEventIcon(m.category)}
                   </div>
                   <div className="flex-1">
                      <div className="font-bold dark:text-white text-sm leading-tight">{m.title}</div>
                      <div className="text-[10px] font-bold text-gray-400 mt-0.5">{new Date(m.date).toLocaleDateString('hi-IN', { dateStyle: 'medium' })} • {m.category}</div>
                   </div>
                   <ChevronRight size={16} className="text-gray-300"/>
                </div>
             ))}
             {upcomingMeetings.length === 0 && (
                <div className="py-10 text-center text-gray-400 font-bold bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 text-xs">कोई आगामी कार्यक्रम नहीं है</div>
             )}
          </div>
        </section>

        <button onClick={() => setActiveTab('trips')} className="w-full p-5 bg-orange-600 text-white rounded-[2rem] font-bold flex justify-between items-center shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
          <div className="flex items-center gap-3"><CalendarIcon size={24}/><span>यात्रा योजना देखें</span></div>
          <ChevronRight size={20}/>
        </button>
      </div>
    );
  };

  const renderPeople = () => {
    if (selectedContactId) {
      const contact = contacts.find(c => c.id === selectedContactId);
      if (!contact) return null;
      return (
        <ContactProfile 
          contact={contact} 
          khands={khands} mandals={mandals} villages={villages} categories={categories}
          isRecentlyCalled={isRecentlyCalled(contact.id)}
          onDial={() => handleDial(contact.id)}
          onBack={() => setSelectedContactId(null)} 
          onDelete={() => {
            setConfirmation({
              title: 'संपर्क हटाएं?',
              message: `क्या आप वाकई ${contact.name} को हटाना चाहते हैं?`,
              onConfirm: () => {
                setContacts(c => c.filter(x => x.id !== contact.id));
                setSelectedContactId(null);
                setConfirmation(null);
              }
            });
          }}
          onEdit={() => setEditingContact(contact)}
          onLogVisit={() => setIsLoggingVisit(contact.id)}
        />
      );
    }
    const filtered = contacts.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(peopleSearch.toLowerCase()) || c.phone.includes(peopleSearch);
      const matchStatus = peopleStatusFilter === 'all' || c.status === peopleStatusFilter;
      const matchArea = (dashKhand === 'all' || c.khandId === dashKhand) && (dashMandal === 'all' || c.mandalId === dashMandal);
      return matchSearch && matchStatus && matchArea;
    });
    return (
      <div className="p-4 pb-24 space-y-4 animate-in slide-in-from-right duration-300">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-black dark:text-white">संपर्क</h1>
          <button onClick={() => setIsAddingContact(true)} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg active:scale-90 transition-all"><Plus/></button>
        </header>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="खोजें..." value={peopleSearch} onChange={e=>setPeopleSearch(e.target.value)} className="w-full bg-white dark:bg-gray-800 dark:text-white p-4 pl-10 rounded-2xl border dark:border-gray-700 outline-none shadow-sm" />
        </div>
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-bold">कोई संपर्क नहीं मिला</div>
          ) : (
            filtered.map(c => {
              const recentlyCalled = isRecentlyCalled(c.id);
              return (
                <div key={c.id} onClick={() => setSelectedContactId(c.id)} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 flex items-center gap-4 active:scale-95 transition-all shadow-sm">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg ${recentlyCalled ? 'bg-orange-500' : 'bg-blue-500'}`}>{c.name[0]}</div>
                  <div className="flex-1">
                    <div className="font-bold dark:text-gray-100">{c.name}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {getVillageName(c.villageId)} • {getMandalName(c.mandalId)}
                    </div>
                  </div>
                  <a 
                    href={`tel:${c.phone}`} 
                    onClick={(e) => { e.stopPropagation(); handleDial(c.id); }} 
                    className={`p-3 rounded-2xl transition-all ${recentlyCalled ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'}`}
                  >
                    <Phone size={18} />
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderTrips = () => (
    <div className="p-4 pb-24 space-y-4 animate-in slide-in-from-right duration-300">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-black dark:text-white">यात्रा योजना</h1>
        <button onClick={() => setIsAddingTrip(true)} className="p-3 bg-orange-600 text-white rounded-2xl shadow-lg active:scale-90 transition-all"><Plus/></button>
      </header>
      <div className="space-y-4">
        {trips.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-10 rounded-[2rem] text-center border dark:border-gray-700 text-gray-400 font-bold">कोई यात्रा योजना नहीं है</div>
        ) : (
          trips.map(trip => (
            <div key={trip.id} className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] border dark:border-gray-700 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-blue-600 font-black text-xs uppercase">{new Date(trip.date).toLocaleDateString('hi-IN', { dateStyle: 'full' })}</div>
                  <div className="font-bold dark:text-white mt-1 text-lg">{getMandalName(trip.mandalId)} ({getKhandName(trip.khandId)})</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${trip.isCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30'}`}>
                  {trip.isCompleted ? 'पूर्ण' : 'लंबित'}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {trip.villageIds.map(vid => (
                  <span key={vid} className="px-3 py-1 bg-gray-50 dark:bg-gray-900 dark:text-gray-300 rounded-xl text-[10px] font-black border dark:border-gray-700">{getVillageName(vid)}</span>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                {!trip.isCompleted && (
                  <button onClick={() => handleUpdateTrip(trip.id, { isCompleted: true })} className="flex-1 p-4 bg-green-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                    <CheckCircle2 size={16}/> पूर्ण चिह्नित करें
                  </button>
                )}
                <button onClick={() => setEditingTrip(trip)} className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl active:scale-95 transition-all"><Edit2 size={20}/></button>
                <button 
                  onClick={() => { 
                    setConfirmation({
                      title: 'यात्रा योजना हटाएं?',
                      message: 'क्या आप इस यात्रा योजना को स्थायी रूप से हटाना चाहते हैं?',
                      onConfirm: () => {
                        setTrips(prev => prev.filter(t => t.id !== trip.id));
                        setConfirmation(null);
                      }
                    });
                  }} 
                  className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl active:scale-95 transition-all"
                >
                  <Trash2 size={20}/>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderLists = () => {
    if (selectedListId && selectedMeetingId) {
      const list = customLists.find(l => l.id === selectedListId);
      const meeting = meetings.find(m => m.id === selectedMeetingId);
      if (!list || !meeting) return null;
      const listContacts = contacts.filter(c => list.peopleIds.includes(c.id));
      
      const togglePresence = (cid: string) => {
        setMeetings(prev => prev.map(m => {
          if (m.id !== meeting.id) return m;
          const isPresent = m.presentPeopleIds.includes(cid);
          return {
            ...m,
            presentPeopleIds: isPresent 
              ? m.presentPeopleIds.filter(id => id !== cid)
              : [...m.presentPeopleIds, cid]
          };
        }));
      };

      return (
        <div className="p-4 pb-24 space-y-6 animate-in slide-in-from-right duration-300">
          <header className="flex items-center gap-4">
            <button onClick={() => setSelectedMeetingId(null)} className="p-2 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 active:scale-95 transition-all"><ArrowLeft size={20} className="dark:text-white"/></button>
            <div className="flex-1">
              <h2 className="text-xl font-black dark:text-white">{meeting.title}</h2>
              <div className="text-[10px] font-bold text-gray-400 uppercase">{new Date(meeting.date).toLocaleDateString('hi-IN')}</div>
            </div>
            <button 
              onClick={() => {
                setConfirmation({
                  title: 'बैठक हटाएं?',
                  message: `क्या आप '${meeting.title}' बैठक को हटाना चाहते हैं?`,
                  onConfirm: () => {
                    setMeetings(prev => prev.filter(m => m.id !== meeting.id));
                    setSelectedMeetingId(null);
                    setConfirmation(null);
                  }
                });
              }}
              className="p-3 bg-red-50 text-red-600 rounded-2xl active:scale-95 transition-all"
            >
              <Trash2 size={20}/>
            </button>
          </header>

          {/* RSVP Summary */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'आ रहे हैं', count: listContacts.filter(c => meeting.attendance[c.id] === AttendanceStatus.COMING).length, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
              { label: 'नहीं आ रहे', count: listContacts.filter(c => meeting.attendance[c.id] === AttendanceStatus.NOT_COMING).length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
              { label: 'निश्चित नहीं', count: listContacts.filter(c => meeting.attendance[c.id] === AttendanceStatus.NOT_CONFIRMED).length, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
              { label: 'लंबित', count: listContacts.filter(c => !meeting.attendance[c.id] || meeting.attendance[c.id] === AttendanceStatus.PENDING).length, color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-800' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} p-3 rounded-2xl border dark:border-gray-700 text-center space-y-1`}>
                <div className={`text-lg font-black ${s.color}`}>{s.count}</div>
                <div className="text-[8px] font-black uppercase text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {meeting.notes && (
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
               <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-1">बैठक के नोट्स</div>
               <div className="text-xs dark:text-gray-300 italic">"{meeting.notes}"</div>
            </div>
          )}
          
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">उपस्थिति और प्रतिपुष्टि (RSVP & Attendance)</h3>
              {listContacts.map(c => {
                const status = meeting.attendance[c.id] || AttendanceStatus.PENDING;
                const isPresent = meeting.presentPeopleIds.includes(c.id);
                return (
                  <div key={c.id} className="bg-white dark:bg-gray-800 p-4 rounded-3xl border dark:border-gray-700 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black ${isPresent ? 'bg-green-500 shadow-lg' : 'bg-gray-400'}`}>
                          {isPresent ? <UserCheck size={14}/> : c.name[0]}
                        </div>
                        <div>
                          <div className="font-bold dark:text-white text-sm">{c.name}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => togglePresence(c.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${isPresent ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}
                        >
                          <UserCheck size={14}/> {isPresent ? 'उपस्थित' : 'अनुपस्थित'}
                        </button>
                        <a href={`tel:${c.phone}`} onClick={() => handleDial(c.id)} className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center justify-center"><Phone size={14}/></a>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {[AttendanceStatus.COMING, AttendanceStatus.NOT_COMING, AttendanceStatus.NOT_CONFIRMED].map((s) => (
                        <button 
                          key={s}
                          onClick={() => {
                            setMeetings(prev => prev.map(m => m.id === meeting.id ? { ...m, attendance: { ...m.attendance, [c.id]: s } } : m));
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${status === s ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-900 text-gray-400 border dark:border-gray-800 focus:outline-none'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {listContacts.length === 0 && (
                <div className="py-20 text-center text-gray-400 font-bold bg-white dark:bg-gray-800 rounded-[2rem] border dark:border-gray-700 text-xs">सूची में कोई सदस्य नहीं है</div>
              )}
            </section>
          </div>
        </div>
      );
    }

    if (selectedListId) {
      const list = customLists.find(l => l.id === selectedListId);
      if (!list) return null;
      const listMeetings = meetings.filter(m => m.listId === list.id);
      
      return (
        <div className="p-4 pb-24 space-y-8 animate-in slide-in-from-right duration-300">
           <header className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedListId(null)} className="p-2 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700"><ArrowLeft size={20} className="dark:text-white"/></button>
                <h2 className="text-xl font-black dark:text-white">{list.name}</h2>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsManagingMembers(true)}
                  className="p-3 bg-indigo-600 text-white rounded-2xl shadow-sm active:scale-95 transition-all"
                >
                  <UserPlus size={18}/>
                </button>
                <button 
                  onClick={() => setIsAddingMeeting(true)}
                  className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                  <CalendarCheck size={18}/>
                </button>
              </div>
           </header>

           <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">बैठकें और कार्यक्रम (Events)</h3>
                <div className="space-y-3">
                  {listMeetings.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 font-bold bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 text-[10px]">कोई बैठक निर्धारित नहीं है</div>
                  ) : (
                    listMeetings.map(m => (
                      <div key={m.id} onClick={() => setSelectedMeetingId(m.id)} className="bg-white dark:bg-gray-800 p-4 rounded-3xl border dark:border-gray-700 flex justify-between items-center shadow-sm active:scale-95 transition-all border-l-4 border-l-blue-500">
                         <div>
                            <div className="font-bold dark:text-white text-sm">{m.title}</div>
                            <div className="text-[10px] font-bold text-gray-400">{new Date(m.date).toLocaleDateString('hi-IN')}</div>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="text-[10px] font-black text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">{m.presentPeopleIds.length} उपस्थित</div>
                            <ChevronRight size={16} className="text-gray-300"/>
                         </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">सूची के सदस्य ({list.peopleIds.length})</h3>
                <div className="space-y-3">
                  {contacts.filter(c => list.peopleIds.includes(c.id)).map(c => {
                    const recentlyCalled = isRecentlyCalled(c.id);
                    return (
                      <div key={c.id} onClick={() => { setSelectedContactId(c.id); setActiveTab('people'); }} className="bg-white dark:bg-gray-800 p-4 rounded-[2rem] border dark:border-gray-700 flex items-center gap-4 active:scale-95 transition-all shadow-sm">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black ${recentlyCalled ? 'bg-orange-500' : 'bg-indigo-500 shadow-lg shadow-indigo-500/20'}`}>{c.name[0]}</div>
                         <div className="flex-1 font-bold dark:text-gray-100 text-sm">{c.name}</div>
                         <a 
                           href={`tel:${c.phone}`} 
                           onClick={(e) => { e.stopPropagation(); handleDial(c.id); }} 
                           className={`p-2 rounded-2xl active:scale-90 transition-all ${recentlyCalled ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}
                         >
                           <Phone size={18} />
                         </a>
                         <ChevronRight size={16} className="text-gray-300"/>
                      </div>
                    );
                  })}
                  {list.peopleIds.length === 0 && (
                    <div className="py-20 text-center text-gray-400 font-bold bg-white dark:bg-gray-800 rounded-[2rem] border dark:border-gray-700">इस सूची में कोई सदस्य नहीं है</div>
                  )}
                </div>
              </section>
           </div>
        </div>
      );
    }
    return (
      <div className="p-4 pb-24 space-y-6 animate-in slide-in-from-right duration-300">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-black dark:text-white">मेरी सूचियां (गट)</h1>
          <button onClick={() => setIsAddingList(true)} className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg active:scale-90 transition-all"><Plus/></button>
        </header>
        <div className="grid grid-cols-1 gap-3">
           {customLists.map(list => (
              <div key={list.id} onClick={() => setSelectedListId(list.id)} className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] border dark:border-gray-700 flex justify-between items-center shadow-sm active:scale-95 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl"><ListIcon size={24}/></div>
                    <div>
                       <div className="font-bold dark:text-white">{list.name}</div>
                       <div className="text-[10px] font-bold text-gray-400 uppercase">{list.peopleIds.length} सदस्य</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setConfirmation({
                          title: 'सूची हटाएं?',
                          message: `क्या आप '${list.name}' सूची को हटाना चाहते हैं?`,
                          onConfirm: () => {
                            setCustomLists(prev => prev.filter(l => l.id !== list.id));
                            setConfirmation(null);
                          }
                        });
                      }} 
                      className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                    >
                      <Trash2 size={16}/>
                   </button>
                   <ChevronRight className="text-gray-300"/>
                 </div>
              </div>
           ))}
           {customLists.length === 0 && (
              <div className="py-20 text-center text-gray-400 font-bold bg-white dark:bg-gray-800 rounded-[2rem] border dark:border-gray-700">अभी कोई सूची नहीं है</div>
           )}
        </div>
      </div>
    );
  };

  const renderWorkStatus = () => {
    if (selectedVillageId) {
      const village = villages.find(v => v.id === selectedVillageId);
      if (!village) return null;
      return (
        <VillageWorkStatusDetail 
          village={village} contacts={contacts}
          onBack={() => setSelectedVillageId(null)}
          onContactClick={(id: string) => { setSelectedContactId(id); setActiveTab('people'); }}
          onUpdateStage={(stage: VillageStage) => updateVillageStage(village.id, stage)}
          onUpdateShakhaData={(data: Partial<ShakhaData>) => updateShakhaData(village.id, data)}
        />
      );
    }
    return (
      <div className="p-4 pb-24 space-y-4 animate-in slide-in-from-right duration-300">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-black dark:text-white">कार्यस्थिति</h1>
          <Building2 className="text-blue-600" />
        </header>
        <div className="space-y-4">
          {mandals.map(m => (
            <div key={m.id} className="space-y-2">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">{m.name}</h3>
              <div className="grid grid-cols-1 gap-2">
                {villages.filter(v => v.mandalId === m.id).map(v => (
                  <div key={v.id} onClick={() => setSelectedVillageId(v.id)} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 flex justify-between items-center active:scale-95 transition-all">
                    <div className="font-bold dark:text-white text-sm">{v.name}</div>
                    <span className="text-[9px] font-black uppercase px-2 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full">{v.stage}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      <main className="min-h-screen">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'people' && renderPeople()}
        {activeTab === 'trips' && renderTrips()}
        {activeTab === 'lists' && renderLists()}
        {activeTab === 'work-status' && renderWorkStatus()}
        {activeTab === 'calendar' && (
          <CalendarTab 
            trips={trips} 
            contacts={contacts} 
            meetings={meetings}
            khands={khands} 
            mandals={mandals}
            dashKhand={dashKhand}
            dashMandal={dashMandal}
            setDashKhand={setDashKhand}
            setDashMandal={setDashMandal}
            setSelectedListId={setSelectedListId}
            setSelectedMeetingId={setSelectedMeetingId}
            setActiveTab={setActiveTab}
            onTripClick={(trip: TripPlan) => { setEditingTrip(trip); setActiveTab('trips'); }}
            onContactClick={(id: string) => { setSelectedContactId(id); setActiveTab('people'); }}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab 
            userName={userName} setUserName={setUserName} 
            darkMode={darkMode} setDarkMode={setDarkMode}
            setActiveTab={setActiveTab} 
            exportData={exportData} 
            importData={() => fileInputRef.current?.click()}
            resetAllData={resetAllData} 
          />
        )}
        {activeTab === 'cat-mgmt' && <CatMgmt categories={categories} setCategories={setCategories} onBack={()=>setActiveTab('settings')} setConfirmation={setConfirmation} />}
        {activeTab === 'event-cat-mgmt' && <CatMgmt title="कार्यक्रम श्रेणी प्रबंधन" categories={eventCategories} setCategories={setEventCategories} onBack={()=>setActiveTab('settings')} setConfirmation={setConfirmation} />}
      </main>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={importData} 
        accept=".json" 
        className="hidden" 
      />

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t dark:border-gray-800 flex justify-around items-center p-3 z-40 rounded-t-[2.5rem] shadow-2xl">
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label="होम" />
        <NavBtn active={activeTab === 'people'} onClick={() => { setActiveTab('people'); setSelectedContactId(null); }} icon={<Users />} label="संपर्क" />
        <NavBtn active={activeTab === 'lists'} onClick={() => { setActiveTab('lists'); setSelectedListId(null); }} icon={<ListIcon />} label="सूचियां" />
        <NavBtn active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={<CalendarIcon />} label="कैलेंडर" />
        <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings />} label="सेट" />
      </nav>

      {/* Forms & Modals */}
      {(isAddingContact || editingContact) && (
        <ContactFormModal 
          khands={khands} mandals={mandals} villages={villages} categories={categories}
          initialData={editingContact}
          onClose={() => { setIsAddingContact(false); setEditingContact(null); }} 
          onSubmit={(data: any) => editingContact ? handleUpdateContact(editingContact.id, data) : handleAddContact(data)} 
        />
      )}
      {(isAddingTrip || editingTrip) && (
        <TripFormModal 
          khands={khands} mandals={mandals} villages={villages} contacts={contacts}
          initialData={editingTrip}
          onClose={() => { setIsAddingTrip(false); setEditingTrip(null); }} 
          onSubmit={(data: any) => editingTrip ? handleUpdateTrip(editingTrip.id, data) : handleAddTrip(data)} 
        />
      )}
      {isLoggingVisit && (
        <VisitLogModal 
          contactName={contacts.find(c => c.id === isLoggingVisit)?.name || ''} 
          onClose={() => setIsLoggingVisit(null)} 
          onSubmit={(notes: string) => handleLogVisit(isLoggingVisit!, notes)} 
        />
      )}
      {isAddingList && (
         <PromptModal 
            title="नई सूची" 
            placeholder="सूची का नाम लिखें..." 
            onSubmit={(name: string) => { if(name) { setCustomLists(prev => [...prev, { id: `l${Date.now()}`, name, peopleIds: [] }]); setIsAddingList(false); } }} 
            onCancel={() => setIsAddingList(false)} 
         />
      )}
      {isAddingMeeting && (
        <MeetingFormModal 
          onClose={() => setIsAddingMeeting(false)}
          eventCategories={eventCategories}
          onSubmit={(data: any) => {
            setMeetings(prev => [...prev, { id: `m${Date.now()}`, listId: selectedListId!, ...data, attendance: {}, presentPeopleIds: [] }]);
            setIsAddingMeeting(false);
          }}
        />
      )}
      {isManagingMembers && selectedListId && (
        <ManageListMembersModal 
          list={customLists.find(l => l.id === selectedListId)!}
          contacts={contacts}
          khands={khands}
          mandals={mandals}
          villages={villages}
          onClose={() => setIsManagingMembers(false)}
          onSave={(newPeopleIds: string[]) => {
            setCustomLists(prev => prev.map(l => l.id === selectedListId ? { ...l, peopleIds: newPeopleIds } : l));
            setContacts(prev => prev.map(c => {
               const isInNewList = newPeopleIds.includes(c.id);
               const hadList = c.listIds.includes(selectedListId);
               if (isInNewList && !hadList) return { ...c, listIds: [...c.listIds, selectedListId] };
               if (!isInNewList && hadList) return { ...c, listIds: c.listIds.filter(id => id !== selectedListId) };
               return c;
            }));
            setIsManagingMembers(false);
          }}
        />
      )}
      {confirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center">
                <Trash2 size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black dark:text-white">{confirmation.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">{confirmation.message}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmation(null)} className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold rounded-2xl active:scale-95 transition-all">नहीं</button>
              <button onClick={confirmation.onConfirm} className="flex-1 p-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all">हाँ, हटाएं</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center p-2 rounded-2xl transition-all ${active ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400'}`}>
    {React.cloneElement(icon, { size: 20 })}
    <span className="text-[9px] mt-1 font-black uppercase tracking-widest">{label}</span>
  </button>
);

const StatCard = ({ label, value, color, onClick }: any) => (
  <div onClick={onClick} className={`${color} p-4 rounded-3xl shadow-sm border border-transparent dark:border-gray-800 active:scale-95 transition-all flex flex-col justify-between h-24`}>
     <div className="text-[10px] font-black uppercase opacity-60">{label}</div>
     <div className="text-2xl font-black">{value}</div>
  </div>
);

const ContactProfile = ({ contact, villages, mandals, onDelete, onEdit, onLogVisit, onBack, isRecentlyCalled, onDial }: any) => {
  const vName = villages.find((v: any) => v.id === contact.villageId)?.name || '';
  const mName = mandals.find((m: any) => m.id === contact.mandalId)?.name || '';
  return (
    <div className="p-4 pb-24 space-y-6 animate-in slide-in-from-right duration-300">
      <header className="flex justify-between items-center">
        <button onClick={onBack} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 active:scale-95 transition-all"><ArrowLeft size={20} className="dark:text-white"/></button>
        <div className="flex gap-2">
           <button onClick={onEdit} className="p-3 bg-blue-50 text-blue-600 rounded-2xl active:scale-95 transition-all"><Edit2 size={20}/></button>
           <button onClick={onDelete} className="p-3 bg-red-50 text-red-600 rounded-2xl active:scale-95 transition-all"><Trash2 size={20}/></button>
        </div>
      </header>
      <div className="text-center space-y-4">
         <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-white dark:ring-gray-800 transition-colors ${isRecentlyCalled ? 'bg-orange-500' : 'bg-blue-600'}`}>{contact.name[0]}</div>
         <h2 className="text-2xl font-black dark:text-white">{contact.name}</h2>
         <a 
          href={`tel:${contact.phone}`} 
          onClick={onDial} 
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-all ${isRecentlyCalled ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}
        >
          <Phone size={18}/> {contact.phone}
        </a>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border dark:border-gray-700 space-y-6">
         <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                 <LucideIcon name={categories.find(c => c.name === contact.category)?.icon || 'Tag'} size={18} />
              </div>
              <div><label className="text-[10px] font-bold text-gray-400 uppercase">श्रेणी</label><div className="text-sm font-bold dark:text-white mt-1">{contact.category}</div></div>
            </div>
            <div><label className="text-[10px] font-bold text-gray-400 uppercase">स्थिति</label><div className="text-sm font-bold dark:text-white mt-1">{contact.status}</div></div>
         </div>
         <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl uppercase">
            <MapPin size={14}/> {vName} • {mName}
         </div>
         <div className="space-y-3">
            <h4 className="text-[10px] font-black text-gray-400 uppercase">मुलाकात इतिहास</h4>
            {contact.history.length === 0 ? (
               <div className="text-xs text-gray-400 italic">कोई इतिहास नहीं है</div>
            ) : (
               contact.history.map((h: any) => (
                  <div key={h.id} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border dark:border-gray-800">
                     <div className="text-[10px] font-bold text-blue-500">{new Date(h.date).toLocaleDateString('hi-IN')}</div>
                     <div className="text-xs dark:text-gray-300 mt-1">"{h.notes}"</div>
                  </div>
               ))
            )}
         </div>
      </div>
      <button onClick={onLogVisit} className="w-full p-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"><CheckCircle2 size={18}/> मुलाकात दर्ज करें</button>
    </div>
  );
};

const VillageWorkStatusDetail = ({ village, contacts, onBack, onContactClick, onUpdateStage, onUpdateShakhaData }: any) => {
  const vContacts = contacts.filter((c: any) => c.villageId === village.id);
  return (
    <div className="p-4 pb-24 space-y-6 animate-in slide-in-from-right duration-300">
       <header className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 active:scale-95 transition-all"><ArrowLeft size={20} className="dark:text-white"/></button>
          <h2 className="text-2xl font-black dark:text-white">{village.name}</h2>
       </header>
       <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border dark:border-gray-700 space-y-6 shadow-sm">
          <div className="space-y-3">
             <label className="text-[10px] font-bold text-gray-400 uppercase px-1">कार्य प्रकार</label>
             <div className="grid grid-cols-2 gap-2">
                {Object.values(VillageStage).map(s => (
                   <button key={s} onClick={() => onUpdateStage(s)} className={`p-3 rounded-2xl text-[10px] font-black border transition-all active:scale-95 ${village.stage === s ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800'}`}>{s}</button>
                ))}
             </div>
          </div>
          <div className="space-y-3 pt-4 border-t dark:border-gray-700">
             <label className="text-[10px] font-bold text-gray-400 uppercase px-1">दायित्व वितरण</label>
             {Object.values(ShakhaPosition).map(pos => (
                <div key={pos} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-800">
                   <div className="text-[10px] font-bold text-gray-500 uppercase">{pos}</div>
                   <div className="flex items-center gap-2">
                      <select 
                        className="bg-transparent text-[10px] font-black dark:text-white outline-none text-right" 
                        value={village.shakhaData?.positions?.[pos] || ''} 
                        onChange={e => onUpdateShakhaData({ positions: { ...village.shakhaData?.positions, [pos]: e.target.value } })}
                      >
                         <option value="">चुनें...</option>
                         {vContacts.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      {village.shakhaData?.positions?.[pos] && (
                        <button onClick={() => onContactClick(village.shakhaData.positions[pos])} className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg active:scale-90"><ChevronRight size={14}/></button>
                      )}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const ContactFormModal = ({ khands, mandals, villages, categories, initialData, onClose, onSubmit }: any) => {
  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [khandId, setKhandId] = useState(initialData?.khandId || '');
  const [mandalId, setMandalId] = useState(initialData?.mandalId || '');
  const [villageId, setVillageId] = useState(initialData?.villageId || '');
  const [cat, setCat] = useState(initialData?.category || categories[0]?.name || '');
  const [status, setStatus] = useState(initialData?.status || Status.SAKRIYA);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end">
      <div className="bg-white dark:bg-gray-900 w-full rounded-t-[3rem] p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar">
        <h2 className="text-2xl font-black dark:text-white tracking-tight">{initialData ? 'संपर्क सुधारें' : 'नया संपर्क'}</h2>
        <div className="space-y-4">
           <input placeholder="पूरा नाम" className="w-full p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-2xl outline-none font-bold shadow-inner" value={name} onChange={e=>setName(e.target.value)} />
           <input placeholder="मोबाइल नंबर" type="tel" maxLength={10} className="w-full p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-2xl outline-none font-bold shadow-inner" value={phone} onChange={e=>setPhone(e.target.value)} />
           <div className="grid grid-cols-2 gap-3">
             <select className="p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-2xl font-bold text-xs" value={khandId} onChange={e=>{setKhandId(e.target.value); setMandalId(''); setVillageId('');}}>
               <option value="">खंड चुनें</option>
               {khands.map((k: any) => <option key={k.id} value={k.id}>{k.name}</option>)}
             </select>
             <select className="p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-2xl font-bold text-xs disabled:opacity-50" value={mandalId} disabled={!khandId} onChange={e=>{setMandalId(e.target.value); setVillageId('');}}>
               <option value="">मंडल चुनें</option>
               {mandals.filter((m: any) => m.khandId === khandId).map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
             </select>
           </div>
           <select className="w-full p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-2xl font-bold text-xs disabled:opacity-50" value={villageId} disabled={!mandalId} onChange={e=>setVillageId(e.target.value)}>
             <option value="">गांव चुनें</option>
             {villages.filter((v: any)=>v.mandalId===mandalId).map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
           </select>
           <div className="grid grid-cols-2 gap-3">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">श्रेणी</label>
               <div className="relative">
                 <select className="w-full p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-2xl font-bold text-xs appearance-none pl-10" value={cat} onChange={e=>setCat(e.target.value)}>
                   {categories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                 </select>
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                    <LucideIcon name={categories.find((c:any)=>c.name===cat)?.icon || 'Tag'} size={18} />
                 </div>
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">स्थिति</label>
               <select className="w-full p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-2xl font-bold text-xs" value={status} onChange={e=>setStatus(e.target.value as Status)}>
                 {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
           </div>
        </div>
        <div className="flex gap-4 pt-4">
           <button onClick={onClose} className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 dark:text-white font-bold rounded-2xl active:scale-95 transition-all">रद्द</button>
           <button disabled={!name || !phone || !villageId} onClick={()=>onSubmit({ name, phone, khandId, mandalId, villageId, category: cat, status })} className="flex-1 p-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50">सुरक्षित</button>
        </div>
      </div>
    </div>
  );
};

const TripFormModal = ({ khands, mandals, villages, contacts, initialData, onClose, onSubmit }: any) => {
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [khandId, setKhandId] = useState(initialData?.khandId || '');
  const [mandalId, setMandalId] = useState(initialData?.mandalId || '');
  const [selVillages, setSelVillages] = useState<string[]>(initialData?.villageIds || []);
  const [selPeople, setSelPeople] = useState<string[]>(initialData?.peopleIds || []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end">
      <div className="bg-white dark:bg-gray-900 w-full rounded-t-[3rem] p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar">
        <h2 className="text-2xl font-black dark:text-white tracking-tight">{initialData ? 'योजना सुधारें' : 'नई यात्रा'}</h2>
        <div className="space-y-4">
           <input type="date" className="w-full p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-2xl outline-none font-bold" value={date} onChange={e=>setDate(e.target.value)} />
           <div className="grid grid-cols-2 gap-3">
              <select className="p-3 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-xl text-xs font-bold" value={khandId} onChange={e=>{setKhandId(e.target.value); setMandalId(''); setSelVillages([]); setSelPeople([]);}}>
                <option value="">खंड चुनें</option>
                {khands.map((k:any)=><option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
              <select className="p-3 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-xl text-xs font-bold disabled:opacity-50" value={mandalId} disabled={!khandId} onChange={e=>{setMandalId(e.target.value); setSelVillages([]); setSelPeople([]);}}>
                <option value="">मंडल चुनें</option>
                {mandals.filter((m:any)=>m.khandId===khandId).map((m:any)=><option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
           </div>
           {mandalId && (
             <>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">गांव का चयन</label>
               <div className="flex flex-wrap gap-2">
                 {villages.filter((v:any)=>v.mandalId===mandalId).map((v:any)=>(
                   <button key={v.id} onClick={()=>setSelVillages(prev=>prev.includes(v.id)?prev.filter(x=>x!==v.id):[...prev, v.id])} className={`px-3 py-2 rounded-xl text-[10px] font-black border transition-all ${selVillages.includes(v.id)?'bg-orange-600 text-white border-orange-600':'bg-gray-50 dark:bg-gray-800 dark:text-gray-300 border-gray-100 dark:border-gray-700'}`}>{v.name}</button>
                 ))}
               </div>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">संपर्क का चयन</label>
               <div className="space-y-2">
                 {contacts.filter((c:any)=>c.mandalId===mandalId).map((c:any)=>(
                   <button key={c.id} onClick={()=>setSelPeople(prev=>prev.includes(c.id)?prev.filter(x=>x!==c.id):[...prev, c.id])} className={`w-full p-3 rounded-xl text-left text-xs font-bold border flex items-center justify-between transition-all ${selPeople.includes(c.id)?'bg-blue-600 text-white border-blue-600':'bg-gray-50 dark:bg-gray-800 dark:text-gray-300 border-gray-100 dark:border-gray-700'}`}>
                     <span>{c.name}</span>
                     {selPeople.includes(c.id)&&<CheckCircle2 size={14}/>}
                   </button>
                 ))}
               </div>
             </>
           )}
        </div>
        <div className="flex gap-4 pt-4">
           <button onClick={onClose} className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 dark:text-white font-bold rounded-2xl active:scale-95 transition-all">रद्द</button>
           <button disabled={!mandalId || selVillages.length===0} onClick={()=>onSubmit({ date, khandId, mandalId, villageIds: selVillages, peopleIds: selPeople, notes: '', isCompleted: initialData?.isCompleted || false })} className="flex-1 p-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50">सुरक्षित करें</button>
        </div>
      </div>
    </div>
  );
};

const CatMgmt = ({ categories, setCategories, onBack, setConfirmation, title = "श्रेणी प्रबंधन" }: any) => {
   const [newCat, setNewCat] = useState('');
   const [newIcon, setNewIcon] = useState('User');
   const [isPickingIcon, setIsPickingIcon] = useState(false);

   return (
      <div className="p-4 pb-24 space-y-6 animate-in slide-in-from-right duration-300">
         <header className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 active:scale-90"><ArrowLeft size={20} className="dark:text-white"/></button>
            <h2 className="text-xl font-black dark:text-white">{title}</h2>
         </header>
         <div className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] border dark:border-gray-700 space-y-4 shadow-sm">
            <div className="space-y-3">
               <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">नाम</label>
                    <input 
                      className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl font-bold dark:text-white outline-none border dark:border-gray-700" 
                      placeholder="नाम लिखें..." 
                      value={newCat} 
                      onChange={e=>setNewCat(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">आइकॉन</label>
                    <button 
                      onClick={() => setIsPickingIcon(true)}
                      className="p-4 bg-gray-50 dark:bg-gray-900 text-blue-600 rounded-xl border dark:border-gray-700 active:scale-95 transition-all flex items-center justify-center min-w-[60px]"
                    >
                      <LucideIcon name={newIcon} size={24} />
                    </button>
                  </div>
               </div>
               <button 
                onClick={()=>{
                  if(newCat){
                    setCategories([...categories, { id: `cat_${Date.now()}`, name: newCat, icon: newIcon }]); 
                    setNewCat('');
                    setNewIcon('User');
                  }
                }} 
                className="w-full p-4 bg-blue-600 text-white rounded-xl font-bold active:scale-95 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
               >
                 <Plus size={20} /> जोड़ें
               </button>
            </div>

            <div className="pt-4 border-t dark:border-gray-700 space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">मौजूदा श्रेणियां</label>
               <div className="grid grid-cols-1 gap-2">
                 {categories.map((c: any) => (
                    <div key={c.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-700">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-gray-800 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm border dark:border-gray-700">
                            <LucideIcon name={c.icon} size={18} />
                          </div>
                          <span className="font-bold dark:text-white">{c.name}</span>
                       </div>
                       <button 
                        onClick={()=>{
                          setConfirmation({
                            title: 'श्रेणी हटाएं?',
                            message: `क्या आप '${c.name}' श्रेणी को हटाना चाहते हैं?`,
                            onConfirm: () => {
                              setCategories(categories.filter((x: any)=>x.id!==c.id));
                              setConfirmation(null);
                            }
                          });
                        }} 
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all active:scale-90"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                 ))}
               </div>
            </div>
         </div>

         {isPickingIcon && (
           <IconPicker 
             currentIcon={newIcon}
             onSelect={(icon) => { setNewIcon(icon); setIsPickingIcon(false); }}
             onClose={() => setIsPickingIcon(false)}
           />
         )}
      </div>
   );
};

const SettingsTab = ({ userName, setUserName, darkMode, setDarkMode, setActiveTab, exportData, importData, resetAllData }: any) => (
  <div className="p-4 pb-24 space-y-6 animate-in fade-in duration-300">
     <h1 className="text-2xl font-black text-blue-900 dark:text-blue-400 tracking-tight">सेटिंग्स</h1>
     <div className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] border dark:border-gray-700 space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><User size={28}/></div>
           <div className="flex-1">
              <input className="bg-transparent font-black dark:text-white text-lg w-full outline-none" value={userName} onChange={e=>setUserName(e.target.value)}/>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">नाम सुधारें</div>
           </div>
        </div>
     </div>
     <div className="bg-white dark:bg-gray-800 rounded-[2rem] border dark:border-gray-700 overflow-hidden divide-y dark:divide-gray-700 shadow-sm">
        <button onClick={()=>setActiveTab('cat-mgmt')} className="w-full p-5 flex justify-between items-center active:bg-gray-50 dark:active:bg-gray-900/40 transition-all">
           <div className="flex items-center gap-4 text-orange-600"><Tag/><span className="font-bold dark:text-white">संपर्क श्रेणी प्रबंधन</span></div>
           <ChevronRight size={18} className="text-gray-300"/>
         </button>
        <button onClick={()=>setActiveTab('event-cat-mgmt')} className="w-full p-5 flex justify-between items-center active:bg-gray-50 dark:active:bg-gray-900/40 transition-all border-t dark:border-gray-700">
           <div className="flex items-center gap-4 text-purple-600"><Flag/><span className="font-bold dark:text-white">कार्यक्रम श्रेणी प्रबंधन</span></div>
           <ChevronRight size={18} className="text-gray-300"/>
         </button>
        <div className="p-5 flex justify-between items-center">
           <div className="flex items-center gap-4 text-indigo-600"><Moon/><span className="font-bold dark:text-white">डार्क मोड</span></div>
           <button onClick={()=>setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full relative transition-all ${darkMode?'bg-indigo-600':'bg-gray-200'}`}><div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${darkMode?'left-7':'left-1'}`}/></button>
        </div>
        <button onClick={exportData} className="w-full p-5 flex justify-between items-center active:bg-gray-50 dark:active:bg-gray-900/40"><div className="flex items-center gap-4 text-green-600"><Download/><span className="font-bold dark:text-white">बैकअप लें</span></div></button>
        <button onClick={importData} className="w-full p-5 flex justify-between items-center active:bg-gray-50 dark:active:bg-gray-900/40 border-t dark:border-gray-700"><div className="flex items-center gap-4 text-blue-600"><Upload/><span className="font-bold dark:text-white">डेटा रिस्टोर करें</span></div></button>
        <button onClick={resetAllData} className="w-full p-5 flex justify-between items-center text-red-600 active:bg-red-50 dark:active:bg-red-900/10 transition-all"><div className="flex items-center gap-4"><RotateCcw/><span className="font-bold">ऐप रिसेट करें</span></div></button>
     </div>
  </div>
);

const PromptModal = ({ title, placeholder, onSubmit, onCancel }: any) => {
   const [val, setVal] = useState('');
   return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center p-6">
         <div className="bg-white dark:bg-gray-900 w-full rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-xl font-black dark:text-white">{title}</h2>
            <input autoFocus className="w-full p-4 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-2xl outline-none border dark:border-gray-700 font-bold" placeholder={placeholder} value={val} onChange={e=>setVal(e.target.value)} />
            <div className="flex gap-3">
               <button onClick={onCancel} className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold rounded-2xl active:scale-95 transition-all">रद्द</button>
               <button onClick={()=>onSubmit(val)} className="flex-1 p-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all">बनाएं</button>
            </div>
         </div>
      </div>
   );
};

const MeetingFormModal = ({ onClose, onSubmit, eventCategories }: any) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState(eventCategories[0]?.name || '');
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-end">
      <div className="bg-white dark:bg-gray-900 w-full rounded-t-[3rem] p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar animate-in slide-in-from-bottom duration-300">
        <header className="flex justify-between items-center">
           <h2 className="text-xl font-black dark:text-white">नई बैठक/कार्यक्रम</h2>
           <button onClick={onClose} className="text-gray-400 font-bold">रद्द</button>
        </header>
        <div className="space-y-4">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">विषय</label>
              <input className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl outline-none border dark:border-gray-700 font-bold dark:text-white" placeholder="बैठक का नाम..." value={title} onChange={e=>setTitle(e.target.value)} />
           </div>
           <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">श्रेणी</label>
                 <div className="relative">
                    <select className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl outline-none border dark:border-gray-700 font-bold dark:text-white text-xs appearance-none pl-11" value={category} onChange={e=>setCategory(e.target.value)}>
                       {eventCategories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">
                       <LucideIcon name={eventCategories.find((c:any)=>c.name===category)?.icon || 'Calendar'} size={18} />
                    </div>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">तारीख</label>
                 <input type="date" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl outline-none border dark:border-gray-700 font-bold dark:text-white text-xs" value={date} onChange={e=>setDate(e.target.value)} />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">स्थान</label>
              <input className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl outline-none border dark:border-gray-700 font-bold dark:text-white" placeholder="कहाँ मिलेगी मंडली?" value={location} onChange={e=>setLocation(e.target.value)} />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">नोट्स (विषय विवरण)</label>
              <textarea className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl outline-none border dark:border-gray-700 font-bold dark:text-white min-h-[100px]" placeholder="बैठक के मुख्य बिंदु..." value={notes} onChange={e=>setNotes(e.target.value)} />
           </div>
        </div>
        <button onClick={() => onSubmit({ title, date, location, notes, category })} className="w-full p-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 disabled:opacity-50" disabled={!title}>सुरक्षित करें</button>
      </div>
    </div>
  );
};

const VisitLogModal = ({ contactName, onClose, onSubmit }: any) => {
  const [notes, setNotes] = useState('');
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center p-6">
      <div className="bg-white dark:bg-gray-900 w-full rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
        <h2 className="text-xl font-black dark:text-white text-center">{contactName} - मुलाकात</h2>
        <textarea placeholder="मुलाकात के मुख्य बिंदु लिखें..." className="w-full p-5 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-3xl min-h-[160px] outline-none font-bold shadow-inner" value={notes} onChange={e=>setNotes(e.target.value)} />
        <div className="flex gap-3">
           <button onClick={onClose} className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 font-bold rounded-2xl active:scale-95">रद्द</button>
           <button disabled={!notes} onClick={()=>onSubmit(notes)} className="flex-1 p-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 disabled:opacity-50">दर्ज करें</button>
        </div>
      </div>
    </div>
  );
};

const ManageListMembersModal = ({ list, contacts, khands, mandals, villages, onClose, onSave }: any) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(list.peopleIds);
  const [search, setSearch] = useState('');
  const [khandFilter, setKhandFilter] = useState('all');
  const [mandalFilter, setMandalFilter] = useState('all');

  const filtered = contacts.filter((c: any) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchKhand = khandFilter === 'all' || c.khandId === khandFilter;
    const matchMandal = mandalFilter === 'all' || c.mandalId === mandalFilter;
    return matchSearch && matchKhand && matchMandal;
  });

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end">
      <div className="bg-white dark:bg-gray-900 w-full rounded-t-[3rem] p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar animate-in slide-in-from-bottom duration-300">
        <header className="flex justify-between items-center">
           <h2 className="text-xl font-black dark:text-white">सदस्य प्रबंधन: {list.name}</h2>
           <button onClick={onClose} className="text-gray-400 font-bold">रद्द</button>
        </header>

        <div className="space-y-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                placeholder="नाम या नंबर खोजें..." 
                className="w-full bg-gray-50 dark:bg-gray-800 p-3 pl-10 rounded-xl outline-none font-bold text-xs dark:text-white border dark:border-gray-700" 
                value={search} onChange={e=>setSearch(e.target.value)} 
              />
           </div>
           <div className="grid grid-cols-2 gap-2">
              <select value={khandFilter} onChange={e=>{setKhandFilter(e.target.value); setMandalFilter('all');}} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-bold dark:text-white border dark:border-gray-700 outline-none">
                <option value="all">सभी खंड</option>
                {khands.map((k:any)=><option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
              <select value={mandalFilter} disabled={khandFilter === 'all'} onChange={e=>setMandalFilter(e.target.value)} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-bold dark:text-white border dark:border-gray-700 outline-none disabled:opacity-50">
                <option value="all">सभी मंडल</option>
                {mandals.filter((m:any)=>m.khandId===khandFilter).map((m:any)=><option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
           </div>
        </div>

        <div className="space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar py-2">
           {filtered.map((c: any) => {
              const isSelected = selectedIds.includes(c.id);
              return (
                <button 
                  key={c.id} 
                  onClick={() => toggleSelection(c.id)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 border transition-all ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : 'bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700'}`}
                >
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black ${isSelected ? 'bg-blue-600' : 'bg-gray-400'}`}>{c.name[0]}</div>
                   <div className="flex-1 text-left">
                      <div className={`font-bold text-sm ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'dark:text-white'}`}>{c.name}</div>
                      <div className="text-[10px] text-gray-400">{villages.find((v:any)=>v.id===c.villageId)?.name}</div>
                   </div>
                   {isSelected && <CheckCircle2 size={18} className="text-blue-600"/>}
                </button>
              );
           })}
        </div>

        <div className="pt-4 flex gap-4">
           <button onClick={onClose} className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 dark:text-white font-bold rounded-2xl">रद्द</button>
           <button onClick={() => onSave(selectedIds)} className="flex-1 p-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg">चयनित ({selectedIds.length}) सुरक्षित करें</button>
        </div>
      </div>
    </div>
  );
};

// --- Calendar Tab Component ---
const CalendarTab = ({ 
  trips, 
  contacts, 
  meetings,
  khands, 
  mandals, 
  dashKhand, 
  dashMandal, 
  setDashKhand, 
  setDashMandal,
  onTripClick,
  onContactClick,
  setSelectedListId,
  setSelectedMeetingId,
  setActiveTab
}: any) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getEventIcon = (cat: string) => {
    const iconName = eventCategories.find(c => c.name === cat)?.icon;
    if (iconName) return <LucideIcon name={iconName} size={10} />;
    return <Rocket size={10} />;
  };

  const filteredTrips = trips.filter((t: any) => 
    (dashKhand === 'all' || t.khandId === dashKhand) && 
    (dashMandal === 'all' || t.mandalId === dashMandal)
  );

  const filteredMeetings = meetings.filter((m: any) => {
    // Meetings don't have khand/mandal directly, but they belong to a list.
    // For simplicity, we show all meetings or we could filter by list members' areas.
    // Let's just show all for now or check if any member matches filter.
    return true; 
  });

  const filteredVisits = contacts.flatMap((c: any) => 
    c.history.map((h: any) => ({ ...h, contactName: c.name, contactId: c.id, khandId: c.khandId, mandalId: c.mandalId }))
  ).filter((v: any) => 
    (dashKhand === 'all' || v.khandId === dashKhand) && 
    (dashMandal === 'all' || v.mandalId === dashMandal)
  );

  const getDayData = (day: Date) => {
    return {
      trips: filteredTrips.filter((t: any) => isSameDay(parseISO(t.date), day)),
      visits: filteredVisits.filter((v: any) => isSameDay(parseISO(v.date), day)),
      meetings: filteredMeetings.filter((m: any) => isSameDay(parseISO(m.date), day))
    };
  };

  const selectedData = getDayData(selectedDate);

  const weekDays = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  return (
    <div className="p-4 pb-24 space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-black dark:text-white">कैलेंडर</h1>
        <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border dark:border-gray-700">
           <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 dark:text-white active:bg-gray-100 dark:active:bg-gray-700 rounded-lg"><ArrowLeft size={16}/></button>
           <div className="px-4 py-2 font-bold text-xs dark:text-white flex items-center">{format(currentMonth, 'MMMM yyyy')}</div>
           <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 dark:text-white active:bg-gray-100 dark:active:bg-gray-700 rounded-lg"><ChevronRight size={16}/></button>
        </div>
      </header>

      {/* Area Filter */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border dark:border-gray-700 grid grid-cols-2 gap-2">
        <select value={dashKhand} onChange={(e) => { setDashKhand(e.target.value); setDashMandal('all'); }} className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 p-3 rounded-xl border dark:border-gray-700 font-bold text-[10px] outline-none">
          <option value="all">सभी खंड</option>
          {khands.map((k:any) => <option key={k.id} value={k.id}>{k.name}</option>)}
        </select>
        <select value={dashMandal} disabled={dashKhand === 'all'} onChange={(e) => setDashMandal(e.target.value)} className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 p-3 rounded-xl border dark:border-gray-700 font-bold text-[10px] outline-none disabled:opacity-50">
          <option value="all">सभी मंडल</option>
          {mandals.filter((m:any) => m.khandId === dashKhand).map((m:any) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </section>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-4 shadow-sm border dark:border-gray-700">
        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {weekDays.map(day => (
            <div key={day} className="text-[10px] font-black text-gray-400 py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const data = getDayData(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDay = isToday(day);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-90
                  ${!isCurrentMonth ? 'opacity-20' : 'opacity-100'}
                  ${isSelected ? 'bg-blue-600 text-white shadow-lg' : isTodayDay ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'}
                `}
              >
                <span className="text-xs font-bold">{format(day, 'd')}</span>
                <div className="flex gap-0.5 mt-1">
                  {data.meetings.length > 0 && (
                    <div className="flex gap-0.5">
                      {data.meetings.slice(0, 2).map((m: any) => (
                        <div key={m.id} className={`${isSelected ? 'text-white/80' : 'text-purple-500'}`}>{getEventIcon(m.category)}</div>
                      ))}
                    </div>
                  )}
                  {data.trips.length > 0 && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-orange-500'}`} />}
                  {data.visits.length > 0 && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/50' : 'bg-blue-400'}`} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-black dark:text-white px-1">
          {format(selectedDate, 'd MMMM')} का विवरण
        </h3>
        
        {selectedData.meetings.map((m: any) => (
          <div key={m.id} onClick={() => { setSelectedListId(m.listId); setSelectedMeetingId(m.id); setActiveTab('lists'); }} className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 p-4 rounded-3xl flex items-center gap-4 active:scale-95 transition-all">
             <div className="p-3 bg-purple-600 text-white rounded-2xl">
                {getEventIcon(m.category)}
             </div>
             <div className="flex-1">
                <div className="text-[10px] font-black text-purple-600 uppercase">कार्यक्रम</div>
                <div className="font-bold dark:text-white text-sm">{m.title}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">{m.category} • {m.location || 'कोई स्थान नहीं'}</div>
             </div>
             <ChevronRight size={18} className="text-purple-300" />
          </div>
        ))}

        {selectedData.trips.length === 0 && selectedData.visits.length === 0 && selectedData.meetings.length === 0 ? (
          <div className="p-8 text-center text-gray-400 font-bold bg-white dark:bg-gray-800 rounded-[2rem] border dark:border-gray-700">
            कोई गतिविधि नहीं
          </div>
        ) : (
          <>
            {selectedData.trips.map((trip: any) => (
              <div key={trip.id} onClick={() => onTripClick(trip)} className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 p-4 rounded-3xl flex items-center gap-4 active:scale-95 transition-all">
                <div className="p-3 bg-orange-600 text-white rounded-2xl"><CalendarIcon size={20}/></div>
                <div className="flex-1">
                  <div className="text-[10px] font-black text-orange-600 uppercase">यात्रा योजना</div>
                  <div className="font-bold dark:text-white text-sm">{mandals.find((m:any) => m.id === trip.mandalId)?.name} मंडल</div>
                </div>
                <ChevronRight size={18} className="text-orange-300" />
              </div>
            ))}
            {selectedData.visits.map((visit: any) => (
              <div key={visit.id} onClick={() => onContactClick(visit.contactId)} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-4 rounded-3xl flex items-center gap-4 active:scale-95 transition-all">
                <div className="p-3 bg-blue-600 text-white rounded-2xl"><User size={20}/></div>
                <div className="flex-1">
                  <div className="text-[10px] font-black text-blue-600 uppercase">मुलाकात: {visit.contactName}</div>
                  <div className="text-xs font-bold dark:text-gray-300 line-clamp-1">{visit.notes}</div>
                </div>
                <ChevronRight size={18} className="text-blue-300" />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default App;