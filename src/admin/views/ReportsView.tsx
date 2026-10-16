"use client";
import { useEffect, useState } from 'react';
import { getLaporanPendapatan } from '../../lib/db';
import {
  Printer,
  Calendar,
  TrendingUp,
  Award,
  Layers,
  DollarSign,
  PieChart,
  Loader2,
} from 'lucide-react';

export default function ReportsView() {
  const [laporan, setLaporan] = useState<{
    harian: any[];
    bulanan: any[];
    lapangan: any[];
    statusDist: any[];
    topPelanggan: any[];
  }>({
    harian: [],
    bulanan: [],
    lapangan: [],
    statusDist: [],
    topPelanggan: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getLaporanPendapatan();
        setLaporan(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatUang = (harga: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalPendapatanBulanIni =
    laporan.bulanan.length > 0 ? Number(laporan.bulanan[0].total_pendapatan) : 0;
  const totalReservasiBulanIni =
    laporan.bulanan.length > 0 ? Number(laporan.bulanan[0].total_booking) : 0;
  const totalBatal =
    laporan.statusDist.find((s) => s.status === 'Dibatalkan')?.jumlah || 0;
  const totalSemuaPesanan = laporan.statusDist.reduce(
    (acc, curr) => acc + Number(curr.jumlah),
    0
  );

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Rekapitulasi Keuangan & Performa</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan analitik pendapatan harian, bulanan, pemakaian lapangan, dan loyalitas pelanggan.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] shadow-xs shadow-emerald-600/20 transition-all flex items-center gap-2 shrink-0"
        >
          <Printer size={16} />
          <span>Cetak Laporan (PDF)</span>
        </button>
      </div>

      {/* Official Print Header */}
      <div className="hidden print:block text-center mb-8 text-black border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wider">SM Sport Center</h1>
        <p className="text-sm font-medium">Laporan Rekapitulasi Keuangan & Penggunaan Lapangan</p>
        <p className="text-xs text-slate-600 mt-1">Dicetak pada: {new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
      </div>

      {/* Summary KPI Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print:hidden">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pendapatan (Bulan Ini)
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatUang(totalPendapatanBulanIni)}
            </p>
            <p className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={13} />
              <span>Total omzet terverifikasi</span>
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Booking (Bulan Ini)
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Calendar size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalReservasiBulanIni}{' '}
              <span className="text-sm font-normal text-slate-500">transaksi</span>
            </p>
            <p className="text-xs text-slate-500 font-medium mt-2">
              Dari total {totalSemuaPesanan} booking keseluruhan
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Booking Dibatalkan
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <PieChart size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalBatal}{' '}
              <span className="text-sm font-normal text-slate-500">pesanan</span>
            </p>
            <p className="text-xs text-slate-500 font-medium mt-2">
              {totalSemuaPesanan > 0
                ? `${Math.round((totalBatal / totalSemuaPesanan) * 100)}% dari total booking`
                : '0% rasio pembatalan'}
            </p>
          </div>
        </div>
      )}

      {/* Reports Grid 1: Bulanan & Harian */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start print:block print:space-y-6">
        {/* Laporan Bulanan */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs print:border-none print:shadow-none">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center print:hidden">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Rekap Pendapatan Bulanan</h3>
            </div>
            <span className="text-xs text-slate-400 print:hidden">Akumulasi per bulan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-3">Periode</th>
                  <th className="py-2.5 px-3 text-center">Jumlah Booking</th>
                  <th className="py-2.5 px-3 text-right">Total Pendapatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">
                      <Loader2 size={20} className="animate-spin mx-auto mb-1 text-emerald-600" />
                      <span>Memuat data...</span>
                    </td>
                  </tr>
                ) : laporan.bulanan.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">Belum ada data bulanan</td>
                  </tr>
                ) : (
                  laporan.bulanan.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">{row.bln}</td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">{row.total_booking} transaksi</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">{formatUang(row.total_pendapatan)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Laporan Harian */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs print:border-none print:shadow-none">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center print:hidden">
                <Calendar size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Rekap Harian (14 Hari Terakhir)</h3>
            </div>
            <span className="text-xs text-slate-400 print:hidden">Aktivitas harian</span>
          </div>

          <div className="max-h-[300px] overflow-y-auto pr-1">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3 text-center">Booking</th>
                  <th className="py-2.5 px-3 text-right">Pendapatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">Memuat data...</td>
                  </tr>
                ) : laporan.harian.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">Belum ada data harian</td>
                  </tr>
                ) : (
                  laporan.harian.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-800">{row.tgl}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600 font-medium">{row.total_booking}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-emerald-700">{formatUang(row.total_pendapatan)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Laporan Per Lapangan */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs print:border-none print:shadow-none">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center print:hidden">
              <Layers size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Performa & Kontribusi per Lapangan</h3>
          </div>
          <span className="text-xs text-slate-400 print:hidden">Berdasarkan total pemakaian</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                <th className="py-2.5 px-4">Nama Lapangan</th>
                <th className="py-2.5 px-4 text-center">Total Pemesanan</th>
                <th className="py-2.5 px-4 text-right">Total Pendapatan</th>
                <th className="py-2.5 px-4 text-right print:hidden">Kontribusi Omzet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">Memuat data...</td>
                </tr>
              ) : laporan.lapangan.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">Belum ada data lapangan</td>
                </tr>
              ) : (
                laporan.lapangan.map((row, i) => {
                  const totalAllCourt = laporan.lapangan.reduce((sum, l) => sum + Number(l.total_pendapatan), 0);
                  const share = totalAllCourt > 0 ? Math.round((Number(row.total_pendapatan) / totalAllCourt) * 100) : 0;
                  return (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.nama_lapangan}</td>
                      <td className="py-3 px-4 text-center text-slate-600 font-medium">{row.total_booking} kali disewa</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatUang(row.total_pendapatan)}</td>
                      <td className="py-3 px-4 text-right print:hidden">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs font-semibold text-slate-700">{share}%</span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${share}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reports Grid 2: Top Pelanggan & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start print:block print:space-y-6">
        {/* Top 5 Pelanggan */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs print:border-none print:shadow-none">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center print:hidden">
                <Award size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Top 5 Pelanggan Paling Loyal</h3>
            </div>
            <span className="text-xs text-slate-400 print:hidden">Berdasarkan frekuensi & omzet</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-3">Peringkat</th>
                  <th className="py-2.5 px-3">Nama Pelanggan</th>
                  <th className="py-2.5 px-3 text-center">Frekuensi</th>
                  <th className="py-2.5 px-3 text-right">Total Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">Memuat data...</td>
                  </tr>
                ) : laporan.topPelanggan.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">Belum ada data pelanggan</td>
                  </tr>
                ) : (
                  laporan.topPelanggan.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                            i === 0
                              ? 'bg-amber-100 text-amber-800'
                              : i === 1
                              ? 'bg-slate-200 text-slate-800'
                              : i === 2
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          #{i + 1}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{row.nama}</td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">{row.total_booking} kali</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">{formatUang(row.total_spent)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribusi Status */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs print:border-none print:shadow-none">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center print:hidden">
                <PieChart size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Distribusi Status Pemesanan</h3>
            </div>
            <span className="text-xs text-slate-400 print:hidden">Keseluruhan waktu</span>
          </div>

          <div className="space-y-3.5 py-1">
            {loading ? (
              <p className="text-center text-slate-400 py-6">Memuat data...</p>
            ) : laporan.statusDist.length === 0 ? (
              <p className="text-center text-slate-400 py-6">Belum ada data distribusi</p>
            ) : (
              laporan.statusDist.map((row, i) => {
                const total = laporan.statusDist.reduce((acc, curr) => acc + Number(curr.jumlah), 0);
                const percentage = total > 0 ? Math.round((Number(row.jumlah) / total) * 100) : 0;

                let barColor = 'bg-slate-500';
                let textColor = 'text-slate-700';
                if (row.status === 'Selesai') {
                  barColor = 'bg-emerald-600';
                  textColor = 'text-emerald-700';
                } else if (row.status === 'Sudah DP 50%') {
                  barColor = 'bg-blue-600';
                  textColor = 'text-blue-700';
                } else if (row.status === 'Menunggu Pembayaran' || row.status === 'Menunggu') {
                  barColor = 'bg-amber-500';
                  textColor = 'text-amber-700';
                } else if (row.status === 'Dibatalkan') {
                  barColor = 'bg-rose-500';
                  textColor = 'text-rose-700';
                }

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={`font-semibold ${textColor}`}>{row.status}</span>
                      <span className="font-bold text-slate-800">
                        {row.jumlah} Pesanan ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden print:hidden">
                      <div className={`${barColor} h-2 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
