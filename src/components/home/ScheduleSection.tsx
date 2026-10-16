"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle2, ArrowRight, Sparkles, Filter } from 'lucide-react';
import Link from 'next/link';
import { getJadwalHariIni, getDaftarLapangan } from '../../lib/db';

interface CourtData {
  id: number;
  nama: string;
  jenis: string;
  harga_per_jam: number;
}

interface ScheduleSlot {
  lapangan_id: number;
  lapangan_nama: string;
  tanggal_main: string | null;
  jam_mulai: string | null;
  jam_selesai: string | null;
}

export default function ScheduleSection() {
  const [courts, setCourts] = useState<CourtData[]>([]);
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Format today as YYYY-MM-DD local
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getRelativeDateStr = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [activeFilter, setActiveFilter] = useState<'all' | 'futsal' | 'badminton'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [courtData, scheduleData] = await Promise.all([
          getDaftarLapangan(),
          getJadwalHariIni()
        ]);
        setCourts(courtData as CourtData[]);
        setSchedules(scheduleData as ScheduleSlot[]);
      } catch (error) {
        console.error("Gagal memuat jadwal:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter courts by active tab
  const filteredCourts = courts.filter(court => {
    if (activeFilter === 'futsal') return court.nama.toLowerCase().includes('futsal');
    if (activeFilter === 'badminton') return court.nama.toLowerCase().includes('badminton');
    return true;
  });

  // Get booked slots for a court on selectedDate
  const getBookedSlotsForCourt = (courtId: number) => {
    return schedules
      .filter(s => {
        if (s.lapangan_id !== courtId || !s.jam_mulai || !s.jam_selesai || !s.tanggal_main) return false;
        const tglObj = new Date(s.tanggal_main);
        const year = tglObj.getFullYear();
        const month = String(tglObj.getMonth() + 1).padStart(2, '0');
        const day = String(tglObj.getDate()).padStart(2, '0');
        const localDateStr = `${year}-${month}-${day}`;
        return localDateStr === selectedDate;
      })
      .map(s => `${s.jam_mulai?.substring(0, 5)} - ${s.jam_selesai?.substring(0, 5)}`);
  };

  const todayStr = getTodayStr();
  const tomorrowStr = getRelativeDateStr(1);
  const dayAfterStr = getRelativeDateStr(2);

  const formattedSelectedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <section id="jadwal" className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE AVAILABILITY BOARD
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Papan Jadwal & <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Ketersediaan Lapangan</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl"
          >
            Cek slot jam kosong secara real-time. Pilih tanggal bermain dan langsung amankan jadwal tanding tim Anda.
          </motion.p>
        </div>

        {/* Filter & Date Selector Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-4 sm:p-5 mb-10 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Sport Category Tabs */}
            <div className="flex items-center p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 w-full sm:w-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeFilter === 'all'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua ({courts.length})
              </button>
              <button
                onClick={() => setActiveFilter('futsal')}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeFilter === 'futsal'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚽ Futsal ({courts.filter(c => c.nama.toLowerCase().includes('futsal')).length})
              </button>
              <button
                onClick={() => setActiveFilter('badminton')}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeFilter === 'badminton'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏸 Badminton ({courts.filter(c => c.nama.toLowerCase().includes('badminton')).length})
              </button>
            </div>

            {/* Quick Date Chips & Custom Date Picker */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
              <button
                onClick={() => setSelectedDate(todayStr)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedDate === todayStr
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                Hari Ini
              </button>
              <button
                onClick={() => setSelectedDate(tomorrowStr)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedDate === tomorrowStr
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                Besok
              </button>
              <button
                onClick={() => setSelectedDate(dayAfterStr)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedDate === dayAfterStr
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                Lusa
              </button>

              {/* Native Date Picker Pill */}
              <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800/90 rounded-xl px-3.5 py-1.5 focus-within:border-emerald-500/50 transition-colors">
                <Calendar size={16} className="text-emerald-400 shrink-0" />
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={todayStr}
                  className="bg-transparent text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                />
              </div>
            </div>
          </div>

          {/* Current Date Indicator */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-400" />
              Menampilkan ketersediaan: <strong className="text-slate-200">{formattedSelectedDate}</strong>
            </span>
            <span className="hidden sm:inline-block text-slate-400">
              Jam Operasional: 08:00 - 24:00 WIB
            </span>
          </div>
        </motion.div>

        {/* Schedule Cards Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-slate-400 text-sm">Sinkronisasi jadwal terbaru...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court, idx) => {
              const bookedSlots = getBookedSlotsForCourt(court.id);
              const isFutsal = court.nama.toLowerCase().includes('futsal');
              const isFullyAvailable = bookedSlots.length === 0;

              return (
                <motion.div
                  key={court.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] flex flex-col justify-between"
                >
                  <div>
                    {/* Court Header: Badge & Price */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg border ${
                          isFutsal 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                        }`}>
                          {isFutsal ? '⚽' : '🏸'}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {court.nama}
                          </h3>
                          <span className="text-xs text-slate-400">
                            {isFutsal ? 'Interlock Vinyl FIFA' : 'Karpet Li-Ning BWF'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-emerald-400">
                          Rp {court.harga_per_jam.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[11px] text-slate-400">/ jam</div>
                      </div>
                    </div>

                    {/* Court Availability Status */}
                    <div className="mb-5">
                      {isFullyAvailable ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
                          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-emerald-300">Tersedia Sepanjang Hari</div>
                            <div className="text-xs text-slate-400">Semua slot jam (08:00 - 24:00) masih kosong</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs text-slate-300">
                            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                              <AlertCircle size={14} /> {bookedSlots.length} Jam Sudah Dipesan
                            </span>
                            <span className="text-emerald-400 font-medium">Slot lain masih buka</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {bookedSlots.map((slot, sIdx) => (
                              <span 
                                key={sIdx} 
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-semibold"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Operational Time Overview */}
                    <div className="grid grid-cols-3 gap-2 pt-2 pb-5 border-t border-slate-800/70 text-center">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="text-[11px] text-slate-400">Pagi</div>
                        <div className="text-xs font-semibold text-slate-200 mt-0.5">08:00-12:00</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="text-[11px] text-slate-400">Siang</div>
                        <div className="text-xs font-semibold text-slate-200 mt-0.5">12:00-17:00</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="text-[11px] text-slate-400">Malam</div>
                        <div className="text-xs font-semibold text-slate-200 mt-0.5">17:00-24:00</div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action Button */}
                  <Link
                    href={`/book?court=${court.id}&date=${selectedDate}`}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-500 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm"
                  >
                    <span>Pilih Jam & Pesan Lapangan</span>
                    <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
