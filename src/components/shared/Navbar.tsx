'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAr = locale === 'ar';
  const otherLocale = isAr ? 'en' : 'ar';

  function switchLocale() {
    // Replace only the first segment (locale) in the path
    const segments = pathname.split('/');
    segments[1] = otherLocale;
    router.push(segments.join('/'));
  }

  const links = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/products`, label: t('nav.products') },
    { href: `/${locale}/booking`, label: t('nav.booking') },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');`}</style>

      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg overflow-hidden bg-gray-900 shrink-0 flex items-center justify-center">
                <img src="/ak-logo.png" alt="AK" className="h-7 w-auto object-contain" />
              </div>
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: '20px',
                letterSpacing: '0.5px',
                color: '#111',
              }}>
                Alaa Al Kady
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-brand-600 font-medium transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={switchLocale}
                className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:border-brand-400 hover:text-brand-600 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <Globe size={14} />
                {isAr ? 'EN' : 'عربي'}
              </button>

              {/* Book CTA */}
              <Link
                href={`/${locale}/booking`}
                className="hidden md:inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {isAr ? 'احجز موعد' : 'Book Now'}
              </Link>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 text-gray-600"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden py-3 border-t border-gray-100 flex flex-col gap-1 pb-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-brand-600 px-2 py-2.5 font-medium rounded-lg hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/booking`}
                className="mt-2 bg-brand-600 text-white text-center py-2.5 rounded-lg font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                {isAr ? 'احجز موعد' : 'Book Now'}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
