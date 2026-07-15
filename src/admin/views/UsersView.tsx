import { useEffect, useState } from 'react';
import { getDaftarPelanggan } from '../../lib/db';

export default function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDaftarPelanggan();
        setUsers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportCSV = () => {
    if (users.length === 0) {
      alert("Belum ada data pelanggan untuk diekspor!");
      return;
    }
    const headers = ['Nama Lengkap', 'Email', 'Tanggal Daftar', 'Total Booking'];
    const csvData = users.map(u => `"${u.nama}","${u.email}","${u.tgl_daftar}","${u.total_booking}"`);
    const csvContent = [headers.join(','), ...csvData].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Data_Pelanggan_SMSport_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Manajemen Pelanggan</h2>
         <button 
           onClick={handleExportCSV}
           className="bg-slate-800 text-white font-bold px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
         >
           Ekspor Data (CSV)
         </button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-sm">
                <th className="p-4 font-medium">Nama / Email</th>
                <th className="p-4 font-medium">Tgl Daftar</th>
                <th className="p-4 font-medium text-center">Total Booking</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Memuat pelanggan...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Belum ada pelanggan</td></tr>
              ) : users.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-white">{row.nama}</div>
                    <div className="text-xs text-slate-500">{row.email}</div>
                  </td>
                  <td className="p-4 text-slate-400">{row.tgl_daftar}</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">{row.total_booking}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-500/30">
                      Aktif
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
