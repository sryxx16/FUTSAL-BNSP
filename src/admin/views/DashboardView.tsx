import { useEffect, useState } from 'react';
import { getStatistikDashboard, getSemuaReservasi } from '../../lib/db';
import { Calendar, DollarSign, Users, SquareDashedBottom } from 'lucide-react';

export default function DashboardView({ setActiveTab }: { setActiveTab?: (t: string) => void }) {
  const [stats, setStats] = useState({ reservasiHariIni: 0, pendapatanBulanan: 0, memberAktif: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statData, resData] = await Promise.all([
          getStatistikDashboard(),
          getSemuaReservasi()
        ]);
        setStats(statData);
        setRecent(resData.slice(0, 6)); // Ambil 6 data teratas
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatUang = (harga: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(harga);
  };
  
  const formatTanggal = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai': 
        return <span className="px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 bg-emerald-50">Selesai</span>;
      case 'Sudah DP 50%': 
        return <span className="px-3 py-1 rounded-full text-xs font-semibold text-blue-600 bg-blue-50">Sudah DP 50%</span>;
      case 'Menunggu Pembayaran': 
        return <span className="px-3 py-1 rounded-full text-xs font-semibold text-orange-600 bg-orange-50">Menunggu</span>;
      case 'Dibatalkan': 
        return <span className="px-3 py-1 rounded-full text-xs font-semibold text-red-600 bg-red-50">Dibatalkan</span>;
      default: 
        return <span className="px-3 py-1 rounded-full text-xs font-semibold text-slate-600 bg-slate-100">{status}</span>;
    }
  };

  const getPaymentStatus = (status: string) => {
    if (status === 'Selesai') return <span className="text-emerald-600 font-semibold text-sm">Lunas</span>;
    if (status === 'Sudah DP 50%') return <span className="text-blue-600 font-semibold text-sm">DP</span>;
    if (status === 'Dibatalkan') return <span className="text-slate-400 text-sm">-</span>;
    return <span className="text-orange-500 font-semibold text-sm">Belum</span>;
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Calendar className="text-emerald-600" size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium mb-1">Total Reservasi</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-900">{loading ? "..." : stats.reservasiHariIni} <span className="text-sm font-normal text-slate-500">Hari ini</span></h3>
            </div>
            <p className="text-[11px] font-medium text-emerald-600 mt-1">+12% dari kemarin</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium mb-1">Pendapatan Bulan Ini</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-900">{loading ? "..." : formatUang(stats.pendapatanBulanan)}</h3>
            </div>
            <p className="text-[11px] font-medium text-emerald-600 mt-1">+8.5% dari bulan lalu</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
            <Users className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium mb-1">Member Aktif</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-900">{loading ? "..." : stats.memberAktif}</h3>
            </div>
            <p className="text-[11px] font-medium text-emerald-600 mt-1">+4 dari bulan lalu</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Data Table */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Reservasi Terbaru</h3>
            <button 
              onClick={() => setActiveTab && setActiveTab('reservations')}
              className="px-4 py-2 bg-white text-slate-700 rounded-lg text-sm hover:bg-slate-50 border border-slate-200 transition-colors font-medium shadow-sm"
            >
              Lihat Semua
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-y border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-6 font-medium">ID</th>
                  <th className="py-3 px-6 font-medium">Pelanggan</th>
                  <th className="py-3 px-6 font-medium">Lapangan</th>
                  <th className="py-3 px-6 font-medium">Waktu</th>
                  <th className="py-3 px-6 font-medium">Status</th>
                  <th className="py-3 px-6 font-medium">Pembayaran</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                   <tr><td colSpan={6} className="py-4 text-center text-slate-500">Memuat data...</td></tr>
                ) : recent.length === 0 ? (
                   <tr><td colSpan={6} className="py-4 text-center text-slate-500">Belum ada reservasi</td></tr>
                ) : recent.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-slate-400">#{row.id}</td>
                    <td className="py-4 px-6 text-slate-900 font-semibold">{row.pelanggan_nama}</td>
                    <td className="py-4 px-6 text-slate-700 font-medium">{row.lapangan_nama}</td>
                    <td className="py-4 px-6 text-slate-500">{formatTanggal(row.tanggal)}, {row.jam_mulai.substring(0,5)}</td>
                    <td className="py-4 px-6">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="py-4 px-6">
                      {getPaymentStatus(row.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Menampilkan {recent.length} dari data terbaru</span>
            <div className="flex items-center gap-1">
               <span className="px-2 cursor-pointer">&lt;</span>
               <span className="w-6 h-6 flex items-center justify-center rounded bg-emerald-50 text-emerald-600 font-bold cursor-pointer">1</span>
               <span className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500 cursor-pointer">2</span>
               <span className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500 cursor-pointer">3</span>
               <span className="px-2 cursor-pointer">&gt;</span>
            </div>
          </div>
        </div>

        {/* Right Column (Charts) */}
        <div className="flex flex-col gap-6">
          {/* Chart 1: Line Chart Mockup */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col h-[280px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Reservasi Bulan Ini</h3>
              <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-1 outline-none">
                <option>Juli 2026</option>
              </select>
            </div>
            <div className="flex-1 relative w-full h-full">
              {/* Dummy SVG Area Chart */}
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400">
                <div className="border-b border-slate-100 w-full h-0">40</div>
                <div className="border-b border-slate-100 w-full h-0">30</div>
                <div className="border-b border-slate-100 w-full h-0">20</div>
                <div className="border-b border-slate-100 w-full h-0">10</div>
                <div className="border-b border-slate-100 w-full h-0">0</div>
              </div>
              <svg className="absolute inset-0 w-full h-full pt-4" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,80 L10,75 L20,60 L30,55 L40,50 L50,15 L60,20 L70,25 L80,25 L90,15 L100,30 L100,100 L0,100 Z" fill="rgba(16,185,129,0.1)" />
                <path d="M0,80 L10,75 L20,60 L30,55 L40,50 L50,15 L60,20 L70,25 L80,25 L90,15 L100,30" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 pl-4">
              <span>1 Jul</span>
              <span>8 Jul</span>
              <span>15 Jul</span>
              <span>22 Jul</span>
              <span>29 Jul</span>
            </div>
          </div>

          {/* Chart 2: Progress Bar Mockup */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col h-[200px]">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Pendapatan Bulanan</h3>
              <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-1 outline-none">
                <option>Juli 2026</option>
              </select>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <h3 className="text-3xl font-bold text-slate-900">{loading ? "..." : formatUang(stats.pendapatanBulanan)}</h3>
              <span className="text-xs font-medium text-emerald-600">+8.5% <span className="text-slate-400 font-normal">dari bulan lalu</span></span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Target: Rp 10.000.000</span>
              <span className="font-bold text-slate-700">60%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-2">
        <p>© 2026 SM Sport. All rights reserved.</p>
        <p>Dibuat dengan <span className="text-red-500">❤️</span> untuk SM Sport</p>
      </div>
    </div>
  );
}
