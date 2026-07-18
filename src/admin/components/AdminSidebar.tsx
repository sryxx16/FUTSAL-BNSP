import { LayoutDashboard, CalendarDays, Users, Settings, LogOut, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <aside className="print:hidden w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
          Admin Panel
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'reservations', icon: CalendarDays, label: 'Data Reservasi' },
          { id: 'users', icon: Users, label: 'Pelanggan' },
          { id: 'reports', icon: BarChart3, label: 'Laporan Keuangan' },
          { id: 'settings', icon: Settings, label: 'Pengaturan' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all duration-300">
          <LogOut size={20} />
          Kembali ke Web
        </Link>
      </div>
    </aside>
  );
}
