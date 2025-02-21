'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const noNavbarRoutes = ['/sign-in', '/sign-up', '/'];
 
  return (
    <html lang="en">
      <ClerkProvider>
          <body>
            {!noNavbarRoutes.includes(pathname) && <Navbar />}
            {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
