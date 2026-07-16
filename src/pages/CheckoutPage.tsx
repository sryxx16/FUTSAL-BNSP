import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getReservasiById, bayarDPReservasi } from '../lib/db';
import { QrCode, CheckCircle, Loader2, ArrowLeft, Clock } from 'lucide-react';

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payStatus, setPayStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [inputNominal, setInputNominal] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadData() {
      try {
        if (id) {
          const res = await getReservasiById(parseInt(id));
          if (res) setData(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const hitungTotalHarga = (jamMulai: string, jamSelesai: string, hargaPerJam: number) => {
    if (!jamMulai || !jamSelesai) return hargaPerJam;
    const [h1, m1] = jamMulai.split(':').map(Number);
    const [h2, m2] = jamSelesai.split(':').map(Number);
    const totalMenit = (h2 * 60 + m2) - (h1 * 60 + m1);
    return (totalMenit / 60) * hargaPerJam;
  };

  const handleBayar = async () => {
    const nominal = Number(inputNominal);
    const dp = hitungTotalHarga(data.jam_mulai, data.jam_selesai, data.harga_per_jam) / 2;
    
    if (nominal < dp) {
      alert("Nominal yang Anda masukkan kurang dari jumlah DP yang diwajibkan (50%)!");
      return;
    }

    setPayStatus('loading');
    try {
      // Simulasi delay gateway 2 detik
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (id) {
        await bayarDPReservasi(parseInt(id), nominal);
      }
      setPayStatus('success');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2500);
    } catch (err) {
      console.error(err);
      setPayStatus('idle');
      alert("Gagal melakukan simulasi pembayaran");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex justify-center items-center text-emerald-500"><Loader2 className="animate-spin" size={40} /></div>;
  }

  if (!data) {
    return <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">Data Reservasi Tidak Ditemukan.</div>;
  }

  if (data.status !== 'Menunggu Pembayaran') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bold mb-4">Reservasi ini tidak memerlukan pembayaran DP.</h2>
        <button onClick={() => navigate('/my-bookings')} className="text-emerald-400 underline">Kembali ke Riwayat</button>
      </div>
    );
  }

  const total = hitungTotalHarga(data.jam_mulai, data.jam_selesai, data.harga_per_jam);
  const dp = total / 2; // DP 50%

  return (
    <main className="pt-24 pb-12 min-h-screen bg-slate-950 flex justify-center items-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 -right-1/4 w-[40rem] h-[40rem] bg-emerald-700/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative z-10"
      >
        <div className="bg-slate-800/50 p-6 flex items-center gap-4">
          <button onClick={() => navigate('/my-bookings')} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-white">Selesaikan Pembayaran DP</h1>
        </div>

        <div className="p-8">
          <div className="bg-slate-950 rounded-xl p-4 mb-6 border border-slate-800">
            <p className="text-sm text-slate-400 mb-1">Total Biaya Sewa:</p>
            <p className="text-lg text-white font-medium mb-4 line-through decoration-red-500">Rp {total.toLocaleString('id-ID')}</p>
            
            <p className="text-sm text-emerald-400 font-bold mb-1">DP yang harus dibayar (50%):</p>
            <p className="text-3xl font-bold text-emerald-400">Rp {dp.toLocaleString('id-ID')}</p>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-48 h-48 bg-white p-2 rounded-2xl mb-4 flex items-center justify-center overflow-hidden shadow-inner">
              <img src="/qris-demo.png" alt="QRIS" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <p className="text-sm text-slate-400 text-center flex items-center gap-2 mb-6">
              <Clock size={16} className="text-yellow-500" /> Selesaikan pembayaran dalam 20 menit
            </p>

            <div className="w-full">
              <label className="text-sm font-medium text-slate-300 block mb-2">Masukkan Nominal Transfer Anda</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400">Rp</span>
                <input 
                  type="number"
                  value={inputNominal}
                  onChange={(e) => setInputNominal(e.target.value)}
                  placeholder="Contoh: 100000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white font-bold text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleBayar}
            disabled={payStatus !== 'idle' || !inputNominal}
            className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all duration-300 ${
              payStatus === 'success' 
                ? 'bg-emerald-500 text-slate-950' 
                : payStatus === 'loading'
                ? 'bg-emerald-500/50 text-slate-950 cursor-wait'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            }`}
          >
            {payStatus === 'idle' && (
              <>Simulasi Bayar QRIS Sekarang</>
            )}
            {payStatus === 'loading' && (
              <><Loader2 className="animate-spin" size={24} /> Memverifikasi Bank...</>
            )}
            {payStatus === 'success' && (
              <><CheckCircle size={24} /> DP Lunas!</>
            )}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
