'use client';

import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import { MessageCircle, Home, Shield, Clock, CheckCircle } from 'lucide-react';

export default function ConfirmationPage() {
  const locale = useLocale();
  const params = useSearchParams();
  const isAr = locale === 'ar';

  const ref = params.get('ref') || '';
  const type = params.get('type') || 'appointment';
  const waNumber = params.get('wa') || '';
  const shortRef = ref.split('-')[0].toUpperCase();

  function openWhatsApp() {
    if (!waNumber) return;
    const message = isAr
      ? `مرحباً، قمت بحجز موعد برقم مرجعي: ${shortRef}. أرجو التأكيد.`
      : `Hello, I booked an appointment with reference: ${shortRef}. Please confirm.`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)' }}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">

          {/* Animated check */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(234,88,12,0.15)', border: '2px solid rgba(234,88,12,0.4)' }}>
                <CheckCircle size={48} className="text-brand-500" />
              </div>
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full animate-ping"
                style={{ background: 'rgba(234,88,12,0.1)', animationDuration: '2s' }} />
            </div>
          </div>

          {/* Main card */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(234,88,12,0.2)', backdropFilter: 'blur(10px)' }}>

            {/* Top accent */}
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #ea580c, #f97316, #ea580c)' }} />

            <div className="p-8 text-center">
              {/* Headline */}
              <h1 className="text-2xl font-bold text-white mb-2">
                {isAr ? 'لا تقلق على سيارتك' : "Worry Less About Your Car"}
              </h1>
              <p className="text-brand-400 font-semibold text-lg mb-6">
                {isAr ? 'نحن نتكفل بها ✦' : "We've Got It Covered ✦"}
              </p>

              {/* Message */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {isAr
                  ? 'تم استلام طلبك وموعدك قيد المراجعة. سيتواصل معك فريقنا على واتساب خلال وقت قصير لتأكيد الموعد بشكل نهائي.'
                  : 'Your request has been received and your appointment is pending review. Our team will contact you on WhatsApp shortly to fully confirm your schedule.'}
              </p>

              {/* Ref number */}
              <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(234,88,12,0.1)', border: '1px solid rgba(234,88,12,0.2)' }}>
                <p className="text-xs text-gray-400 mb-1">{isAr ? 'رقم الحجز المرجعي' : 'Booking Reference'}</p>
                <p className="text-3xl font-bold tracking-widest text-brand-400">{shortRef}</p>
              </div>

              {/* Status steps */}
              <div className="flex items-center justify-center gap-2 mb-7 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                  <span className="text-gray-300">{isAr ? 'تم الاستلام' : 'Received'}</span>
                </div>
                <div className="flex-1 h-px bg-gray-600 max-w-8" />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full border border-brand-500 flex items-center justify-center">
                    <Clock size={10} className="text-brand-400" />
                  </div>
                  <span className="text-gray-400">{isAr ? 'قيد المراجعة' : 'Pending'}</span>
                </div>
                <div className="flex-1 h-px bg-gray-700 max-w-8" />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                    <Shield size={10} className="text-gray-500" />
                  </div>
                  <span className="text-gray-500">{isAr ? 'مؤكد' : 'Confirmed'}</span>
                </div>
              </div>

              {/* WhatsApp button */}
              {waNumber ? (
                <button
                  onClick={openWhatsApp}
                  className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-colors mb-3 text-base text-white"
                  style={{ background: '#25D366' }}
                >
                  <MessageCircle size={20} />
                  {isAr ? 'تواصل معنا على واتساب' : 'Contact Us on WhatsApp'}
                </button>
              ) : (
                <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-xl p-3 mb-3 text-sm text-yellow-300">
                  {isAr ? 'سيتواصل معك الفريق على رقم هاتفك المسجل' : 'Our team will contact you on your registered number'}
                </div>
              )}

              <Link
                href={`/${locale}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Home size={16} />
                {isAr ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-center text-gray-600 text-xs mt-6">
            {isAr ? 'AK - Alaa Al Kady · متخصصون في رينو' : 'AK - Alaa Al Kady · Renault Specialists'}
          </p>
        </div>
      </main>
    </div>
  );
}
