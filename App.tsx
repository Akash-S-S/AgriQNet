import React, { useState } from 'react';
import { LayoutDashboard, Sprout, FlaskConical, Bug, MessageCircle, Menu, X, Leaf } from 'lucide-react';
import { NavView } from './types';
import Dashboard from './components/Dashboard';
import CropAdvisor from './components/CropAdvisor';
import FertilizerAdvisor from './components/FertilizerAdvisor';
import PestControl from './components/PestControl';
import ChatModule from './components/ChatModule';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: {id: NavView, label: string, icon: any}[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crops', label: 'Crop Advisor', icon: Sprout },
    { id: 'fertilizer', label: 'Fertilizers', icon: FlaskConical },
    { id: 'pests', label: 'Pest Control', icon: Bug },
    { id: 'chat', label: 'Agri-Chat', icon: MessageCircle },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'crops': return <CropAdvisor />;
      case 'fertilizer': return <FertilizerAdvisor />;
      case 'pests': return <PestControl />;
      case 'chat': return <ChatModule />;
      default: return <Dashboard />;
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

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="bg-gradient-to-br from-agri-500 to-agri-700 rounded-2xl p-4 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
             <p className="text-sm font-medium relative z-10 mb-2">Upgrade to Pro</p>
             <p className="text-xs text-agri-100 relative z-10 mb-3">Get advanced soil analytics & drone integration.</p>
             <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg text-xs font-bold transition-colors">Learn More</button>
          </div>
        </div>
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
        </header>

        <div className="min-h-[500px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;