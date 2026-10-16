"use client";
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Grip } from 'lucide-react';
import Link from 'next/link';


export default function HeroSection() {
  return (
    <section 
      className="relative pt-36 pb-20 lg:pt-40 lg:pb-28 px-4 sm:px-6 lg:px-8 min-h-[92vh] flex flex-col justify-center overflow-hidden"
    >
      {/* Background Court Image with subtle parallax feel & rich gradient fades */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: 'url("/futsal_new.jpg")' }}
      >
        {/* Multi-layer gradient overlays: smooth dark vignette to prevent contrast issues */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column: Main headline & CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Live status badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Platform Booking Olahraga #1 • Sistem Real-Time 24/7</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Main Olahraga Favoritmu, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 drop-shadow-[0_0_35px_rgba(16,185,129,0.35)]">
              Booking Instan & Pasti
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Sewa 5 lapangan futsal vinyl & badminton berstandar resmi (FIFA & BWF). 
            Jadwal sinkron otomatis tanpa ribet konfirmasi manual admin. Bayar DP kilat via QRIS.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link 
              href="/book" 
              className="px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group text-base"
            >
              <Calendar className="w-5 h-5 text-white" />
              <span>Booking Lapangan Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a 
              href="#jadwal" 
              className="px-6 py-4 bg-slate-900/70 hover:bg-slate-800/80 backdrop-blur-md border border-slate-700/80 hover:border-emerald-500/40 text-slate-200 hover:text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-base"
            >
              <Grip className="w-5 h-5 text-emerald-400" />
              <span>Cek Ketersediaan Jam</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-3 text-center sm:text-left">
              <div className="text-xl sm:text-2xl font-bold text-white">5 Unit</div>
              <div className="text-xs text-slate-400">Lapangan Pro FIFA/BWF</div>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-3 text-center sm:text-left">
              <div className="text-xl sm:text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400">Bebas Double-Book</div>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-3 text-center sm:text-left">
              <div className="text-xl sm:text-2xl font-bold text-white">08 - 24</div>
              <div className="text-xs text-slate-400">WIB Buka Tiap Hari</div>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-3 text-center sm:text-left">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">4.9 ★</div>
              <div className="text-xs text-slate-400">1.000+ Member Puas</div>
            </div>
          </div>
        </motion.div>

        {/* Right column: Dynamic Glass Preview Card */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 hidden lg:block"
        >
          <div className="relative">
            {/* Ambient glow underneath card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-500/20 rounded-3xl blur-2xl opacity-60" />

            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white text-sm">Status Lapangan Hari Ini</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Live Sync
                </span>
              </div>

              {/* Sample Quick Court Cards */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/90 flex items-center justify-between hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-sm">
                      FA
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Futsal Court A</div>
                      <div className="text-xs text-slate-400">Vinyl Interlock Standard FIFA</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Tersedia
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Rp 150.000/jam</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/90 flex items-center justify-between hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold text-teal-400 text-sm">
                      B1
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Badminton 1</div>
                      <div className="text-xs text-slate-400">Karpet Vinyl Li-Ning BWF</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Tersedia
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Rp 50.000/jam</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/90 flex items-center justify-between hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold text-teal-400 text-sm">
                      B2
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Badminton 2</div>
                      <div className="text-xs text-slate-400">Pencahayaan LED 500 Lux Anti Silau</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Tersedia
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Rp 50.000/jam</div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2">
                <Link 
                  href="/book"
                  className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-600/20 text-slate-200 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/40 transition-all text-xs font-semibold flex items-center justify-center gap-2"
                >
                  Pilih Jadwal & Jam Main <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
