import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'All topics | English Listening Exercises',
  description: 'Online dictation exercises for learners to improve English listening skills quickly. All levels from basic, intermediate to advanced. 100% Free.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f9f9f9] text-[#212529] font-sans antialiased">
        <nav className="bg-[#f8f9fa] border-b border-[#dee2e6] py-2">
          <div className="mx-auto px-4 w-full max-w-[1140px]">
            <Link href="/" className="flex items-center py-[2px] text-decoration-none">
              <span className="text-[#000000] text-[23.2px] font-semibold tracking-normal" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                DailyDictation
              </span>
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
