"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getReservasiById, bayarDPReservasi } from '../../../src/lib/db';
import { CheckCircle, Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MockQrisPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payStatus, setPayStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    async function loadData() {
      try {
        if (id) {
          const res = await getReservasiById(parseInt(id as string));
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
    const dp = hitungTotalHarga(data.jam_mulai, data.jam_selesai, data.harga_per_jam) / 2;
    setPayStatus('loading');
    try {
      if (id) {
        await bayarDPReservasi(parseInt(id as string), dp);
      }
      setPayStatus('success');
    } catch (err) {
      console.error(err);
      setPayStatus('idle');
      alert("Gagal melakukan pembayaran");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-100 flex justify-center items-center text-blue-600"><Loader2 className="animate-spin" size={40} /></div>;
  }

  if (!data || data.status !== 'Menunggu Pembayaran') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
        <CheckCircle size={64} className="text-emerald-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Transaksi Selesai / Tidak Valid</h1>
        <p className="text-slate-400">Silakan kembali ke aplikasi utama atau periksa status pesanan Anda.</p>
      </div>
    );
  }

  const dp = hitungTotalHarga(data.jam_mulai, data.jam_selesai, data.harga_per_jam) / 2;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-950 flex flex-col items-center pt-12 p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative z-10"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white relative">
          <div className="absolute top-4 right-4"><ShieldCheck size={24} className="text-blue-200" /></div>
          <h1 className="text-xl font-bold mb-1">SM Sport Pay</h1>
          <p className="text-blue-200 text-sm">Pembayaran Aman via QRIS</p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-slate-400 text-sm mb-1">Total Tagihan (DP)</p>
            <h2 className="text-4xl font-bold text-white">Rp {dp.toLocaleString('id-ID')}</h2>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 mb-6 border border-slate-800 text-sm">
             <div className="flex justify-between mb-3 pb-3 border-b border-slate-800">
               <span className="text-slate-400">Merchant</span>
               <span className="font-semibold text-white">SM Sport Center</span>
             </div>
             <div className="flex justify-between mb-3 pb-3 border-b border-slate-800">
               <span className="text-slate-400">Nama Pelanggan</span>
               <span className="font-semibold text-white">{data.pelanggan_nama}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-400">ID Referensi</span>
               <span className="font-semibold text-white">INV-SMS-{data.id}</span>
             </div>
          </div>

          <button
            onClick={handleBayar}
            disabled={payStatus !== 'idle'}
            className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all duration-300 ${payStatus === 'success'
              ? 'bg-emerald-500 text-white'
              : payStatus === 'loading'
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
              }`}
          >
            {payStatus === 'idle' && (
              <><CreditCard size={24} /> Konfirmasi Bayar</>
            )}
            {payStatus === 'loading' && (
              <><Loader2 className="animate-spin" size={24} /> Memproses...</>
            )}
            {payStatus === 'success' && (
              <><CheckCircle size={24} /> Berhasil</>
            )}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
