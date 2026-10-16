"use client";
import HeroSection from '../src/components/home/HeroSection';
import FeaturesSection from '../src/components/home/FeaturesSection';
import FacilitiesSection from '../src/components/home/FacilitiesSection';
import CourtsSection from '../src/components/home/CourtsSection';
import ScheduleSection from '../src/components/home/ScheduleSection';
import ContactSection from '../src/components/home/ContactSection';

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px]" />
        {/* Mid right glow */}
        <div className="absolute top-[35%] -right-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px]" />
        {/* Mid left glow */}
        <div className="absolute top-[60%] -left-40 w-[550px] h-[550px] bg-emerald-600/10 rounded-full blur-[160px]" />
        {/* Bottom glow */}
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
        {/* Subtle dot matrix pattern */}
        <div 
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 10%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 10%, #000 60%, transparent 100%)'
          }}
        />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <ScheduleSection />
        <FeaturesSection />
        <FacilitiesSection />
        <CourtsSection />
        <ContactSection />
      </div>
    </main>
  );
}
