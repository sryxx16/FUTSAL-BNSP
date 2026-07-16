import { useEffect, useState } from 'react';
import { getStatistikDashboard, getSemuaReservasi } from '../../lib/db';

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
        setRecent(resData.slice(0, 5)); // Ambil 5 data teratas
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
  const formatTanggal = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/30';
      case 'Sudah DP 50%': return 'text-blue-400 bg-blue-400/10 border border-blue-500/30';
      case 'Menunggu Pembayaran': return 'text-yellow-400 bg-yellow-400/10 border border-yellow-500/30';
      case 'Dibatalkan': return 'text-red-400 bg-red-400/10 border border-red-500/30';
      default: return 'text-slate-400 bg-slate-400/10 border border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Reservasi Hari Ini", value: loading ? "..." : stats.reservasiHariIni, color: "text-blue-400" },
          { label: "Pendapatan Bulanan", value: loading ? "..." : formatUang(stats.pendapatanBulanan), color: "text-emerald-400" },
          { label: "Member Aktif", value: loading ? "..." : stats.memberAktif, color: "text-purple-400" }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[100%] transition-transform group-hover:scale-110"></div>
            <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
            <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-white">Reservasi Terbaru</h3>
          <button 
            onClick={() => setActiveTab && setActiveTab('reservations')}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            Lihat Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-sm">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Pelanggan</th>
                <th className="p-4 font-medium">Lapangan</th>
                <th className="p-4 font-medium">Waktu</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                 <tr><td colSpan={5} className="p-4 text-center text-slate-400">Memuat data...</td></tr>
              ) : recent.length === 0 ? (
                 <tr><td colSpan={5} className="p-4 text-center text-slate-400">Belum ada reservasi</td></tr>
              ) : recent.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-slate-400">#{row.id}</td>
                  <td className="p-4 text-white font-medium">{row.pelanggan_nama}</td>
                  <td className="p-4 text-emerald-400">{row.lapangan_nama}</td>
                  <td className="p-4 text-slate-300">{formatTanggal(row.tanggal)}, {row.jam_mulai.substring(0,5)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
