"use client";
import { Globe, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-bold text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] cursor-pointer hover:text-emerald-400 transition-colors"
            >
              SM Sport Center
            </span>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Fasilitas olahraga premium untuk menunjang performa dan semangat juara Anda.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Tautan Cepat</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Bantuan / FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Ikuti Kami</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 hover:shadow-[0_0_12px_rgba(16,185,129,0.4)]"><Globe size={20} /></a>
              <a href="#" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 hover:shadow-[0_0_12px_rgba(16,185,129,0.4)]"><Mail size={20} /></a>
              <a href="#" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 hover:shadow-[0_0_12px_rgba(16,185,129,0.4)]"><Phone size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-900 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SM Sport Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
