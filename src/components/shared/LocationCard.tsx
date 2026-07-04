'use client';

import { useLocale } from 'next-intl';
import { MapPin, Navigation, Clock } from 'lucide-react';

const MAPS_LINK = 'https://maps.app.goo.gl/WpmJwyryEGuUgZ8w9';
const LAT = 29.9872445;
const LNG = 31.284839;

export default function LocationCard() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <section className="py-14 px-4 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-2 justify-center">
          <MapPin size={20} className="text-brand-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {isAr ? 'موقعنا' : 'Our Location'}
          </h2>
        </div>
        <p className="text-center text-gray-500 text-sm mb-8">
          {isAr ? 'قم بزيارتنا أو احصل على الاتجاهات مباشرة' : 'Visit us or get directions directly'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Static map card — pure CSS/SVG, cannot fail */}
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 min-h-[280px] group block"
            style={{
              background: 'linear-gradient(135deg, #1a2744 0%, #16213e 100%)',
            }}
          >
            {/* Decorative map grid */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
              {/* Grid lines — like map roads */}
              {[40, 80, 120, 160, 200, 240].map(y => (
                <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
              ))}
              {[60, 120, 180, 240, 300, 360].map(x => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="280" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
              ))}
              {/* Main "roads" */}
              <line x1="0" y1="140" x2="400" y2="120" stroke="rgba(234,88,12,0.25)" strokeWidth="3" />
              <line x1="200" y1="0" x2="220" y2="280" stroke="rgba(234,88,12,0.2)" strokeWidth="3" />
              <line x1="0" y1="200" x2="400" y2="230" stroke="rgba(148,163,184,0.15)" strokeWidth="2" />

              {/* Location pin at center */}
              <g transform="translate(200, 130)">
                {/* Pulse rings */}
                <circle cx="0" cy="0" r="30" fill="rgba(234,88,12,0.1)">
                  <animate attributeName="r" values="20;40;20" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
                {/* Pin */}
                <path d="M 0 -22 C -12 -22 -20 -13 -20 -2 C -20 10 0 22 0 22 C 0 22 20 10 20 -2 C 20 -13 12 -22 0 -22 Z"
                  fill="#ea580c" stroke="#fff" strokeWidth="2" />
                <circle cx="0" cy="-2" r="7" fill="#fff" />
              </g>
            </svg>

            {/* Label overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
              <div className="bg-white/95 backdrop-blur px-5 py-3 rounded-xl shadow-lg text-center">
                <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5 justify-center">
                  <MapPin size={14} className="text-brand-600" />
                  {isAr ? 'أولاد القاضي' : 'Awlad El Kady'}
                </p>
                <p className="text-xs text-brand-600 font-medium mt-1 flex items-center gap-1 justify-center">
                  <Navigation size={11} />
                  {isAr ? 'اضغط لفتح الخريطة' : 'Tap to open map'}
                </p>
              </div>
            </div>
          </a>

          {/* Info */}
          <div className="flex flex-col justify-center gap-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-brand-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-0.5">
                  {isAr ? 'أولاد القاضي' : 'Awlad El Kady'}
                </p>
                <p className="text-sm text-gray-500">
                  {isAr ? 'القاهرة، مصر' : 'Cairo, Egypt'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={20} className="text-brand-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-0.5">
                  {isAr ? 'ساعات العمل' : 'Working Hours'}
                </p>
                <p className="text-sm text-gray-500">
                  {isAr ? 'السبت - الخميس: 9 صباحاً - 6 مساءً' : 'Sat - Thu: 9 AM - 6 PM'}
                </p>
              </div>
            </div>

            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3.5 rounded-xl transition-colors mt-2"
            >
              <Navigation size={18} />
              {isAr ? 'احصل على الاتجاهات' : 'Get Directions'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
