import { useEffect, useState } from 'react';
import { getLaporanPendapatan } from '../../lib/db';
import { Printer, Calendar, TrendingUp } from 'lucide-react';

export default function ReportsView() {
  const [laporan, setLaporan] = useState<{ harian: any[], bulanan: any[], lapangan: any[] }>({ harian: [], bulanan: [], lapangan: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getLaporanPendapatan();
        setLaporan(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatUang = (harga: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(harga);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      <div className="flex justify-between items-center print:hidden">
         <h2 className="text-2xl font-bold text-white">Laporan Keuangan</h2>
         <button 
           onClick={handlePrint}
           className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
         >
           <Printer size={18} /> Cetak PDF
         </button>
      </div>

      <div className="hidden print:block text-center mb-8 text-black">
        <h1 className="text-2xl font-bold">SM Sport Center</h1>
        <p>Laporan Pendapatan (Harian & Bulanan)</p>
        <p className="text-sm">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
        <hr className="my-4 border-black" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block print:space-y-8">
        
        {/* Laporan Bulanan */}
        <div className="bg-slate-900 print:bg-transparent print:border-none border border-slate-800 rounded-2xl p-6">
           <div className="flex items-center gap-3 mb-6 print:text-black">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 print:hidden rounded-lg">
                 <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-white print:text-black">Rekap Bulanan</h3>
           </div>
           
           <table className="w-full text-left border-collapse print:text-black">
             <thead>
               <tr className="border-b border-slate-800 print:border-black text-slate-400 print:text-black text-sm">
                 <th className="pb-3 font-medium">Bulan</th>
                 <th className="pb-3 font-medium text-center">Total Reservasi</th>
                 <th className="pb-3 font-medium text-right">Pendapatan</th>
               </tr>
             </thead>
             <tbody className="text-sm">
               {loading ? (
                 <tr><td colSpan={3} className="py-4 text-center text-slate-400">Memuat data...</td></tr>
               ) : laporan.bulanan.length === 0 ? (
                 <tr><td colSpan={3} className="py-4 text-center text-slate-400">Belum ada data</td></tr>
               ) : laporan.bulanan.map((row, i) => (
                 <tr key={i} className="border-b border-slate-800/50 print:border-gray-300">
                   <td className="py-4 text-white print:text-black font-medium">{row.bln}</td>
                   <td className="py-4 text-center text-slate-300 print:text-black">{row.total_booking}</td>
                   <td className="py-4 text-right text-emerald-400 print:text-black font-bold">{formatUang(row.total_pendapatan)}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

        {/* Laporan Harian */}
        <div className="bg-slate-900 print:bg-transparent print:border-none border border-slate-800 rounded-2xl p-6">
           <div className="flex items-center gap-3 mb-6 print:text-black">
              <div className="p-2 bg-blue-500/20 text-blue-400 print:hidden rounded-lg">
                 <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-white print:text-black">Rekap Harian (14 Hari Terakhir)</h3>
           </div>
           
           <table className="w-full text-left border-collapse print:text-black">
             <thead>
               <tr className="border-b border-slate-800 print:border-black text-slate-400 print:text-black text-sm">
                 <th className="pb-3 font-medium">Tanggal</th>
                 <th className="pb-3 font-medium text-center">Total Reservasi</th>
                 <th className="pb-3 font-medium text-right">Pendapatan</th>
               </tr>
             </thead>
             <tbody className="text-sm">
               {loading ? (
                 <tr><td colSpan={3} className="py-4 text-center text-slate-400">Memuat data...</td></tr>
               ) : laporan.harian.length === 0 ? (
                 <tr><td colSpan={3} className="py-4 text-center text-slate-400">Belum ada data</td></tr>
               ) : laporan.harian.map((row, i) => (
                 <tr key={i} className="border-b border-slate-800/50 print:border-gray-300">
                   <td className="py-4 text-white print:text-black font-medium">{row.tgl}</td>
                   <td className="py-4 text-center text-slate-300 print:text-black">{row.total_booking}</td>
                   <td className="py-4 text-right text-emerald-400 print:text-black font-bold">{formatUang(row.total_pendapatan)}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

      </div>

      {/* Laporan Per Lapangan (Full Width) */}
      <div className="bg-slate-900 print:bg-transparent print:border-none border border-slate-800 rounded-2xl p-6 mt-6">
         <div className="flex items-center gap-3 mb-6 print:text-black">
            <div className="p-2 bg-purple-500/20 text-purple-400 print:hidden rounded-lg">
               <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-white print:text-black">Rekap Pendapatan per Lapangan</h3>
         </div>
         
         <table className="w-full text-left border-collapse print:text-black">
           <thead>
             <tr className="border-b border-slate-800 print:border-black text-slate-400 print:text-black text-sm">
               <th className="pb-3 font-medium">Nama Lapangan</th>
               <th className="pb-3 font-medium text-center">Total Reservasi</th>
               <th className="pb-3 font-medium text-right">Total Pendapatan (Estimasi)</th>
             </tr>
           </thead>
           <tbody className="text-sm">
             {loading ? (
               <tr><td colSpan={3} className="py-4 text-center text-slate-400">Memuat data...</td></tr>
             ) : laporan.lapangan.length === 0 ? (
               <tr><td colSpan={3} className="py-4 text-center text-slate-400">Belum ada data</td></tr>
             ) : laporan.lapangan.map((row, i) => (
               <tr key={i} className="border-b border-slate-800/50 print:border-gray-300">
                 <td className="py-4 text-white print:text-black font-medium">{row.nama_lapangan}</td>
                 <td className="py-4 text-center text-slate-300 print:text-black">{row.total_booking}</td>
                 <td className="py-4 text-right text-emerald-400 print:text-black font-bold">{formatUang(row.total_pendapatan)}</td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}
