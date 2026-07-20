"use client";
import HeroSection from '../src/components/home/HeroSection';
import FeaturesSection from '../src/components/home/FeaturesSection';
import FacilitiesSection from '../src/components/home/FacilitiesSection';
import CourtsSection from '../src/components/home/CourtsSection';
import ScheduleSection from '../src/components/home/ScheduleSection';
import ContactSection from '../src/components/home/ContactSection';

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-5%] w-[30rem] h-[30rem] bg-emerald-800/10 rounded-full blur-[120px]"></div>
      </div>

      <HeroSection />
      <ScheduleSection />
      <FeaturesSection />
      <FacilitiesSection />
      <CourtsSection />
      <ContactSection />
    </main>
  );
}
