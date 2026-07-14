import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactSection() {
  return (
      <section id="kontak" className="py-20 bg-slate-950 relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-4xl font-bold mb-6">Hubungi <span className="text-emerald-400">Kami</span></h2>
              <p className="text-slate-400 mb-10">Punya pertanyaan seputar fasilitas atau ingin mengadakan turnamen? Tim kami siap membantu Anda kapan saja.</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-emerald-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Alamat Sport Center</h4>
                    <p className="text-slate-400">Jl. Olahraga No. 88, Senayan, Jakarta Selatan, 12190</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-emerald-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Telepon & WhatsApp</h4>
                    <p className="text-slate-400">+62 812 3456 7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-emerald-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Email Informasi</h4>
                    <p className="text-slate-400">info@smsport.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-6">Kirim Pesan Cepat</h3>
                <form className="space-y-4">
                  <div>
                    <input type="text" placeholder="Nama Lengkap" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <input type="email" placeholder="Alamat Email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <textarea placeholder="Pesan Anda" rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"></textarea>
                  </div>
                  <button className="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}
