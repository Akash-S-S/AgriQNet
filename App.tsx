
import React, { useState } from 'react';
import { LayoutDashboard, Sprout, FlaskConical, Bug, MessageCircle, Menu, X, Leaf, Globe } from 'lucide-react';
import { NavView, Language } from './types';
import { TRANSLATIONS, LANGUAGES } from './utils/translations';
import Dashboard from './components/Dashboard';
import CropAdvisor from './components/CropAdvisor';
import FertilizerAdvisor from './components/FertilizerAdvisor';
import PestControl from './components/PestControl';
import ChatModule from './components/ChatModule';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [activeLang, setActiveLang] = useState<Language>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = TRANSLATIONS[activeLang];

  const navItems: {id: NavView, label: string, icon: any}[] = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'crops', label: t.cropAdvisor, icon: Sprout },
    { id: 'fertilizer', label: t.fertilizers, icon: FlaskConical },
    { id: 'pests', label: t.pestControl, icon: Bug },
    { id: 'chat', label: t.chat, icon: MessageCircle },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard lang={activeLang} />;
      case 'crops': return <CropAdvisor lang={activeLang} />;
      case 'fertilizer': return <FertilizerAdvisor lang={activeLang} />;
      case 'pests': return <PestControl lang={activeLang} />;
      case 'chat': return <ChatModule lang={activeLang} />;
      default: return <Dashboard lang={activeLang} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 h-screen sticky top-0 p-6 z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-agri-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-agri-200">
            <Leaf size={24} />
          </div>
          <span className="text-2xl font-bold text-agri-900 tracking-tight">AgriQNet</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                activeView === item.id 
                  ? 'bg-agri-50 text-agri-700 font-bold shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={22} className={`transition-colors ${activeView === item.id ? 'text-agri-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-30 px-6 py-4 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-agri-600 rounded-lg flex items-center justify-center text-white">
              <Leaf size={18} />
            </div>
            <span className="text-xl font-bold text-agri-900">AgriQNet</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
           {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-white pt-20 px-6 animate-in slide-in-from-top-10 duration-200">
           <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-lg ${
                  activeView === item.id 
                    ? 'bg-agri-50 text-agri-700 font-bold' 
                    : 'text-gray-600'
                }`}
              >
                <item.icon size={24} className={activeView === item.id ? 'text-agri-600' : 'text-gray-400'} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-6 mt-16 lg:mt-0 overflow-x-hidden">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
           <div>
             <h1 className="text-2xl font-bold text-gray-900">{navItems.find(n => n.id === activeView)?.label}</h1>
             <p className="text-gray-500 text-sm mt-1">Smart agricultural insights powered by Gemini AI</p>
           </div>
           
           {/* Language Selector */}
           <div className="relative">
             <button 
               onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
               className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:border-agri-400 hover:text-agri-700 transition-colors shadow-sm"
             >
               <Globe size={18} />
               <span className="font-medium text-sm">{LANGUAGES[activeLang]}</span>
             </button>
             
             {isLangMenuOpen && (
               <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-40 animate-in fade-in zoom-in-95 duration-200">
                 {(Object.keys(LANGUAGES) as Language[]).map((code) => (
                   <button
                     key={code}
                     onClick={() => {
                       setActiveLang(code);
                       setIsLangMenuOpen(false);
                     }}
                     className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                       activeLang === code 
                         ? 'bg-agri-50 text-agri-700' 
                         : 'text-gray-600 hover:bg-gray-50'
                     }`}
                   >
                     {LANGUAGES[code]}
                   </button>
                 ))}
               </div>
             )}
           </div>
        </header>

        <div className="min-h-[500px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
