export default function SettingsView() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
         <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Pengaturan Master Lapangan</h3>
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="text-sm font-medium text-slate-400 block mb-2">Harga Dasar Futsal (per jam)</label>
                 <input type="text" defaultValue="150000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
               </div>
               <div>
                 <label className="text-sm font-medium text-slate-400 block mb-2">Harga Dasar Badminton (per jam)</label>
                 <input type="text" defaultValue="50000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="text-sm font-medium text-slate-400 block mb-2">Jam Buka Operasional</label>
                 <input type="time" defaultValue="08:00" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" style={{ colorScheme: 'dark' }} />
               </div>
               <div>
                 <label className="text-sm font-medium text-slate-400 block mb-2">Jam Tutup Operasional</label>
                 <input type="time" defaultValue="23:00" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" style={{ colorScheme: 'dark' }} />
               </div>
            </div>
            <button className="bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-lg hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">Simpan Perubahan Lapangan</button>
         </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
         <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Profil Admin</h3>
         <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center relative overflow-hidden flex-shrink-0">
               <span className="text-4xl font-bold text-slate-500">AD</span>
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-xs text-white font-bold">Ubah Foto</span>
               </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
               <div>
                 <label className="text-sm font-medium text-slate-400 block mb-2">Nama Tampilan</label>
                 <input type="text" defaultValue="Super Admin" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
               </div>
               <div>
                 <label className="text-sm font-medium text-slate-400 block mb-2">Email Admin</label>
                 <input type="email" defaultValue="admin@smsport.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
               </div>
               <button className="bg-slate-800 border border-slate-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors">Update Profil</button>
            </div>
         </div>
      </div>
    </div>
  );
}
