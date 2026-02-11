import { BannedCheck } from '@/components/auth/BannedCheck';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DailyDictation | English Listening Exercises',
  description: 'Online dictation exercises for learners to improve English listening skills quickly. All levels from basic, intermediate to advanced. 100% Free.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className="min-h-screen bg-background text-foreground font-body antialiased flex flex-col"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <BannedCheck />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
