import { useState } from 'react';
import { motion } from 'framer-motion';
import { checkTimeOverlap } from '../utils/validation';
import { mockLapangan, mockReservasi } from '../types/database';
import { Calendar, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    lapangan_id: 'F1',
    pelanggan_nama: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: ''
  });
  
  const [status, setStatus] = useState<{ type: 'idle' | 'error' | 'success', message: string }>({ type: 'idle', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: 'idle', message: '' }); // Reset status on change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Ambil jadwal yang sudah ada untuk lapangan dan tanggal yang sama
    const existing = mockReservasi.filter(
      r => r.lapangan_id === formData.lapangan_id && r.tanggal === formData.tanggal
    );

    // 2. Jalankan algoritma validasi overlap
    const isOverlap = checkTimeOverlap(existing, formData.jam_mulai, formData.jam_selesai);

    if (isOverlap) {
      setStatus({ 
        type: 'error', 
        message: 'Jadwal Terisi! Waktu yang Anda pilih bentrok dengan reservasi lain.' 
      });
      return;
    }

    if (formData.jam_mulai >= formData.jam_selesai) {
      setStatus({ type: 'error', message: 'Waktu mulai harus lebih awal dari waktu selesai.' });
      return;
    }

    // 3. Jika aman, simpan (di memori statis)
    setStatus({ type: 'success', message: 'Reservasi Berhasil Dibuat!' });
    
    // Simulasi penambahan data sementara ke state lokal (opsional untuk demo)
    mockReservasi.push({
      id: `R${Math.floor(Math.random() * 1000)}`,
      ...formData
    });
  };

  return (
    <main className="pt-24 pb-12 min-h-screen relative overflow-hidden flex justify-center items-center">
      {/* Background Glow */}
      <div className="absolute top-1/4 -right-1/4 w-[40rem] h-[40rem] bg-emerald-700/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 -left-1/4 w-[30rem] h-[30rem] bg-emerald-900/30 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl px-4"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Formulir Reservasi</h1>
            <p className="text-slate-400">Pilih lapangan dan jadwal permainan Anda.</p>
          </div>

          {status.type !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 flex items-center gap-3 border ${
                status.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
              }`}
            >
              {status.type === 'error' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
              <span className="font-medium">{status.message}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Pilih Lapangan</label>
              <select 
                name="lapangan_id" 
                value={formData.lapangan_id} 
                onChange={handleChange}
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              >
                {mockLapangan.map(lap => (
                  <option key={lap.id} value={lap.id} className="bg-slate-900">
                    {lap.nama} - Rp {lap.harga_per_jam.toLocaleString('id-ID')}/jam
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nama Pemesan</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-500" size={20} />
                <input 
                  type="text" 
                  name="pelanggan_nama"
                  value={formData.pelanggan_nama}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan nama lengkap"
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Tanggal Main</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-slate-500" size={20} />
                <input 
                  type="date" 
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Jam Mulai</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                  <input 
                    type="time" 
                    name="jam_mulai"
                    value={formData.jam_mulai}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Jam Selesai</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                  <input 
                    type="time" 
                    name="jam_selesai"
                    value={formData.jam_selesai}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-6 bg-emerald-500 text-slate-950 text-lg font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-all duration-300"
            >
              Konfirmasi Reservasi
            </button>
          </form>
          
          <div className="mt-6 text-center">
             <p className="text-sm text-slate-500">Demo Testing: Coba booking lapangan F1 tanggal 2026-07-15 jam 19:00 - 21:00 untuk melihat error bentrok.</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
