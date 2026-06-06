import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Wrench, ShieldCheck, Truck, Star } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm">
            <Star size={14} className="text-yellow-300" />
            <span>{locale === 'ar' ? 'الوجهة الأولى لصيانة رينو في مصر' : 'Egypt\'s #1 Renault Maintenance Destination'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {t('home.hero')}
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            {t('home.heroSub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/products`}
              className="bg-white text-brand-700 hover:bg-orange-50 font-bold px-8 py-3.5 rounded-xl transition-colors text-lg"
            >
              {t('home.shopBtn')}
            </Link>
            <Link
              href={`/${locale}/booking`}
              className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-3.5 rounded-xl transition-colors text-lg"
            >
              {t('home.bookBtn')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
            {t('home.whyUs')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, titleKey: 'feat1Title', descKey: 'feat1Desc', color: 'text-green-600 bg-green-50' },
              { icon: Wrench, titleKey: 'feat2Title', descKey: 'feat2Desc', color: 'text-brand-600 bg-brand-50' },
              { icon: Truck, titleKey: 'feat3Title', descKey: 'feat3Desc', color: 'text-blue-600 bg-blue-50' },
            ].map(({ icon: Icon, titleKey, descKey, color }) => (
              <div key={titleKey} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${color}`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {t(`home.${titleKey}` as any)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t(`home.${descKey}` as any)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-50 border-y border-brand-100 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-brand-800 mb-3">
            {locale === 'ar' ? 'احجز موعدك اليوم' : 'Book Your Appointment Today'}
          </h2>
          <p className="text-brand-600 mb-6">
            {locale === 'ar'
              ? 'صيانة دورية أو إصلاح عطل — نحن هنا لمساعدتك'
              : 'Regular maintenance or a malfunction fix — we are here to help'}
          </p>
          <Link
            href={`/${locale}/booking`}
            className="btn-primary inline-flex items-center gap-2 text-base"
          >
            <Wrench size={18} />
            {t('home.bookBtn')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
