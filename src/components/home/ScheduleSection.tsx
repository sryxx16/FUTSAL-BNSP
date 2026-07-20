"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { getJadwalHariIni } from '../../lib/db';

interface ScheduleSlot {
  lapangan_id: number;
  lapangan_nama: string;
  tanggal_main: string | null;
  jam_mulai: string | null;
  jam_selesai: string | null;
}

export default function ScheduleSection() {
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
  // Kelompokkan jadwal berdasarkan ID Lapangan dan filter berdasarkan selectedDate
  const groupedSchedules = schedules.reduce((acc, curr) => {
    if (!acc[curr.lapangan_id]) {
      acc[curr.lapangan_id] = {
        nama: curr.lapangan_nama,
        bookedSlots: []
      };
    }
    if (curr.jam_mulai && curr.jam_selesai && curr.tanggal_main) {
      const tglObj = new Date(curr.tanggal_main);
      // local time YYYY-MM-DD
      const year = tglObj.getFullYear();
      const month = String(tglObj.getMonth() + 1).padStart(2, '0');
      const day = String(tglObj.getDate()).padStart(2, '0');
      const localDateStr = `${year}-${month}-${day}`;
      
      if (localDateStr === selectedDate) {
        const formatJam = (time: string) => time.substring(0, 5);
        acc[curr.lapangan_id].bookedSlots.push(`${formatJam(curr.jam_mulai)} - ${formatJam(curr.jam_selesai)}`);
      }
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
            className="text-slate-400 text-lg flex flex-col items-center justify-center gap-2"
          >
            <span className="flex items-center gap-2 text-white">
              <Calendar size={20} className="text-emerald-500" /> Ketersediaan Lapangan
            </span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex justify-center"
          >
             <div className="bg-slate-900 border border-slate-800 rounded-full px-6 py-2 flex items-center gap-4">
               <span className="text-slate-400 text-sm">Pilih Tanggal:</span>
               <input 
                 type="date"
                 value={selectedDate}
                 onChange={(e) => setSelectedDate(e.target.value)}
                 min={new Date().toISOString().split('T')[0]}
                 className="bg-transparent text-emerald-400 font-bold focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
               />
             </div>
          </motion.div>
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
