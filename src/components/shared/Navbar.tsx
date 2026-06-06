'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAr = locale === 'ar';
  const otherLocale = isAr ? 'en' : 'ar';

  function switchLocale() {
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
    router.push(newPath);
  }

  const links = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/products`, label: t('nav.products') },
    { href: `/${locale}/booking`, label: t('nav.booking') },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');`}</style>

      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-3">
              {/* AK Logo — show only the AK monogram */}
              <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-900 shrink-0 flex items-center justify-center">
                <img
                  src="/ak-logo.png"
                  alt="AK Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              {/* Brand name */}
              <div className="flex flex-col leading-none">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 700,
                    fontSize: '19px',
                    letterSpacing: '0.5px',
                    color: '#111',
                    lineHeight: 1.1,
                  }}
                >
                  Alaa Al Kady
                </span>
                <span className="text-xs text-gray-400 mt-0.5">
                  {isAr ? 'متخصصون في رينو' : 'Renault Specialists'}
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-brand-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button
                onClick={switchLocale}
                className="border border-brand-300 text-brand-700 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                {t('common.lang')}
              </button>
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
            <div className="md:hidden py-3 border-t border-gray-100 flex flex-col gap-2 pb-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-brand-600 px-2 py-2 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
