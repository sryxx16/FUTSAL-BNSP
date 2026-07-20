"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { getJadwalHariIni } from '../../lib/db';

interface ScheduleSlot {
  lapangan_id: number;
  lapangan_nama: string;
  jam_mulai: string | null;
  jam_selesai: string | null;
}

export default function ScheduleSection() {
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedules() {
      try {
        const data = await getJadwalHariIni();
        setSchedules(data as ScheduleSlot[]);
      } catch (error) {
        console.error("Gagal memuat jadwal hari ini:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSchedules();
  }, []);

  // Kelompokkan jadwal berdasarkan ID Lapangan
  const groupedSchedules = schedules.reduce((acc, curr) => {
    if (!acc[curr.lapangan_id]) {
      acc[curr.lapangan_id] = {
        nama: curr.lapangan_nama,
        bookedSlots: []
      };
    }
    if (curr.jam_mulai && curr.jam_selesai) {
      // Format jam dari "09:00:00" menjadi "09:00"
      const formatJam = (time: string) => time.substring(0, 5);
      acc[curr.lapangan_id].bookedSlots.push(`${formatJam(curr.jam_mulai)} - ${formatJam(curr.jam_selesai)}`);
    }
    return acc;
  }, {} as Record<number, { nama: string, bookedSlots: string[] }>);

  // Daftar Lapangan
  const courts = Object.values(groupedSchedules);

  const today = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <section className="py-24 relative z-10 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            Papan Jadwal Live
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg flex items-center justify-center gap-2"
          >
            <Calendar size={20} className="text-emerald-500" /> Ketersediaan Lapangan Hari Ini: <span className="text-emerald-400 font-semibold">{today}</span>
          </motion.p>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">Memuat jadwal...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courts.map((court, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                  {court.nama}
                </h3>
                
                <div className="space-y-3">
                  {court.bookedSlots.length === 0 ? (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-3 rounded-lg border border-emerald-500/20">
                      <Clock size={18} />
                      <span className="text-sm font-medium">Tersedia Sepanjang Hari</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-400 mb-2">Jam Ter-booking:</p>
                      <div className="flex flex-wrap gap-2">
                        {court.bookedSlots.map((slot, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-3 py-1.5 rounded-md border border-red-500/20 text-sm">
                            <AlertCircle size={14} />
                            <span className="font-medium line-through decoration-red-500/50">{slot}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
