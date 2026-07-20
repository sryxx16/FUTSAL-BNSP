"use client";
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSemuaReservasi } from '../../lib/db';

interface AdminHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminHeader({ activeTab, setActiveTab }: AdminHeaderProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifList, setNotifList] = useState<any[]>([]);

  useEffect(() => {
    async function loadNotif() {
      try {
        const res = await getSemuaReservasi();
        const pending = res.filter((r: any) => r.status === 'Menunggu Pembayaran' || r.status === 'Menunggu');
        setNotifList(pending.slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    }
    loadNotif();
    const interval = setInterval(loadNotif, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="print:hidden h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-900 capitalize">
          {activeTab.replace('-', ' ')}
        </h1>
        {activeTab === 'dashboard' && (
          <span className="text-slate-500 font-medium hidden sm:inline">
            Selamat datang kembali, Admin 👋
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-6 relative">
        <button 
          onClick={() => setShowNotif(!showNotif)}
          className="relative text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-50"
        >
          <Bell size={20} />
          {notifList.length > 0 && (
             <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        {showNotif && (
          <div className="absolute top-12 right-0 w-80 bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm">Notifikasi</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifList.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  Tidak ada notifikasi baru.
                </div>
              ) : (
                notifList.map((notif, idx) => (
                  <div key={idx} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setActiveTab('reservations'); setShowNotif(false); }}>
                    <p className="text-sm font-semibold text-emerald-600 mb-1">Pemesanan Baru!</p>
                    <p className="text-xs text-slate-600">
                      <span className="font-bold text-slate-900">{notif.pelanggan_nama}</span> membooking {notif.lapangan_nama} pada {new Date(notif.tanggal).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-[10px] text-orange-500 mt-2 font-bold">{notif.status}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 bg-slate-50 text-center border-t border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => { setActiveTab('reservations'); setShowNotif(false); }}>
              <span className="text-xs font-bold text-emerald-600">Lihat Semua Reservasi</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
