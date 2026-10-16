"use client";
import { LayoutDashboard, CalendarDays, Users, Settings, LogOut, BarChart3, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSemuaReservasi } from '../../lib/db';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    async function fetchPending() {
      try {
        const res = await getSemuaReservasi();
        const pending = res.filter((r: any) => r.status === 'Menunggu Pembayaran' || r.status === 'Menunggu');
        setPendingCount(pending.length);
      } catch (e) {
        // ignore
      }
    }
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari panel admin?')) {
      localStorage.removeItem('sm_session');
      window.location.href = '/login';
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'reservations', icon: CalendarDays, label: 'Reservasi', badge: pendingCount > 0 ? pendingCount : null },
    { id: 'users', icon: Users, label: 'Pelanggan' },
    { id: 'reports', icon: BarChart3, label: 'Laporan' },
    { id: 'settings', icon: Settings, label: 'Pengaturan' },
  ];

  return (
    <aside className="print:hidden w-64 bg-white border-r border-slate-200/80 hidden md:flex flex-col justify-between select-none shrink-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 pb-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-base shadow-sm shadow-emerald-500/20">
              SM
            </div>
            <div>
              <div className="font-bold text-slate-900 leading-none text-base tracking-tight">
                SM Sport <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 ml-1">ADMIN</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Management Center</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-5">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            Menu Utama
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-600 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50/80 border border-slate-200/70 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              AD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate leading-tight">Admin SM Sport</span>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <ShieldCheck size={12} /> Administrator
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
