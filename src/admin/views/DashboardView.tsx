export default function DashboardView() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Reservasi Hari Ini", value: "12", color: "text-blue-400" },
          { label: "Pendapatan Bulanan", value: "Rp 8.4M", color: "text-emerald-400" },
          { label: "Member Aktif", value: "145", color: "text-purple-400" }
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
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 border border-slate-700 transition-colors">Lihat Semua</button>
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
                <th className="p-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { id: 'R101', name: 'Budi Santoso', court: 'Futsal Court A', time: '15 Jul, 19:00', status: 'Selesai', statColor: 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/30' },
                { id: 'R102', name: 'Andi Jaya', court: 'Badminton 1', time: '16 Jul, 15:00', status: 'Menunggu', statColor: 'text-yellow-400 bg-yellow-400/10 border border-yellow-500/30' },
                { id: 'R103', name: 'Rina Melati', court: 'Futsal Court B', time: '16 Jul, 20:00', status: 'Dibatalkan', statColor: 'text-red-400 bg-red-400/10 border border-red-500/30' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-slate-400">#{row.id}</td>
                  <td className="p-4 text-white font-medium">{row.name}</td>
                  <td className="p-4 text-emerald-400">{row.court}</td>
                  <td className="p-4 text-slate-300">{row.time}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.statColor}`}>
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
      </div>
    </div>
  );
}
