"use client";
import { useEffect, useState } from 'react';
import { getLaporanPendapatan } from '../../lib/db';
import { Printer, Calendar, TrendingUp } from 'lucide-react';

export default function ReportsView() {
  const [laporan, setLaporan] = useState<{ harian: any[], bulanan: any[], lapangan: any[], statusDist: any[], topPelanggan: any[] }>({ harian: [], bulanan: [], lapangan: [], statusDist: [], topPelanggan: [] });
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
         <h2 className="text-2xl font-bold text-slate-900">Laporan Keuangan</h2>
         <button 
           onClick={handlePrint}
           className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
         >
           <Printer size={18} /> Cetak PDF
         </button>
      </div>

      <div className="hidden print:block text-center mb-8 text-black">
        <h1 className="text-2xl font-bold">SM Sport Center</h1>
        <p>Laporan Analitik & Pendapatan Lengkap</p>
        <p className="text-sm">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
        <hr className="my-4 border-black" />
      </div>

      {/* Summary Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 print:hidden">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-500 font-medium mb-1">Total Pendapatan (Bulan Ini)</h3>
            <p className="text-3xl font-bold text-emerald-600">{formatUang(laporan.bulanan.length > 0 ? laporan.bulanan[0].total_pendapatan : 0)}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-500 font-medium mb-1">Total Reservasi (Bulan Ini)</h3>
            <p className="text-3xl font-bold text-slate-900">{laporan.bulanan.length > 0 ? laporan.bulanan[0].total_booking : 0} <span className="text-base font-normal text-slate-500">pesanan</span></p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-500 font-medium mb-1">Total Transaksi Dibatalkan</h3>
            <p className="text-3xl font-bold text-slate-900">{laporan.statusDist.find(s => s.status === 'Dibatalkan')?.jumlah || 0} <span className="text-base font-normal text-slate-500">pesanan</span></p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start print:block print:space-y-8">
        
        {/* Laporan Bulanan */}
        <div className="bg-white print:bg-transparent print:border-none border border-slate-200 rounded-2xl p-6">
           <div className="flex items-center gap-3 mb-6 print:text-black">
              <div className="p-2 bg-emerald-500/20 text-emerald-600 print:hidden rounded-lg">
                 <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 print:text-black">Rekap Bulanan</h3>
           </div>
           
           <div className="max-h-[300px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible">
             <table className="w-full text-left border-collapse print:text-black">
               <thead>
                 <tr className="border-b border-slate-200 print:border-black text-slate-500 print:text-black text-sm">
                   <th className="sticky top-0 bg-white z-10 pb-3 font-medium">Bulan</th>
                   <th className="sticky top-0 bg-white z-10 pb-3 font-medium text-center">Total Reservasi</th>
                   <th className="sticky top-0 bg-white z-10 pb-3 font-medium text-right">Pendapatan</th>
                 </tr>
               </thead>
             <tbody className="text-sm">
               {loading ? (
                 <tr><td colSpan={3} className="py-4 text-center text-slate-500">Memuat data...</td></tr>
               ) : laporan.bulanan.length === 0 ? (
                 <tr><td colSpan={3} className="py-4 text-center text-slate-500">Belum ada data</td></tr>
               ) : laporan.bulanan.map((row, i) => (
                 <tr key={i} className="border-b border-slate-200/50 print:border-gray-300">
                   <td className="py-4 text-slate-900 print:text-black font-medium">{row.bln}</td>
                   <td className="py-4 text-center text-slate-600 print:text-black">{row.total_booking}</td>
                   <td className="py-4 text-right text-emerald-600 print:text-black font-bold">{formatUang(row.total_pendapatan)}</td>
                 </tr>
               ))}
             </tbody>
             </table>
           </div>
        </div>

        {/* Laporan Harian */}
        <div className="bg-white print:bg-transparent print:border-none border border-slate-200 rounded-2xl p-6">
           <div className="flex items-center gap-3 mb-6 print:text-black">
              <div className="p-2 bg-blue-500/20 text-blue-600 print:hidden rounded-lg">
                 <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 print:text-black">Rekap Harian (14 Hari Terakhir)</h3>
           </div>
           
           <div className="max-h-[300px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible">
             <table className="w-full text-left border-collapse print:text-black">
               <thead>
                 <tr className="border-b border-slate-200 print:border-black text-slate-500 print:text-black text-sm">
                   <th className="sticky top-0 bg-white z-10 pb-3 font-medium">Tanggal</th>
                   <th className="sticky top-0 bg-white z-10 pb-3 font-medium text-center">Total Reservasi</th>
                   <th className="sticky top-0 bg-white z-10 pb-3 font-medium text-right">Pendapatan</th>
                 </tr>
               </thead>
             <tbody className="text-sm">
               {loading ? (
                 <tr><td colSpan={3} className="py-4 text-center text-slate-500">Memuat data...</td></tr>
               ) : laporan.harian.length === 0 ? (
                 <tr><td colSpan={3} className="py-4 text-center text-slate-500">Belum ada data</td></tr>
               ) : laporan.harian.map((row, i) => (
                 <tr key={i} className="border-b border-slate-200/50 print:border-gray-300">
                   <td className="py-4 text-slate-900 print:text-black font-medium">{row.tgl}</td>
                   <td className="py-4 text-center text-slate-600 print:text-black">{row.total_booking}</td>
                   <td className="py-4 text-right text-emerald-600 print:text-black font-bold">{formatUang(row.total_pendapatan)}</td>
                 </tr>
               ))}
             </tbody>
             </table>
           </div>
        </div>

      </div>

      {/* Laporan Per Lapangan (Full Width) */}
      <div className="bg-white print:bg-transparent print:border-none border border-slate-200 rounded-2xl p-6 mt-6">
         <div className="flex items-center gap-3 mb-6 print:text-black">
            <div className="p-2 bg-purple-500/20 text-purple-600 print:hidden rounded-lg">
               <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 print:text-black">Rekap Pendapatan per Lapangan</h3>
         </div>
         
         <div className="max-h-[300px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible">
           <table className="w-full text-left border-collapse print:text-black">
             <thead>
               <tr className="border-b border-slate-200 print:border-black text-slate-500 print:text-black text-sm">
                 <th className="sticky top-0 bg-white z-10 pb-3 font-medium">Nama Lapangan</th>
                 <th className="sticky top-0 bg-white z-10 pb-3 font-medium text-center">Total Reservasi</th>
                 <th className="sticky top-0 bg-white z-10 pb-3 font-medium text-right">Total Pendapatan (Estimasi)</th>
               </tr>
             </thead>
           <tbody className="text-sm">
             {loading ? (
               <tr><td colSpan={3} className="py-4 text-center text-slate-500">Memuat data...</td></tr>
             ) : laporan.lapangan.length === 0 ? (
               <tr><td colSpan={3} className="py-4 text-center text-slate-500">Belum ada data</td></tr>
             ) : laporan.lapangan.map((row, i) => (
               <tr key={i} className="border-b border-slate-200/50 print:border-gray-300">
                 <td className="py-4 text-slate-900 print:text-black font-medium">{row.nama_lapangan}</td>
                 <td className="py-4 text-center text-slate-600 print:text-black">{row.total_booking}</td>
                 <td className="py-4 text-right text-emerald-600 print:text-black font-bold">{formatUang(row.total_pendapatan)}</td>
               </tr>
             ))}
           </tbody>
         </table>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start print:block print:space-y-8">
        
        {/* Laporan Top Pelanggan */}
        <div className="bg-white print:bg-transparent print:border-none border border-slate-200 rounded-2xl p-6">
           <div className="flex items-center gap-3 mb-6 print:text-black">
              <div className="p-2 bg-orange-500/20 text-orange-600 print:hidden rounded-lg">
                 <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 print:text-black">Top 5 Pelanggan (Loyalitas)</h3>
           </div>
           
           <div className="max-h-[300px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible">
             <table className="w-full text-left border-collapse print:text-black">
               <thead>
                 <tr className="border-b border-slate-200 print:border-black text-slate-500 print:text-black text-sm">
                   <th className="sticky top-0 bg-white z-10 pb-3 font-medium">Nama Pelanggan</th>
                   <th className="sticky top-0 bg-white z-10 pb-3 font-medium text-center">Total Main</th>
                   <th className="sticky top-0 bg-white z-10 pb-3 font-medium text-right">Total Transaksi</th>
                 </tr>
               </thead>
             <tbody className="text-sm">
               {loading ? (
                 <tr><td colSpan={3} className="py-4 text-center text-slate-500">Memuat data...</td></tr>
               ) : laporan.topPelanggan.length === 0 ? (
                 <tr><td colSpan={3} className="py-4 text-center text-slate-500">Belum ada data</td></tr>
               ) : laporan.topPelanggan.map((row, i) => (
                 <tr key={i} className="border-b border-slate-200/50 print:border-gray-300">
                   <td className="py-4 text-slate-900 print:text-black font-medium">{row.nama}</td>
                   <td className="py-4 text-center text-slate-600 print:text-black">{row.total_booking} kali</td>
                   <td className="py-4 text-right text-emerald-600 print:text-black font-bold">{formatUang(row.total_spent)}</td>
                 </tr>
               ))}
             </tbody>
             </table>
           </div>
        </div>

        {/* Laporan Distribusi Status */}
        <div className="bg-white print:bg-transparent print:border-none border border-slate-200 rounded-2xl p-6">
           <div className="flex items-center gap-3 mb-6 print:text-black">
              <div className="p-2 bg-slate-500/20 text-slate-600 print:hidden rounded-lg">
                 <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 print:text-black">Distribusi Status Pesanan</h3>
           </div>
           
           <div className="space-y-4">
               {loading ? (
                 <p className="text-center text-slate-500 py-4">Memuat data...</p>
               ) : laporan.statusDist.length === 0 ? (
                 <p className="text-center text-slate-500 py-4">Belum ada data</p>
               ) : laporan.statusDist.map((row, i) => {
                 // Hitung persentase untuk bar indikator
                 const total = laporan.statusDist.reduce((acc, curr) => acc + Number(curr.jumlah), 0);
                 const percentage = Math.round((Number(row.jumlah) / total) * 100);
                 
                 let colorClass = 'bg-slate-500';
                 if (row.status === 'Selesai') colorClass = 'bg-emerald-500';
                 if (row.status === 'Sudah DP 50%') colorClass = 'bg-blue-500';
                 if (row.status === 'Menunggu Pembayaran') colorClass = 'bg-orange-500';
                 if (row.status === 'Dibatalkan') colorClass = 'bg-red-500';

                 return (
                   <div key={i} className="print:border-b print:border-gray-300 print:pb-2">
                     <div className="flex justify-between text-sm mb-1 print:text-black">
                       <span className="font-medium text-slate-700 print:text-black">{row.status}</span>
                       <span className="font-bold text-slate-900 print:text-black">{row.jumlah} Pesanan ({percentage}%)</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2 print:hidden">
                       <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                     </div>
                   </div>
                 );
               })}
           </div>
        </div>
      </div>
    </div>
  );
}
