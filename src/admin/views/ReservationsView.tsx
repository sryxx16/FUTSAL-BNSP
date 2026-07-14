import { useEffect, useState } from 'react';
import { getSemuaReservasi } from '../../lib/db';

export default function ReservationsView() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSemuaReservasi();
        setReservations(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/30';
      case 'Menunggu': return 'text-yellow-400 bg-yellow-400/10 border border-yellow-500/30';
      case 'Dibatalkan': return 'text-red-400 bg-red-400/10 border border-red-500/30';
      default: return 'text-slate-400 bg-slate-400/10 border border-slate-500/30';
    }
  };

  const formatTanggal = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatUang = (harga: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(harga);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
         <div className="flex gap-4">
            <select className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-emerald-500">
              <option>Semua Status</option>
              <option>Menunggu</option>
              <option>Selesai</option>
              <option>Dibatalkan</option>
            </select>
            <input type="date" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-emerald-500" style={{ colorScheme: 'dark' }} />
         </div>
         <button className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors">+ Reservasi Manual</button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-sm">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Pelanggan</th>
                <th className="p-4 font-medium">Lapangan</th>
                <th className="p-4 font-medium">Waktu</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Memuat data dari Neon DB...</td></tr>
              ) : reservations.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Belum ada data reservasi</td></tr>
              ) : reservations.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-slate-400">#{row.id}</td>
                  <td className="p-4 text-white font-medium">{row.pelanggan_nama}</td>
                  <td className="p-4 text-emerald-400">{row.lapangan_nama}</td>
                  <td className="p-4 text-slate-300">
                    {formatTanggal(row.tanggal)}<br/>
                    <span className="text-xs text-slate-500">{row.jam_mulai.substring(0,5)} - {row.jam_selesai.substring(0,5)}</span>
                  </td>
                  <td className="p-4 text-slate-300">{formatUang(row.harga_per_jam)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-blue-400 hover:text-blue-300 mx-2 transition-colors font-medium">Edit</button>
                    <button className="text-red-400 hover:text-red-300 mx-2 transition-colors font-medium">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-800 flex justify-between items-center text-sm text-slate-400">
           <span>Menampilkan {reservations.length} data</span>
           <div className="flex gap-2">
             <button className="px-3 py-1 border border-slate-700 rounded hover:bg-slate-800 transition-colors bg-slate-800 text-white">1</button>
           </div>
        </div>
      </div>
    </div>
  );
}
