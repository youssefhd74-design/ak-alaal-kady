import { useTranslations, useLocale } from 'next-intl';
import { Wrench, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-brand-600 text-white rounded-lg p-1.5">
                <Wrench size={18} />
              </div>
              <span className="font-bold text-white text-lg">AK - Alaal Kady</span>
            </div>
            <p className="text-sm text-gray-400">
              {locale === 'ar'
                ? 'متخصصون في صيانة سيارات رينو بقطع غيار أصلية'
                : 'Specialists in Renault car maintenance with genuine parts'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href={`/${locale}`} className="hover:text-brand-400 transition-colors">{t('nav.home')}</a>
              <a href={`/${locale}/products`} className="hover:text-brand-400 transition-colors">{t('nav.products')}</a>
              <a href={`/${locale}/booking`} className="hover:text-brand-400 transition-colors">{t('nav.booking')}</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-brand-400 shrink-0" />
                <span>{locale === 'ar' ? 'السبت - الخميس: 9ص - 6م' : 'Sat - Thu: 9am - 6pm'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-brand-400 shrink-0" />
                <span>{locale === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
          © 2024 AK - Alaal Kady. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
