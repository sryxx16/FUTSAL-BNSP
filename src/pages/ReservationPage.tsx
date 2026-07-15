import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDaftarLapangan, buatReservasiDB } from '../lib/db';
import { Calendar, Clock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function ReservationPage() {
  const [lapanganList, setLapanganList] = useState<any[]>([]);
  const sessionStr = localStorage.getItem('sm_session');
  const user = sessionStr ? JSON.parse(sessionStr) : null;

  const [formData, setFormData] = useState({
    lapangan_id: '',
    pelanggan_nama: user ? user.nama : '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: ''
  });
  
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'error' | 'success', message: string }>({ type: 'idle', message: '' });

  useEffect(() => {
    async function loadLapangan() {
      try {
        const data = await getDaftarLapangan();
        setLapanganList(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, lapangan_id: data[0].id.toString() }));
        }
      } catch (err) {
        console.error("Gagal memuat lapangan:", err);
      }
    }
    loadLapangan();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(status.type !== 'loading') setStatus({ type: 'idle', message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.jam_mulai >= formData.jam_selesai) {
      setStatus({ type: 'error', message: 'Waktu mulai harus lebih awal dari waktu selesai.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Menyimpan reservasi ke Database Neon...' });

    try {
      // Menggunakan nama asli yang diinput di form
      await buatReservasiDB(
        formData.pelanggan_nama, 
        parseInt(formData.lapangan_id), 
        formData.tanggal, 
        formData.jam_mulai, 
        formData.jam_selesai
      );
      
      setStatus({ type: 'success', message: 'Reservasi Berhasil Dibuat ke Database Neon!' });
      // Reset form
      setFormData(prev => ({ ...prev, tanggal: '', jam_mulai: '', jam_selesai: '', pelanggan_nama: '' }));
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        message: err.message || 'Gagal menyimpan reservasi. Coba lagi.' 
      });
    }
  };

  return (
    <main className="pt-24 pb-12 min-h-screen relative overflow-hidden flex justify-center items-center">
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
                status.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' 
                : status.type === 'loading' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
              }`}
            >
              {status.type === 'error' ? <AlertCircle size={24} /> 
               : status.type === 'loading' ? <Loader2 size={24} className="animate-spin" />
               : <CheckCircle2 size={24} />}
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
                {lapanganList.length === 0 && <option>Memuat data lapangan...</option>}
                {lapanganList.map(lap => (
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
                  readOnly={!!user}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-600 ${user ? 'opacity-70 cursor-not-allowed' : ''}`}
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
              disabled={status.type === 'loading'}
              className="w-full mt-6 bg-emerald-500 text-slate-950 text-lg font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {status.type === 'loading' ? 'Memproses...' : 'Konfirmasi Reservasi'}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
