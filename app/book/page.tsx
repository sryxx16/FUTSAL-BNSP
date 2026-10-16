"use client";
import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { getDaftarLapangan, buatReservasiDB } from '../../src/lib/db';
import { 
  Calendar, Clock, User, AlertCircle, CheckCircle2, 
  Loader2, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Check
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface CourtData {
  id: number;
  nama: string;
  jenis: string;
  harga_per_jam: number;
}

function ReservationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [lapanganList, setLapanganList] = useState<CourtData[]>([]);
  
  const sessionStr = typeof window !== 'undefined' ? localStorage.getItem('sm_session') : null;
  const user = sessionStr ? JSON.parse(sessionStr) : null;

  // Format today as YYYY-MM-DD
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

  const todayStr = getTodayStr();
  const initialCourtParam = searchParams.get('court');
  const initialDateParam = searchParams.get('date');

  const [formData, setFormData] = useState({
    lapangan_id: initialCourtParam || '',
    pelanggan_nama: user ? (user.role === 'admin' ? 'ADMIN' : user.nama) : '',
    tanggal: initialDateParam || todayStr,
    jam_mulai: '',
    jam_selesai: ''
  });
  
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'error' | 'success', message: string }>({ 
    type: 'idle', 
    message: '' 
  });

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    async function loadLapangan() {
      try {
        const data = await getDaftarLapangan();
        setLapanganList(data as CourtData[]);
        
        // If no pre-selected court from query param, default to first court
        if (data.length > 0 && !formData.lapangan_id) {
          setFormData(prev => ({ ...prev, lapangan_id: data[0].id.toString() }));
        }
      } catch (err) {
        console.error("Gagal memuat lapangan:", err);
      }
    }
    loadLapangan();
  }, []);

  const timeSlots: string[] = [];
  for (let i = 8; i <= 23; i++) {
    timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
  }

  // Selected court object
  const selectedCourt = lapanganList.find(c => c.id.toString() === formData.lapangan_id) || lapanganList[0];

  // Duration calculation
  let durationHours = 0;
  if (formData.jam_mulai && formData.jam_selesai) {
    const startHour = parseInt(formData.jam_mulai.split(':')[0]);
    const endHour = parseInt(formData.jam_selesai.split(':')[0]);
    if (endHour > startHour) {
      durationHours = endHour - startHour;
    }
  }

  const hargaPerJam = selectedCourt ? selectedCourt.harga_per_jam : 0;
  const totalBiaya = durationHours * hargaPerJam;
  const nominalDP = totalBiaya * 0.5;
  const sisaPelunasan = totalBiaya - nominalDP;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.type !== 'loading') setStatus({ type: 'idle', message: '' });
  };

  const handleSelectCourt = (courtId: number) => {
    setFormData(prev => ({ ...prev, lapangan_id: courtId.toString() }));
    if (status.type !== 'loading') setStatus({ type: 'idle', message: '' });
  };

  const handleQuickDuration = (hours: number) => {
    if (!formData.jam_mulai) {
      // Default start at 18:00 if not chosen yet
      const start = '18:00';
      const endHour = Math.min(23, 18 + hours);
      const end = `${endHour.toString().padStart(2, '0')}:00`;
      setFormData(prev => ({ ...prev, jam_mulai: start, jam_selesai: end }));
    } else {
      const startHour = parseInt(formData.jam_mulai.split(':')[0]);
      const endHour = Math.min(23, startHour + hours);
      const end = `${endHour.toString().padStart(2, '0')}:00`;
      setFormData(prev => ({ ...prev, jam_selesai: end }));
    }
    if (status.type !== 'loading') setStatus({ type: 'idle', message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.lapangan_id) {
      setStatus({ type: 'error', message: 'Harap pilih lapangan terlebih dahulu.' });
      return;
    }

    if (!formData.tanggal) {
      setStatus({ type: 'error', message: 'Harap tentukan tanggal bermain.' });
      return;
    }

    if (!formData.jam_mulai || !formData.jam_selesai) {
      setStatus({ type: 'error', message: 'Harap tentukan jam mulai dan jam selesai.' });
      return;
    }

    if (formData.jam_mulai >= formData.jam_selesai) {
      setStatus({ type: 'error', message: 'Waktu mulai harus lebih awal dari waktu selesai.' });
      return;
    }

    if (formData.jam_mulai < "08:00" || formData.jam_selesai > "23:00") {
      setStatus({ type: 'error', message: 'Jam operasional kami dari 08:00 hingga 23:00 WIB.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Memeriksa ketersediaan dan memproses reservasi...' });

    try {
      const result = await buatReservasiDB(
        formData.pelanggan_nama, 
        parseInt(formData.lapangan_id), 
        formData.tanggal, 
        formData.jam_mulai, 
        formData.jam_selesai
      );
      
      if (!result.success) {
        setStatus({ type: 'error', message: result.error || 'Jadwal bentrok atau gagal menyimpan reservasi.' });
        return;
      }
      
      setStatus({ type: 'success', message: 'Reservasi berhasil diamankan! Mengalihkan ke pembayaran DP...' });
      setTimeout(() => {
        router.push(`/checkout/${result.data.id}`);
      }, 1500);
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        message: err.message || 'Gagal menyimpan reservasi. Coba lagi.' 
      });
    }
  };

  if (!isMounted) return null;

  const isFutsalSelected = selectedCourt?.nama.toLowerCase().includes('futsal');

  const formattedDate = formData.tanggal 
    ? new Date(formData.tanggal + 'T00:00:00').toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '-';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-sm font-semibold transition-colors group mb-4"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles size={13} /> RESERVASI ONLINE RESMI
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Booking Lapangan <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Olahraga</span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            Pilih lapangan, tentukan jadwal, dan bayar DP 50% via QRIS. Slot terkunci instan secara real-time.
          </p>
        </div>
      </div>

      {/* Status Feedback Alert */}
      {status.type !== 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl mb-8 flex items-center gap-3 border shadow-lg ${
            status.type === 'error' 
              ? 'bg-red-500/10 border-red-500/30 text-red-300' 
              : status.type === 'loading' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
          }`}
        >
          {status.type === 'error' ? (
            <AlertCircle size={22} className="text-red-400 shrink-0" />
          ) : status.type === 'loading' ? (
            <Loader2 size={22} className="text-emerald-400 animate-spin shrink-0" />
          ) : (
            <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
          )}
          <span className="font-semibold text-sm">{status.message}</span>
        </motion.div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Configuration */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STEP 1: PILIH LAPANGAN (Visual Cards) */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-lg font-bold text-white">Pilih Lapangan</h2>
              </div>
              <span className="text-xs text-slate-400">
                {lapanganList.length} Unit Lapangan Tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {lapanganList.map((lap) => {
                const isSelected = formData.lapangan_id === lap.id.toString();
                const isFutsal = lap.nama.toLowerCase().includes('futsal');

                return (
                  <div
                    key={lap.id}
                    onClick={() => handleSelectCourt(lap.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{isFutsal ? '⚽' : '🏸'}</span>
                        <div>
                          <div className={`font-bold text-sm ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                            {lap.nama}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {isFutsal ? 'Vinyl Interlock FIFA' : 'Karpet Li-Ning BWF'}
                          </div>
                        </div>
                      </div>
                      
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check size={12} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700 shrink-0" />
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Tarif Sewa:</span>
                      <span className="font-bold text-emerald-400">
                        Rp {lap.harga_per_jam.toLocaleString('id-ID')}/jam
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: TANGGAL & DURASI BERMAIN */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-lg font-bold text-white">Jadwal & Waktu Bermain</h2>
              </div>
              <span className="text-xs text-slate-400">Buka 08:00 - 24:00 WIB</span>
            </div>

            {/* Tanggal Main */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-300">Tanggal Main</label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tanggal: todayStr }))}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      formData.tanggal === todayStr
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950/70 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    Hari Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tanggal: getRelativeDateStr(1) }))}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      formData.tanggal === getRelativeDateStr(1)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950/70 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    Besok
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tanggal: getRelativeDateStr(2) }))}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      formData.tanggal === getRelativeDateStr(2)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950/70 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    Lusa
                  </button>
                </div>
              </div>

              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-emerald-400" size={18} />
                <input 
                  type="date" 
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  required
                  min={todayStr}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                />
              </div>
            </div>

            {/* Quick Durations */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pilih Cepat Durasi Main
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[1, 2, 3].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => handleQuickDuration(hours)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      durationHours === hours
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {hours} Jam Bermain
                  </button>
                ))}
              </div>
            </div>

            {/* Jam Mulai & Jam Selesai */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Jam Mulai</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-3.5 text-emerald-400" size={18} />
                  <select 
                    name="jam_mulai"
                    value={formData.jam_mulai}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors appearance-none"
                  >
                    <option value="" disabled>Pilih Jam Mulai</option>
                    {timeSlots.map(time => (
                      <option key={`mulai-${time}`} value={time} className="bg-slate-900">
                        {time} WIB
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Jam Selesai</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-3.5 text-teal-400" size={18} />
                  <select 
                    name="jam_selesai"
                    value={formData.jam_selesai}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors appearance-none"
                  >
                    <option value="" disabled>Pilih Jam Selesai</option>
                    {timeSlots.map(time => (
                      <option 
                        key={`selesai-${time}`} 
                        value={time} 
                        className="bg-slate-900" 
                        disabled={formData.jam_mulai ? time <= formData.jam_mulai : false}
                      >
                        {time} WIB
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: DATA PEMESAN */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h2 className="text-lg font-bold text-white">Data Pemesan</h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Akun Terverifikasi
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nama Pemesan / Tim</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="text" 
                  name="pelanggan_nama"
                  value={formData.pelanggan_nama}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan nama lengkap atau nama tim"
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-500"
                />
              </div>
              <p className="text-xs text-slate-400">
                Nama ini akan dicantumkan pada tiket digital dan invoice resmi reservasi.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Order Summary & Price Breakdown */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient subtle glow inside card */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Ringkasan Reservasi</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Live Pricing
              </span>
            </div>

            {/* Selected Court Preview */}
            <div className="py-4 border-b border-slate-800 flex items-center gap-4">
              <div className="relative w-20 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-700">
                <img 
                  src={isFutsalSelected ? '/futsal_new.jpg' : '/badminton_new.jpg'} 
                  alt={selectedCourt?.nama || 'Lapangan'} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-base font-bold text-white">
                  {selectedCourt ? selectedCourt.nama : 'Pilih Lapangan'}
                </div>
                <div className="text-xs text-emerald-400 font-medium">
                  {isFutsalSelected ? '⚽ Vinyl Interlock FIFA' : '🏸 Karpet Li-Ning BWF'}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Rp {hargaPerJam.toLocaleString('id-ID')} / jam
                </div>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="py-4 border-b border-slate-800 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar size={14} className="text-emerald-400" /> Tanggal
                </span>
                <span className="font-semibold text-slate-200">{formattedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock size={14} className="text-teal-400" /> Waktu
                </span>
                <span className="font-semibold text-slate-200">
                  {formData.jam_mulai && formData.jam_selesai 
                    ? `${formData.jam_mulai} - ${formData.jam_selesai} WIB` 
                    : 'Belum ditentukan'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Durasi</span>
                <span className="font-bold text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                  {durationHours} Jam
                </span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="py-4 border-b border-slate-800 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span>Tarif Sewa ({durationHours} Jam)</span>
                <span className="text-slate-200">Rp {totalBiaya.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Biaya Layanan Sistem</span>
                <span className="text-emerald-400 font-semibold">GRATIS</span>
              </div>

              <div className="pt-2 flex items-center justify-between font-bold text-base text-white">
                <span>Total Estimasi Biaya</span>
                <span>Rp {totalBiaya.toLocaleString('id-ID')}</span>
              </div>

              {/* DP Highlight Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
                  <span>Wajib Bayar DP 50% Sekarang</span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    Rp {nominalDP.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Sisa Rp {sisaPelunasan.toLocaleString('id-ID')} dilunasi di kasir saat tiba di lokasi.
                </div>
              </div>
            </div>

            {/* Trust Bullet Points */}
            <div className="pt-4 pb-2 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>Slot langsung terkunci, 100% bebas bentrok</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>Bayar instan via QRIS semua bank & dompet digital</span>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleSubmit}
              disabled={status.type === 'loading' || durationHours <= 0}
              className="w-full mt-4 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-white font-extrabold text-base shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:cursor-not-allowed"
            >
              {status.type === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memproses Reservasi...</span>
                </>
              ) : (
                <>
                  <span>Lanjutkan ke Pembayaran (DP)</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Payment Supported Badges */}
            <div className="mt-4 pt-4 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                Metode Pembayaran Resmi
              </span>
              <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-300">
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">QRIS</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">BCA</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Mandiri</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">GoPay</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">OVO</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">DANA</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen relative overflow-hidden bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] -right-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px]" />
        <div 
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 10%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 10%, #000 60%, transparent 100%)'
          }}
        />
      </div>

      <div className="relative z-10">
        <Suspense fallback={
          <div className="text-center py-24 text-slate-400">
            <Loader2 className="animate-spin w-8 h-8 mx-auto mb-3 text-emerald-500" />
            <p>Memuat formulir pemesanan...</p>
          </div>
        }>
          <ReservationForm />
        </Suspense>
      </div>
    </main>
  );
}
