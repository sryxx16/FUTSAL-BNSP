import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSemuaReservasi } from '../../lib/db';

interface AdminHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminHeader({ activeTab, setActiveTab }: AdminHeaderProps) {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [notifList, setNotifList] = useState<any[]>([]);

  useEffect(() => {
    async function loadNotif() {
      try {
        const res = await getSemuaReservasi();
        // Ambil yang statusnya Menunggu Pembayaran
        const pending = res.filter((r: any) => r.status === 'Menunggu Pembayaran' || r.status === 'Menunggu');
        setNotifList(pending.slice(0, 5)); // Ambil 5 teratas
      } catch (e) {
        console.error(e);
      }
    }
    loadNotif();
    
    // Polling setiap 30 detik
    const interval = setInterval(loadNotif, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sm_session');
    navigate('/');
  };

  return (
    <header className="print:hidden h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
      <h1 className="text-xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
      
      <div className="flex items-center gap-6 relative">
        <button 
          onClick={() => setShowNotif(!showNotif)}
          className="relative text-slate-400 hover:text-white transition-colors"
        >
          <Bell size={20} />
          {notifList.length > 0 && (
             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
          )}
        </button>

        {/* Dropdown Notifikasi */}
        {showNotif && (
          <div className="absolute top-12 right-16 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/50">
              <h3 className="font-bold text-white text-sm">Notifikasi</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifList.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  Tidak ada notifikasi baru.
                </div>
              ) : (
                notifList.map((notif, idx) => (
                  <div key={idx} className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => { setActiveTab('reservations'); setShowNotif(false); }}>
                    <p className="text-sm font-medium text-emerald-400 mb-1">Pemesanan Baru!</p>
                    <p className="text-xs text-slate-300">
                      <span className="font-bold text-white">{notif.pelanggan_nama}</span> membooking {notif.lapangan_nama} pada {new Date(notif.tanggal).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-[10px] text-yellow-400 mt-2 font-bold">{notif.status}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 bg-slate-950/50 text-center border-t border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => { setActiveTab('reservations'); setShowNotif(false); }}>
              <span className="text-xs font-bold text-blue-400">Lihat Semua Reservasi</span>
            </div>
          </div>
        )}

        <button 
          onClick={() => setActiveTab('settings')}
          className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-2 border-slate-800 overflow-hidden flex items-center justify-center font-bold text-slate-900 mr-2 hover:opacity-80 transition-opacity cursor-pointer"
          title="Ke Pengaturan"
        >
            AD
        </button>
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
