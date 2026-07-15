import { Search, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  activeTab: string;
}

export default function AdminHeader({ activeTab }: AdminHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('sm_session');
    navigate('/');
  };

  return (
    <header className="print:hidden h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
      <h1 className="text-xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Cari sesuatu..." 
            className="bg-slate-950 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-64 transition-all"
          />
        </div>
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-2 border-slate-800 overflow-hidden flex items-center justify-center font-bold text-slate-900 mr-2">
            AD
        </div>
        <button 
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-full flex items-center gap-2"
          title="Logout"
        >
          <LogOut size={20} />
          <span className="hidden md:inline text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}
