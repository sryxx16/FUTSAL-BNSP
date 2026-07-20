
import './globals.css';
import ClientLayoutWrapper from './ClientLayoutWrapper';

export const metadata = {
  title: 'SM Sport - Booking Futsal & Badminton',
  description: 'Sistem Reservasi Lapangan Olahraga SM Sport',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 overflow-x-hidden flex flex-col">
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </div>
      </body>
    </html>
  );
}
