"use client";
import { Bell, ExternalLink, CalendarClock, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSemuaReservasi } from '../../lib/db';
import Link from 'next/link';

interface AdminHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard Ringkasan',
    subtitle: 'Ikhtisar aktivitas dan kinerja operasional SM Sport',
  },
  reservations: {
    title: 'Manajemen Reservasi',
    subtitle: 'Kelola jadwal booking lapangan, status pelunasan, dan reservasi manual',
  },
  users: {
    title: 'Data Pelanggan',
    subtitle: 'Daftar member terdaftar dan riwayat pemesanan pelanggan',
  },
  reports: {
    title: 'Laporan & Rekap Keuangan',
    subtitle: 'Analisis pendapatan harian, bulanan, dan performa lapangan',
  },
  settings: {
    title: 'Pengaturan Sistem',
    subtitle: 'Konfigurasi tarif sewa lapangan dan profil administrator',
  },
};

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

  const currentTab = tabTitles[activeTab] || {
    title: activeTab.replace('-', ' '),
    subtitle: 'Panel Administrasi SM Sport',
  };

  return (
    <header className="print:hidden h-20 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 md:px-8 shrink-0 z-20">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {currentTab.title}
        </h1>
        <p className="text-xs text-slate-500 font-normal hidden sm:block mt-0.5">
          {currentTab.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 md:gap-4 relative">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-lg transition-all"
        >
          <span>Buka Website</span>
          <ExternalLink size={13} />
        </Link>

        {/* Notifikasi Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className={`relative p-2.5 rounded-xl border transition-all ${
              showNotif
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
            }`}
            title="Notifikasi Booking"
          >
            <Bell size={18} />
            {notifList.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {notifList.length}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute top-12 right-0 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">Notifikasi Masuk</span>
                  {notifList.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      {notifList.length} pending
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">Pembaruan Real-time</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifList.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                    <p className="text-sm font-medium text-slate-700">Semua Beres!</p>
                    <p className="text-xs text-slate-400 mt-0.5">Tidak ada reservasi yang menunggu konfirmasi saat ini.</p>
                  </div>
                ) : (
                  notifList.map((notif, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => {
                        setActiveTab('reservations');
                        setShowNotif(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                          <CalendarClock size={14} />
                          <span>Pemesanan Baru</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                          {notif.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                        <strong className="text-slate-900 font-semibold">{notif.pelanggan_nama}</strong> memesan{' '}
                        <span className="font-medium text-slate-800">{notif.lapangan_nama}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Jadwal: {new Date(notif.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {notif.jam_mulai?.substring(0, 5)} - {notif.jam_selesai?.substring(0, 5)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div
                className="p-3 bg-slate-50 text-center border-t border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => {
                  setActiveTab('reservations');
                  setShowNotif(false);
                }}
              >
                <span className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                  Lihat Semua di Menu Reservasi →
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
