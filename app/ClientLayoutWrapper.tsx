"use client";
import { usePathname } from 'next/navigation';
import Navbar from '../src/components/layout/Navbar';
import Footer from '../src/components/layout/Footer';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login';
  const isAdminPage = pathname.startsWith('/admin');
  const hideNavAndFooter = isAuthPage || isAdminPage;

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}
