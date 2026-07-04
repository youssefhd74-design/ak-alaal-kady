'use client';

import { useLocale } from 'next-intl';
import { MapPin, Navigation, Clock } from 'lucide-react';

const BRANCHES = [
  {
    nameAr: 'فرع المعادي',
    nameEn: 'Maadi Branch',
    areaAr: 'المعادي، القاهرة',
    areaEn: 'Maadi, Cairo',
    mapsLink: 'https://maps.app.goo.gl/WpmJwyryEGuUgZ8w9',
  },
  {
    nameAr: 'فرع المنصورية',
    nameEn: 'Al Mansoreya Branch',
    areaAr: 'المنصورية، الجيزة',
    areaEn: 'Al Mansoreya, Giza',
    mapsLink: 'https://maps.app.goo.gl/eWp6aQTRRxZw46on8',
  },
];

function BranchMap({ branch, isAr }: { branch: typeof BRANCHES[0]; isAr: boolean }) {
  return (
    <a
      href={branch.mapsLink}
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 min-h-[220px] group block"
      style={{ background: 'linear-gradient(135deg, #1a2744 0%, #16213e 100%)' }}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
        {[40, 80, 120, 160, 200].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
        ))}
        {[60, 120, 180, 240, 300, 360].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="220" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
        ))}
        <line x1="0" y1="110" x2="400" y2="95" stroke="rgba(234,88,12,0.25)" strokeWidth="3" />
        <line x1="200" y1="0" x2="215" y2="220" stroke="rgba(234,88,12,0.2)" strokeWidth="3" />
        <line x1="0" y1="160" x2="400" y2="185" stroke="rgba(148,163,184,0.15)" strokeWidth="2" />

        <g transform="translate(200, 100)">
          <circle cx="0" cy="0" r="26" fill="rgba(234,88,12,0.1)">
            <animate attributeName="r" values="18;36;18" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <path d="M 0 -20 C -11 -20 -18 -12 -18 -2 C -18 9 0 20 0 20 C 0 20 18 9 18 -2 C 18 -12 11 -20 0 -20 Z"
            fill="#ea580c" stroke="#fff" strokeWidth="2" />
          <circle cx="0" cy="-2" r="6" fill="#fff" />
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-5">
        <div className="bg-white/95 backdrop-blur px-4 py-2.5 rounded-xl shadow-lg text-center">
          <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5 justify-center">
            <MapPin size={14} className="text-brand-600" />
            {isAr ? branch.nameAr : branch.nameEn}
          </p>
          <p className="text-xs text-brand-600 font-medium mt-1 flex items-center gap-1 justify-center">
            <Navigation size={11} />
            {isAr ? 'اضغط لفتح الخريطة' : 'Tap to open map'}
          </p>
        </div>
      </div>
    </a>
  );
}

export default function LocationCard() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <section className="py-14 px-4 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-2 justify-center">
          <MapPin size={20} className="text-brand-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {isAr ? 'فروعنا' : 'Our Branches'}
          </h2>
        </div>
        <p className="text-center text-gray-500 text-sm mb-8">
          {isAr ? 'زورونا في أقرب فرع أو احصل على الاتجاهات مباشرة' : 'Visit your nearest branch or get directions directly'}
        </p>

        {/* Working hours banner */}
        <div className="flex items-center justify-center gap-2 mb-8 text-sm text-gray-600 bg-brand-50 border border-brand-100 rounded-xl py-3 px-4 max-w-md mx-auto">
          <Clock size={16} className="text-brand-600" />
          <span className="font-medium">
            {isAr ? 'السبت - الخميس: 9 صباحاً - 6 مساءً' : 'Sat - Thu: 9 AM - 6 PM'}
          </span>
        </div>

        {/* Two branches side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {BRANCHES.map((branch) => (
            <div key={branch.nameEn} className="flex flex-col gap-4">
              <BranchMap branch={branch} isAr={isAr} />
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      {isAr ? branch.nameAr : branch.nameEn}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isAr ? branch.areaAr : branch.areaEn}
                    </p>
                  </div>
                </div>
                <a
                  href={branch.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
                >
                  <Navigation size={14} />
                  {isAr ? 'اتجاهات' : 'Directions'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
