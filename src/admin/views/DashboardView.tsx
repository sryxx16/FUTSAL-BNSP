"use client";
import { useEffect, useState, useMemo } from 'react';
import { getStatistikDashboard, getSemuaReservasi } from '../../lib/db';
import {
  Calendar,
  DollarSign,
  Users,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';

export default function DashboardView({ setActiveTab }: { setActiveTab?: (t: string) => void }) {
  const [stats, setStats] = useState({ reservasiHariIni: 0, pendapatanBulanan: 0, memberAktif: 0 });
  const [allRecent, setAllRecent] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadData() {
      try {
        const [statData, resData] = await Promise.all([
          getStatistikDashboard(),
          getSemuaReservasi(),
        ]);
        setStats(statData);
        const sortedRecent = [...resData].sort((a, b) => b.id - a.id);
        setAllRecent(sortedRecent);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Real breakdown from actual reservations
  const statusStats = useMemo(() => {
    const counts = {
      selesai: 0,
      dp: 0,
      menunggu: 0,
      batal: 0,
    };
    allRecent.forEach((r) => {
      if (r.status === 'Selesai') counts.selesai++;
      else if (r.status === 'Sudah DP 50%') counts.dp++;
      else if (r.status === 'Menunggu Pembayaran' || r.status === 'Menunggu') counts.menunggu++;
      else if (r.status === 'Dibatalkan') counts.batal++;
    });
    return counts;
  }, [allRecent]);

  // Court breakdown from actual reservations
  const courtStats = useMemo(() => {
    const courtMap: Record<string, number> = {};
    allRecent.forEach((r) => {
      if (r.lapangan_nama) {
        courtMap[r.lapangan_nama] = (courtMap[r.lapangan_nama] || 0) + 1;
      }
    });
    return Object.entries(courtMap).sort((a, b) => b[1] - a[1]);
  }, [allRecent]);

  const currentRecent = allRecent.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(allRecent.length / itemsPerPage) || 1;

  const formatUang = (harga: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const formatTanggal = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Selesai
          </span>
        );
      case 'Sudah DP 50%':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            DP 50%
          </span>
        );
      case 'Menunggu Pembayaran':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Menunggu
          </span>
        );
      case 'Dibatalkan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* Top Banner / Quick Action Bar */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Sistem Informasi Pengelolaan Lapangan
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1 text-white">
            Selamat Datang di Panel Manajemen SM Sport
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            Data diperbarui secara otomatis dari basis data Postgres Neon.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab && setActiveTab('reservations')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-emerald-900 hover:bg-emerald-50 active:scale-[0.99] shadow-sm transition-all flex items-center gap-1.5"
          >
            <PlusCircle size={15} />
            <span>Kelola Reservasi</span>
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab('reports')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/30 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet size={15} />
            <span>Rekap Keuangan</span>
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: Reservasi Hari Ini */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reservasi Hari Ini</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Calendar size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : stats.reservasiHariIni}
            </h3>
            <span className="text-xs text-slate-500 font-medium">booking aktif</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total booking masuk</span>
            <strong className="text-slate-800 font-semibold">{allRecent.length} data</strong>
          </div>
        </div>

        {/* Card 2: Pendapatan Bulan Ini */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendapatan Bulan Ini</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
              {loading ? '...' : formatUang(stats.pendapatanBulanan)}
            </h3>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Akumulasi sewa</span>
            <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              Lunas & DP
            </span>
          </div>
        </div>

        {/* Card 3: Member Terdaftar */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Member Aktif</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : stats.memberAktif}
            </h3>
            <span className="text-xs text-slate-500 font-medium">akun terdaftar</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Basis pelanggan</span>
            <span className="text-purple-700 font-semibold text-[11px] bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
              Terverifikasi
            </span>
          </div>
        </div>

        {/* Card 4: Status Selesai / Tingkat Sukses */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking Selesai</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : statusStats.selesai}
            </h3>
            <span className="text-xs text-slate-500 font-medium">selesai dimainkan</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pending konfirmasi</span>
            <strong className="text-amber-700 font-semibold">{statusStats.menunggu} booking</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Table & Real Data Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Data Table */}
        <div className="xl:col-span-2 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-base font-bold text-slate-900">Reservasi Terbaru</h3>
              <p className="text-xs text-slate-500 mt-0.5">Daftar transaksi dan booking lapangan paling update</p>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab('reservations')}
              className="px-3.5 py-1.5 bg-white text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>Semua Reservasi</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider bg-slate-50/30">
                  <th className="py-3 px-5">ID</th>
                  <th className="py-3 px-5">Pelanggan</th>
                  <th className="py-3 px-5">Lapangan</th>
                  <th className="py-3 px-5">Jadwal Main</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Memuat reservasi...
                    </td>
                  </tr>
                ) : currentRecent.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Belum ada reservasi tercatat
                    </td>
                  </tr>
                ) : (
                  currentRecent.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 text-slate-400 font-mono text-xs">#{row.id}</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {row.pelanggan_nama}
                      </td>
                      <td className="py-3.5 px-5 text-slate-700 font-medium">{row.lapangan_nama}</td>
                      <td className="py-3.5 px-5 text-slate-600 text-xs">
                        {formatTanggal(row.tanggal)}, {row.jam_mulai.substring(0, 5)} - {row.jam_selesai.substring(0, 5)}
                      </td>
                      <td className="py-3.5 px-5">{getStatusBadge(row.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/40">
            <span>
              Menampilkan {currentRecent.length} dari total {allRecent.length} data
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
              >
                Prev
              </button>

              <span className="px-2 text-xs font-semibold text-slate-700">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Real Analytics Breakdown */}
        <div className="flex flex-col gap-5">
          {/* Status Distribution Card */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Distribusi Status Pesanan</h3>
              <Activity size={16} className="text-slate-400" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Selesai (Lunas)</span>
                  <span className="font-semibold text-emerald-700">
                    {statusStats.selesai} ({allRecent.length > 0 ? Math.round((statusStats.selesai / allRecent.length) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${allRecent.length > 0 ? (statusStats.selesai / allRecent.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Sudah DP 50%</span>
                  <span className="font-semibold text-blue-700">
                    {statusStats.dp} ({allRecent.length > 0 ? Math.round((statusStats.dp / allRecent.length) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${allRecent.length > 0 ? (statusStats.dp / allRecent.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Menunggu Pembayaran</span>
                  <span className="font-semibold text-amber-700">
                    {statusStats.menunggu} ({allRecent.length > 0 ? Math.round((statusStats.menunggu / allRecent.length) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${allRecent.length > 0 ? (statusStats.menunggu / allRecent.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Dibatalkan</span>
                  <span className="font-semibold text-rose-700">
                    {statusStats.batal} ({allRecent.length > 0 ? Math.round((statusStats.batal / allRecent.length) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${allRecent.length > 0 ? (statusStats.batal / allRecent.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Court Popularity Breakdown Card */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Popularitas Lapangan</h3>
              <TrendingUp size={16} className="text-slate-400" />
            </div>

            <div className="space-y-3">
              {courtStats.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Belum ada data pemakaian lapangan</p>
              ) : (
                courtStats.map(([nama, count], idx) => {
                  const percent = allRecent.length > 0 ? Math.round((count / allRecent.length) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-800">{nama}</span>
                        <span className="text-slate-600 font-semibold">{count} booking ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
