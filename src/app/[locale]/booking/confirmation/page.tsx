'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import { CheckCircle, MessageCircle, Home, AlertCircle } from 'lucide-react';

export default function ConfirmationPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useSearchParams();
  const isAr = locale === 'ar';

  const ref = params.get('ref') || '';
  const type = params.get('type') || 'order';
  const waNumber = params.get('wa') || '';

  const shortRef = ref.split('-')[0].toUpperCase();

  function openWhatsApp() {
    if (!waNumber) return;
    const message = isAr
      ? `مرحباً، لدي ${type === 'order' ? 'طلب' : 'موعد'} برقم مرجعي: ${shortRef}. أرجو التأكيد.`
      : `Hello, I have a ${type === 'order' ? 'order' : 'booking'} with reference: ${shortRef}. Please confirm.`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Success card */}
          <div className="card p-8 text-center">
            <div className="flex justify-center mb-5">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle size={48} className="text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {t('orderConfirm.title')}
            </h1>
            <p className="text-gray-500 mb-5 leading-relaxed">
              {t('orderConfirm.message')}
            </p>

            {/* Reference number */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
              <p className="text-xs text-gray-400 mb-1">{t('orderConfirm.orderRef')}</p>
              <p className="text-2xl font-bold tracking-widest text-brand-700">{shortRef}</p>
            </div>

            {/* Important notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3 text-start">
              <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-800 mb-0.5">{t('orderConfirm.important')}</p>
                <p className="text-sm text-orange-700">{t('orderConfirm.importantNote')}</p>
              </div>
            </div>

            {/* WhatsApp button */}
            {waNumber && (
              <button
                onClick={openWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-colors mb-3 text-base"
              >
                <MessageCircle size={20} />
                {t('orderConfirm.whatsappBtn')}
              </button>
            )}

            {!waNumber && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-3 text-sm text-yellow-700">
                {isAr ? 'سيتواصل معك الفريق قريباً على رقم الهاتف المسجل' : 'Our team will contact you soon on your registered phone number'}
              </div>
            )}

            <Link
              href={`/${locale}`}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-xl transition-colors"
            >
              <Home size={18} />
              {t('orderConfirm.homeBtn')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
