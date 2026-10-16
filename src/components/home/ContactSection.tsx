"use client";
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ContactSection() {
  return (
    <section id="kontak" className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* High-Converting Pre-Footer CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/60 via-slate-900/90 to-teal-900/50 border border-emerald-500/30 p-8 sm:p-12 lg:p-16 shadow-[0_0_50px_rgba(16,185,129,0.15)]"
        >
          {/* Ambient Glows inside banner */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
              <ShieldCheck size={14} /> SLOT TERBATAS TIAP HARI
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Siap Bertanding Malam Ini <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
                Bersama Tim Juara Anda?
              </span>
            </h2>

            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              Jangan sampai kehabisan slot prime time malam (18:00 - 23:00). Amankan lapangan Anda sekarang dalam waktu kurang dari 1 menit.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/book"
                className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-base shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Pesan Lapangan Sekarang</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a 
                href="https://wa.me/6281234567890?text=Halo%20Admin%20SM%20Sport,%20saya%20ingin%20tanya%20seputar%20booking%20lapangan" 
                target="_blank"
                rel="noreferrer"
                className="px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/40 text-slate-200 hover:text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} className="text-emerald-400" />
                <span>Chat WhatsApp Admin</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Venue Information & Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Venue Location & Operating Hours */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div>
                  <h3 className="text-2xl font-bold text-white">Lokasi SM Sport Center</h3>
                  <p className="text-slate-400 text-sm mt-1">Akses strategis di pusat kota dengan fasilitas parkir nyaman.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin size={24} />
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-400 shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alamat Lengkap</div>
                    <p className="text-slate-200 text-sm sm:text-base font-medium mt-1">
                      Jl. Olahraga No. 88, Kawasan Gelora Senayan, Kebayoran Baru, Jakarta Selatan 12190
                    </p>
                    <a 
                      href="https://maps.google.com/?q=Senayan+Jakarta" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold mt-2 transition-colors"
                    >
                      Buka Petunjuk Arah di Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-teal-400 shrink-0 mt-0.5">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jam Operasional Lapangan</div>
                    <p className="text-slate-200 text-sm sm:text-base font-medium mt-1">
                      Senin - Minggu: <span className="text-emerald-400 font-bold">08:00 - 24:00 WIB</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Sistem booking online terbuka 24 jam nonstop.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a 
                href="tel:+6281234567890" 
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-colors"
              >
                <Phone size={18} className="text-emerald-400" />
                <div className="text-left">
                  <div className="text-[11px] text-slate-400">Telepon Hotline</div>
                  <div className="text-xs font-semibold text-slate-200">+62 812-3456-7890</div>
                </div>
              </a>

              <a 
                href="mailto:info@smsport.com" 
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-colors"
              >
                <Mail size={18} className="text-emerald-400" />
                <div className="text-left">
                  <div className="text-[11px] text-slate-400">Email Resmi</div>
                  <div className="text-xs font-semibold text-slate-200">info@smsport.com</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Special Booking Info (Corporate & Tournament) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                LAYANAN KHUSUS
              </span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-4">
                Sewa Rutin & Turnamen
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Ingin mengadakan turnamen antar-kantor, kompetisi komunitas, atau mengunci jadwal main rutin mingguan (member tetap)? Kami siap membantu paket khusus.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-sm font-semibold text-white">🏆 Paket Turnamen Lengkap</div>
                  <div className="text-xs text-slate-400 mt-1">Sewa multi-lapangan, sound system, wasit bersertifikat, dan area podium.</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-sm font-semibold text-white">🗓️ Member Slot Rutin Mingguan</div>
                  <div className="text-xs text-slate-400 mt-1">Amankan jam prime time tim Anda setiap minggu dengan harga bundling hemat.</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <a 
                href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20konsultasi%20paket%20turnamen%20atau%20member%20rutin"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-500 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <MessageSquare size={16} />
                <span>Konsultasi Turnamen via WhatsApp</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
