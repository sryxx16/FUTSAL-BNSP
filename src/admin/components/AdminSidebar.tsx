"use client";
import { LayoutDashboard, CalendarDays, Users, Settings, LogOut, BarChart3, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('sm_session');
    router.push('/');
  };

  return (
    <aside className="print:hidden w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <span className="text-2xl font-bold tracking-tight">
          <span className="text-emerald-600">SM</span> <span className="text-slate-900">Sport</span>
        </span>
        <button className="text-slate-400 hover:text-slate-600">
          <Menu size={20} />
        </button>
      </div>
      
      <div className="px-6 pb-2">
        <span className="text-[11px] font-bold text-slate-400 tracking-wider">MENU</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'reservations', icon: CalendarDays, label: 'Reservasi' },
          { id: 'users', icon: Users, label: 'Pelanggan' },
          { id: 'reports', icon: BarChart3, label: 'Laporan' },
          { id: 'settings', icon: Settings, label: 'Pengaturan' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === item.id 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? "text-emerald-600" : "text-slate-400"} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all font-medium"
        >
          <LogOut size={20} className="text-slate-400" />
          Keluar
        </button>
      </div>

      <div className="p-4 m-4 border border-slate-200 rounded-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shrink-0">
          AD
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 leading-tight">Admin</span>
          <span className="text-xs text-slate-500">Administrator</span>
        </div>
      </div>
    </aside>
  );
}
