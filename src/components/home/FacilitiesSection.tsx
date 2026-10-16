"use client";
import { motion } from 'framer-motion';
import { Coffee, Wifi, Store, Car, ShowerHead, Compass } from 'lucide-react';

const facilities = [
  {
    icon: Coffee,
    title: "Kantin & Athlete Lounge",
    desc: "Area santai ber-AC dengan sofa nyaman, minuman isotonik dingin, kopi segar, dan TV siaran olahraga langsung.",
    badge: "Full AC & TV Sports",
    color: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400"
  },
  {
    icon: Wifi,
    title: "Wi-Fi High Speed 100 Mbps",
    desc: "Akses internet gratis berkecepatan tinggi di seluruh area venue untuk livestream pertandingan maupun kerja.",
    badge: "Free Unlimited",
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400"
  },
  {
    icon: Store,
    title: "Sewa Perlengkapan Pro",
    desc: "Penyewaan raket Yonex & Li-Ning, shuttlecock standar turnamen, bola futsal resmi, serta rompi tim yang higienis.",
    badge: "Original Brands",
    color: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400"
  },
  {
    icon: ShowerHead,
    title: "Shower Air Panas & Loker",
    desc: "Kamar bilas bersih dengan water heater bertekanan tinggi, serta fasilitas loker berkunci aman untuk menyimpan barang.",
    badge: "Hot Water & Clean",
    color: "from-teal-500/20 to-emerald-500/10",
    iconColor: "text-teal-400"
  },
  {
    icon: Car,
    title: "Parkir Luas & Keamanan 24 Jam",
    desc: "Lahan parkir memadai untuk 50+ mobil dan 100+ motor, dijaga petugas keamanan profesional dan terpantau kamera CCTV.",
    badge: "CCTV & Security 24/7",
    color: "from-indigo-500/20 to-purple-500/10",
    iconColor: "text-indigo-400"
  },
  {
    icon: Compass,
    title: "Musholla & Ruang Ganti Luas",
    desc: "Tempat ibadah yang tenang, bersih, wangi dengan sarana wudhu higienis serta ruang ganti terpisah pria dan wanita.",
    badge: "Nyaman & Higienis",
    color: "from-emerald-500/20 to-green-500/10",
    iconColor: "text-emerald-400"
  }
];

export default function FacilitiesSection() {
  return (
    <section id="fasilitas" className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4"
          >
            VENUE AMENITIES
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Fasilitas Penunjang <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Lengkap & Terawat</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl"
          >
            Kenyamanan Anda adalah prioritas kami. Nikmati berbagai fasilitas berkelas hotel untuk mendukung pengalaman bermain olahraga Anda.
          </motion.p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/40 p-7 rounded-3xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${item.color} border border-slate-700/60 flex items-center justify-center p-3 group-hover:scale-110 transition-transform`}>
                    <item.icon size={26} className={item.iconColor} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 bg-slate-950/70 border border-slate-800 px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-800/60 flex items-center text-xs text-emerald-400 font-medium">
                <span>Tersedia untuk semua member</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
