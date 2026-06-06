import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AK - Alaal Kady | متخصصون في رينو',
  description: 'قطع غيار وصيانة سيارات رينو - AK Alaal Kady',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
