export default function ReservationsView() {
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
              {[
                { id: 'R101', name: 'Budi Santoso', court: 'Futsal Court A', time: '15 Jul, 19:00', price: 'Rp 150.000', status: 'Selesai', statColor: 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/30' },
                { id: 'R102', name: 'Andi Jaya', court: 'Badminton 1', time: '16 Jul, 15:00', price: 'Rp 50.000', status: 'Menunggu', statColor: 'text-yellow-400 bg-yellow-400/10 border border-yellow-500/30' },
                { id: 'R103', name: 'Rina Melati', court: 'Futsal Court B', time: '16 Jul, 20:00', price: 'Rp 120.000', status: 'Dibatalkan', statColor: 'text-red-400 bg-red-400/10 border border-red-500/30' },
                { id: 'R104', name: 'Tono', court: 'Badminton 2', time: '17 Jul, 09:00', price: 'Rp 50.000', status: 'Selesai', statColor: 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/30' },
                { id: 'R105', name: 'Siti', court: 'Futsal Court A', time: '18 Jul, 16:00', price: 'Rp 150.000', status: 'Menunggu', statColor: 'text-yellow-400 bg-yellow-400/10 border border-yellow-500/30' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-slate-400">#{row.id}</td>
                  <td className="p-4 text-white font-medium">{row.name}</td>
                  <td className="p-4 text-emerald-400">{row.court}</td>
                  <td className="p-4 text-slate-300">{row.time}</td>
                  <td className="p-4 text-slate-300">{row.price}</td>
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
        <div className="p-4 border-t border-slate-800 flex justify-between items-center text-sm text-slate-400">
           <span>Menampilkan 5 dari 24 data</span>
           <div className="flex gap-2">
             <button className="px-3 py-1 border border-slate-700 rounded hover:bg-slate-800 transition-colors">Prev</button>
             <button className="px-3 py-1 border border-slate-700 rounded hover:bg-slate-800 transition-colors bg-slate-800 text-white">1</button>
             <button className="px-3 py-1 border border-slate-700 rounded hover:bg-slate-800 transition-colors">2</button>
             <button className="px-3 py-1 border border-slate-700 rounded hover:bg-slate-800 transition-colors">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
