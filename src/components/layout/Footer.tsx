"use client";
import { Globe, Mail, Phone, ArrowUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-950/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div 
              onClick={scrollToTop}
              className="inline-block text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 cursor-pointer hover:opacity-90 transition-opacity"
            >
              SM Sport Center
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Venue olahraga terpadu dengan 5 lapangan berstandar internasional FIFA & BWF. 
              Sistem booking otomatis 24/7 dengan verifikasi pembayaran QRIS instan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300"
                title="WhatsApp Hotline"
              >
                <MessageSquare size={18} />
              </a>
              <a 
                href="mailto:info@smsport.com" 
                className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300"
                title="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={scrollToTop} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Home (Atas)
                </button>
              </li>
              <li>
                <a href="#jadwal" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Papan Jadwal Live
                </a>
              </li>
              <li>
                <a href="#lapangan" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Daftar Lapangan
                </a>
              </li>
              <li>
                <a href="#fasilitas" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Fasilitas & Layanan
                </a>
              </li>
              <li>
                <a href="#kontak" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Lokasi & Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Booking & Member Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Akses Layanan</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/book" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                  Booking Lapangan Futsal & Badminton →
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Login / Registrasi Member
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Cek Riwayat & E-Tiket Saya
                </Link>
              </li>
              <li>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Bantuan Customer Care 24 Jam
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} SM Sport Center. Seluruh hak cipta dilindungi undang-undang.</p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors group"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
