"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRiwayatBooking } from '../../src/lib/db';
import { Calendar, Clock, History, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem('sm_session') : null;
    if (!sessionStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(sessionStr);

    async function loadData() {
      try {
        const data = await getRiwayatBooking(user.id);
        setBookings(data);
      } catch (err) {
        console.error("Gagal memuat riwayat:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/30';
      case 'Sudah DP 50%': return 'text-blue-400 bg-blue-400/10 border-blue-500/30';
      case 'Menunggu Pembayaran': return 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30';
      case 'Dibatalkan': return 'text-red-400 bg-red-400/10 border-red-500/30';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-500/30';
    }
  };

  const formatTanggal = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const hitungTotalHarga = (jamMulai: string, jamSelesai: string, hargaPerJam: number) => {
    if (!jamMulai || !jamSelesai) return hargaPerJam;
    const [h1, m1] = jamMulai.split(':').map(Number);
    const [h2, m2] = jamSelesai.split(':').map(Number);
    const totalMenit = (h2 * 60 + m2) - (h1 * 60 + m1);
    return (totalMenit / 60) * hargaPerJam;
  };

  return (
    <main className="pt-24 pb-12 min-h-screen relative overflow-hidden bg-slate-950">
      <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-emerald-700/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-4">
              <ArrowLeft size={20} /> Kembali ke Beranda
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <History className="text-emerald-500" /> Riwayat Pemesanan Saya
            </h1>
          </div>
          <Link href="/book" className="hidden sm:inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors shadow-sm shadow-emerald-600/30 text-sm">
            + Booking Baru
          </Link>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 size={40} className="animate-spin mb-4 text-emerald-500" />
              <p>Memuat riwayat pemesanan Anda...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center">
              <History size={48} className="mb-4 opacity-50" />
              <p className="text-lg mb-6">Anda belum pernah melakukan pemesanan lapangan.</p>
              <Link href="/book" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors text-sm shadow-sm shadow-emerald-600/30">
                Mulai Booking Sekarang
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {bookings.map((booking, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={booking.id} 
                  className="p-6 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                      {booking.lapangan_nama}
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-slate-400 mt-2">
                      <span className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-500" /> {formatTanggal(booking.tanggal)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-500" /> {booking.jam_mulai.substring(0, 5)} - {booking.jam_selesai.substring(0, 5)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto mt-2 sm:mt-0">
                    <p className="text-sm text-slate-500 mb-1">Total Biaya</p>
                    <p className="text-emerald-400 font-bold text-lg mb-2">
                      Rp {hitungTotalHarga(booking.jam_mulai, booking.jam_selesai, booking.harga_per_jam).toLocaleString('id-ID')}
                    </p>
                    {booking.status === 'Menunggu Pembayaran' && (
                      <button 
                        onClick={() => router.push(`/checkout/${booking.id}`)}
                        className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 justify-center w-full shadow-sm shadow-emerald-600/30"
                      >
                        <span>Bayar DP Sekarang</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
