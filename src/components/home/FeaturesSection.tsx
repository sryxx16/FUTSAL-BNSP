import { motion } from 'framer-motion';
import { CalendarCheck, ShieldCheck, Trophy } from 'lucide-react';

export default function FeaturesSection() {
  return (
      <section className="py-20 bg-slate-900/50 border-y border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: CalendarCheck, title: "Booking Mudah", desc: "Pesan lapangan kapan saja 24/7 melalui sistem real-time kami." },
              { icon: Trophy, title: "Standar Pro", desc: "Lapangan dengan material premium dan pencahayaan standar BWF/FIFA." },
              { icon: ShieldCheck, title: "Aman & Nyaman", desc: "Keamanan terjamin, parkir luas, dan fasilitas kebersihan terawat." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-300">
                  <feature.icon className="text-emerald-500" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  );
}
