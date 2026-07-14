import { useState } from 'react';
import { LayoutDashboard, CalendarDays, Users, Settings, LogOut, Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-50 font-sans w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
            Admin Panel
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'reservations', icon: CalendarDays, label: 'Data Reservasi' },
            { id: 'users', icon: Users, label: 'Pelanggan' },
            { id: 'settings', icon: Settings, label: 'Pengaturan' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all duration-300">
            <LogOut size={20} />
            Kembali ke Web
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Cari sesuatu..." 
                className="bg-slate-950 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-64 transition-all"
              />
            </div>
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-2 border-slate-800 overflow-hidden flex items-center justify-center font-bold text-slate-900">
               AD
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950">
          {activeTab === 'dashboard' && (
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
          )}

          {activeTab === 'reservations' && (
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
          )}

          {activeTab === 'users' && (
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
          )}

          {activeTab === 'settings' && (
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
          )}
        </main>
      </div>
    </div>
  );
}
