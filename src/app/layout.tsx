import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ramadan Compass | Live Suhoor & Iftar Countdown',
  description: 'Track accurate prayer times for Ramadan with automatic location detection and a live countdown to Suhoor and Iftar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-900 text-slate-100 selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  );
}
