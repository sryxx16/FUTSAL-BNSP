"use client";
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
export default function ContactSection() {
  return (
      <section id="kontak" className="py-20 bg-slate-950 relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h2 className="text-4xl font-bold mb-6">Hubungi <span className="text-emerald-400">Kami</span></h2>
              <p className="text-slate-400 mb-12">Punya pertanyaan seputar fasilitas atau ingin mengadakan turnamen? Tim kami siap membantu Anda kapan saja.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="flex flex-col items-center text-center p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 mb-4">
                    <MapPin size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Alamat</h3>
                  <p className="text-slate-400 text-sm">Jl. Olahraga No. 88, Senayan, Jakarta Selatan</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 mb-4">
                    <Phone size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Telepon</h3>
                  <p className="text-slate-400 text-sm">+62 812 3456 7890</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 mb-4">
                    <Mail size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                  <p className="text-slate-400 text-sm">info@smsport.com</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}
