"use client";
import { motion } from 'framer-motion';
import { Trophy, Zap, ShieldCheck, Users, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4"
          >
            <Sparkles size={14} />
            MENGAPA MEMILIH SM SPORT
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Kualitas Premium, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Pengalaman Bermain Maksimal</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl"
          >
            Kami menggabungkan infrastruktur lapangan bertaraf dunia dengan sistem booking teknologi terkini.
          </motion.p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento Card 1: Large Featured (FIFA & BWF Court Standards) */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-slate-800/90 hover:border-emerald-500/40 rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_0_35px_rgba(16,185,129,0.12)] flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Trophy size={28} />
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-semibold">
                  Sertifikasi Resmi
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                Standar Lapangan Pro FIFA & BWF
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Lantai Vinyl Interlock bersuspensi ganda untuk futsal yang meredam benturan lutut, serta karpet vinyl Li-Ning resmi BWF untuk badminton dengan cengkeraman maksimal.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-950/60 border border-slate-800/80 px-3.5 py-2.5 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Lampu LED 600 Lux Anti-Silau</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-950/60 border border-slate-800/80 px-3.5 py-2.5 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Shock Absorption Cegah Cedera</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-950/60 border border-slate-800/80 px-3.5 py-2.5 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Jaring Pengaman Double-Knot Keliling</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-950/60 border border-slate-800/80 px-3.5 py-2.5 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Ceiling Tinggi 9 Meter Bebas Hambatan</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Card 2: Instant QRIS & Real-time Booking */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-slate-800/90 hover:border-emerald-500/40 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_0_35px_rgba(16,185,129,0.12)] flex flex-col justify-between group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                Instant Booking & Bayar QRIS Otomatis
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Pilih jam langsung tanpa menunggu konfirmasi manual admin. Bayar DP 50% via QRIS (BCA, Mandiri, GoPay, OVO, DANA) dan jadwal Anda langsung terkunci.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Status Pembayaran</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Otomatis 20 Detik
                </span>
              </div>
              <div className="text-xs text-slate-400">
                E-Tiket & invoice resmi langsung diterbitkan ke akun Anda.
              </div>
            </div>
          </motion.div>

          {/* Bento Card 3: 100% Anti-Bentrok Guarantee */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-4 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-slate-800/90 hover:border-emerald-500/40 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_0_35px_rgba(16,185,129,0.12)] flex flex-col justify-between group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                Garansi 100% Bebas Jadwal Bentrok
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Sistem database atomik real-time mengunci slot menit yang sama sehingga tidak akan pernah terjadi insiden dua tim datang di jam yang sama.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20">
              <CheckCircle2 size={15} /> Terintegrasi Cloud Database
            </div>
          </motion.div>

          {/* Bento Card 4: Community & Tournament Ready */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-slate-800/90 hover:border-emerald-500/40 rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_0_35px_rgba(16,185,129,0.12)] flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Users size={28} />
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 font-semibold">
                  Komunitas & Korporat
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                Siap Untuk Mabar, Sparring, & Turnamen Resmi
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Fasilitas lengkap untuk menggelar kompetisi antar kantor, turnamen amatir, hingga sparring rutin. Didukung tribun penonton, scoreboard digital, dan area transit yang luas.
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="pt-8 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                <div className="text-lg sm:text-xl font-bold text-white">200+</div>
                <div className="text-xs text-slate-400">Kapasitas Tribun</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                <div className="text-lg sm:text-xl font-bold text-indigo-400">Digital</div>
                <div className="text-xs text-slate-400">Scoreboard LED</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                <div className="text-lg sm:text-xl font-bold text-emerald-400">50+ Unit</div>
                <div className="text-xs text-slate-400">Area Parkir Luas</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
