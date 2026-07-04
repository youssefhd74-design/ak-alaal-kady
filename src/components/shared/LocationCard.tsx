'use client';

import { useLocale } from 'next-intl';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';

const MAPS_LINK = 'https://maps.app.goo.gl/WpmJwyryEGuUgZ8w9';
const LAT = 29.9872445;
const LNG = 31.284839;

export default function LocationCard() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  // Static map embed via OpenStreetMap (no API key needed)
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${LNG - 0.008}%2C${LAT - 0.005}%2C${LNG + 0.008}%2C${LAT + 0.005}&layer=mapnik&marker=${LAT}%2C${LNG}`;

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
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 min-h-[280px]">
            <iframe
              src={embedUrl}
              className="w-full h-full min-h-[280px]"
              style={{ border: 0 }}
              loading="lazy"
              title="AK Location Map"
            />
          </div>

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

            {/* Get directions button */}
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
