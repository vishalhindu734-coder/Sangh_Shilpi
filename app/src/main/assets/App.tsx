import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, Users, Calendar, Settings, Plus, Phone, Search, 
  Moon, Sun, Trash2, Edit2, ArrowLeft, CheckCircle2, 
  ChevronRight, MapPin, UserPlus, History
} from 'lucide-react';
import { Status, Contact, Trip, VisitHistory } from './types';
import { INITIAL_CONTACTS, CATEGORIES } from './constants';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('fc_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('fc_contacts', JSON.stringify(contacts));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [contacts, darkMode]);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery) ||
    c.village.includes(searchQuery)
  );

  const handleAddContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newC: Contact = {
      id: Date.now().toString(),
      name: fd.get('name') as string,
      phone: fd.get('phone') as string,
      village: fd.get('village') as string,
      category: fd.get('category') as string,
      status: fd.get('status') as Status,
      history: []
    };
    setContacts([newC, ...contacts]);
    setShowAddForm(false);
  };

  const addVisitNote = (contactId: string) => {
    const note = prompt('मुलाकात की मुख्य बातें लिखें:');
    if (!note) return;
    const historyItem: VisitHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('hi-IN'),
      notes: note
    };
    setContacts(contacts.map(c => 
      c.id === contactId ? { ...c, history: [historyItem, ...c.history] } : c
    ));
    if (selectedContact?.id === contactId) {
      setSelectedContact(prev => prev ? { ...prev, history: [historyItem, ...prev.history] } : null);
    }
  };

  const deleteContact = (id: string) => {
    if (confirm('क्या आप इस संपर्क को हटाना चाहते हैं?')) {
      setContacts(contacts.filter(c => c.id !== id));
      setSelectedContact(null);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Top Header */}
      <header className="px-6 pt-12 pb-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-blue-900 dark:text-blue-400">फील्ड कनेक्ट</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">कार्यकर्ता मित्र</p>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-all">
          {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-blue-600" />}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
                <p className="text-[10px] font-black uppercase opacity-70">कुल संपर्क</p>
                <h2 className="text-3xl font-black mt-1">{contacts.length}</h2>
              </div>
              <div className="bg-orange-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-orange-500/20">
                <p className="text-[10px] font-black uppercase opacity-70">सक्रिय</p>
                <h2 className="text-3xl font-black mt-1">{contacts.filter(c => c.status === Status.SAKRIYA).length}</h2>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={() => setShowAddForm(true)} className="w-full bg-blue-900 dark:bg-blue-700 text-white p-5 rounded-3xl flex items-center justify-center gap-3 font-black shadow-lg active:scale-95 transition-all">
                <UserPlus size={24} /> नया संपर्क जोड़ें
              </button>
              <button onClick={() => setActiveTab('contacts')} className="w-full bg-white dark:bg-slate-900 p-5 rounded-3xl border dark:border-slate-800 flex justify-between items-center active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl"><Users /></div>
                  <div className="text-left font-black">सभी संपर्क देखें</div>
                </div>
                <ChevronRight className="text-slate-300" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="नाम या गाँव से खोजें..." 
                className="w-full bg-white dark:bg-slate-900 p-4 pl-12 rounded-2xl border dark:border-slate-800 outline-none font-bold dark:text-white shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-bold">कोई संपर्क नहीं मिला</div>
              ) : (
                filteredContacts.map(c => (
                  <div key={c.id} onClick={() => setSelectedContact(c)} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border dark:border-slate-800 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xl">{c.name[0]}</div>
                    <div className="flex-1">
                      <h4 className="font-bold dark:text-white">{c.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{c.village} • {c.category}</p>
                    </div>
                    <a href={`tel:${c.phone}`} onClick={e => e.stopPropagation()} className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl">
                      <Phone size={18} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black dark:text-white">सेटिंग्स</h2>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 overflow-hidden divide-y dark:divide-slate-800 shadow-sm">
              <div className="p-5 flex justify-between items-center">
                <div className="flex items-center gap-4 font-bold dark:text-white"><Moon size={20} className="text-blue-500"/> डार्क मोड</div>
                <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition-all relative ${darkMode ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full p-5 text-left text-red-500 font-bold flex items-center gap-4 active:bg-red-50 dark:active:bg-red-900/10">
                <Trash2 size={20} /> सारा डेटा मिटाएं
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t dark:border-slate-800 px-8 py-4 flex justify-between safe-bottom z-10">
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label="होम" />
        <NavBtn active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} icon={<Users />} label="संपर्क" />
        <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings />} label="सेटिंग" />
      </nav>

      {/* Modals & Overlays */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end">
          <form onSubmit={handleAddContact} className="w-full bg-white dark:bg-slate-900 rounded-t-[3rem] p-8 space-y-5 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black dark:text-white">नया संपर्क</h2>
              <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 font-bold">रद्द</button>
            </div>
            <input required name="name" placeholder="पूरा नाम" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white" />
            <input required name="phone" type="tel" placeholder="मोबाइल नंबर" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white" />
            <input required name="village" placeholder="गाँव / नगर" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white" />
            <div className="grid grid-cols-2 gap-3">
              <select name="category" className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select name="status" className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white">
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-lg">सुरक्षित करें</button>
          </form>
        </div>
      )}

      {selectedContact && (
        <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 z-[60] flex flex-col animate-in slide-in-from-right duration-300">
          <header className="px-6 pt-12 pb-4 flex items-center gap-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800">
            <button onClick={() => setSelectedContact(null)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl"><ArrowLeft size={20} className="dark:text-white"/></button>
            <h2 className="text-xl font-black dark:text-white">{selectedContact.name}</h2>
            <button onClick={() => deleteContact(selectedContact.id)} className="ml-auto p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-2xl"><Trash2 size={20}/></button>
          </header>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-24">
            <div className="text-center py-6">
              <div className="h-28 w-28 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-black mb-4 shadow-xl ring-4 ring-white dark:ring-slate-800">{selectedContact.name[0]}</div>
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{selectedContact.category}</p>
              <h3 className="text-2xl font-black dark:text-white mt-1">{selectedContact.name}</h3>
              <div className="flex justify-center gap-4 mt-6">
                <a href={`tel:${selectedContact.phone}`} className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-green-500 text-white rounded-[2rem] shadow-lg"><Phone size={24}/></div>
                  <span className="text-[10px] font-black uppercase">कॉल</span>
                </a>
                <button onClick={() => addVisitNote(selectedContact.id)} className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-blue-600 text-white rounded-[2rem] shadow-lg"><Plus size={24}/></div>
                  <span className="text-[10px] font-black uppercase">भेंट</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] space-y-4 border dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center"><span className="text-slate-400 font-bold text-xs">गाँव:</span><span className="font-black dark:text-white">{selectedContact.village}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-400 font-bold text-xs">स्थिति:</span><span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 font-bold rounded-full text-xs">{selectedContact.status}</span></div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-lg dark:text-white flex items-center gap-2"><History size={20} className="text-blue-600"/> मुलाकात इतिहास</h4>
              {selectedContact.history.length === 0 ? (
                <div className="p-10 text-center text-slate-400 font-bold border-2 border-dashed dark:border-slate-800 rounded-[2.5rem]">कोई इतिहास नहीं मिला</div>
              ) : (
                selectedContact.history.map(h => (
                  <div key={h.id} className="p-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-sm">
                    <p className="text-[10px] font-black text-blue-600 mb-1 uppercase tracking-tighter">{h.date}</p>
                    <p className="text-sm font-bold dark:text-slate-300">"{h.notes}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
    {React.cloneElement(icon, { size: active ? 24 : 20, strokeWidth: active ? 3 : 2 })}
    <span className={`text-[8px] font-black uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export default App;