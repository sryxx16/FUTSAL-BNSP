export default function UsersView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Manajemen Pelanggan</h2>
         <button className="bg-slate-800 text-white font-bold px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">Ekspor Data</button>
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
                <th className="p-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: 'Budi Santoso', email: 'budi@example.com', join: '10 Jan 2026', total: 14, status: 'Aktif', statColor: 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/30' },
                { name: 'Andi Jaya', email: 'andi@example.com', join: '22 Feb 2026', total: 3, status: 'Aktif', statColor: 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/30' },
                { name: 'Rina Melati', email: 'rina@example.com', join: '05 Mar 2026', total: 0, status: 'Tidak Aktif', statColor: 'text-slate-400 bg-slate-400/10 border border-slate-500/30' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-white">{row.name}</div>
                    <div className="text-xs text-slate-500">{row.email}</div>
                  </td>
                  <td className="p-4 text-slate-400">{row.join}</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">{row.total}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.statColor}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-slate-400 hover:text-white transition-colors">Detail</button>
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
