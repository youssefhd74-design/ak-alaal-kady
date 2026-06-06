'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Wrench, AlertTriangle, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const isAr = locale === 'ar';

  const [form, setForm] = useState({
    service_type: '' as 'maintenance' | 'malfunction' | '',
    customer_name: '',
    customer_phone: '',
    customer_area: '',
    customer_address: '',
    car_model: '',
    car_year: '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    const required = ['service_type', 'customer_name', 'customer_phone', 'customer_area', 'customer_address', 'car_model', 'preferred_date'];
    const missing = required.filter((k) => !form[k as keyof typeof form]);
    if (missing.length > 0) {
      toast.error(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const settingsRes = await fetch('/api/settings?key=whatsapp_number');
      const settings = await settingsRes.json();
      const waNumber = settings.value || '';

      router.push(`/${locale}/booking/confirmation?ref=${data.id}&type=appointment&wa=${waNumber}`);
    } catch {
      toast.error(isAr ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong, please try again');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">{t('booking.title')}</h1>
            <p className="text-gray-500 mt-1">{t('booking.subtitle')}</p>
          </div>

          {/* Service type */}
          <div className="card p-6 mb-5">
            <h2 className="font-bold text-gray-700 mb-4">{t('booking.serviceType')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'maintenance', icon: Wrench, titleKey: 'booking.maintenance', descKey: 'booking.maintenanceDesc' },
                { value: 'malfunction', icon: AlertTriangle, titleKey: 'booking.malfunction', descKey: 'booking.malfunctionDesc' },
              ].map(({ value, icon: Icon, titleKey, descKey }) => (
                <button
                  key={value}
                  onClick={() => setField('service_type', value)}
                  className={`border-2 rounded-xl p-4 text-start transition-all ${
                    form.service_type === value
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={20} className={form.service_type === value ? 'text-brand-600' : 'text-gray-400'} />
                    <span className="font-semibold text-gray-800">{t(titleKey as any)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{t(descKey as any)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Customer info */}
          <div className="card p-6 mb-5">
            <h2 className="font-bold text-gray-700 mb-4">{t('booking.customerInfo')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.name')} *</label>
                <input type="text" className="input-field" placeholder={t('booking.namePlaceholder')} value={form.customer_name} onChange={(e) => setField('customer_name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.phone')} *</label>
                <input type="tel" className="input-field" placeholder={t('booking.phonePlaceholder')} value={form.customer_phone} onChange={(e) => setField('customer_phone', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.area')} *</label>
                <input type="text" className="input-field" placeholder={t('booking.areaPlaceholder')} value={form.customer_area} onChange={(e) => setField('customer_area', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.address')} *</label>
                <input type="text" className="input-field" placeholder={t('booking.addressPlaceholder')} value={form.customer_address} onChange={(e) => setField('customer_address', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Car info */}
          <div className="card p-6 mb-5">
            <h2 className="font-bold text-gray-700 mb-4">{isAr ? 'بيانات السيارة' : 'Car Details'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.carModel')} *</label>
                <select className="input-field" value={form.car_model} onChange={(e) => setField('car_model', e.target.value)}>
                  <option value="">{isAr ? 'اختر الموديل' : 'Select model'}</option>
                  {['Clio', 'Logan', 'Duster', 'Symbol', 'Megane', 'Sandero', 'Fluence', 'Koleos', 'Kadjar', 'Captur', 'Talisman', 'Other'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.carYear')}</label>
                <input type="number" className="input-field" placeholder="2018" min="2000" max="2025" value={form.car_year} onChange={(e) => setField('car_year', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="card p-6 mb-5">
            <h2 className="font-bold text-gray-700 mb-4">{isAr ? 'الموعد المفضل' : 'Preferred Schedule'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={14} className="inline me-1" />
                  {t('booking.preferredDate')} *
                </label>
                <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]} value={form.preferred_date} onChange={(e) => setField('preferred_date', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock size={14} className="inline me-1" />
                  {t('booking.preferredTime')}
                </label>
                <select className="input-field" value={form.preferred_time} onChange={(e) => setField('preferred_time', e.target.value)}>
                  <option value="">{isAr ? 'أي وقت' : 'Any time'}</option>
                  {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card p-6 mb-6">
            <label className="block font-bold text-gray-700 mb-2">{t('booking.notes')}</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder={t('booking.notesPlaceholder')}
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
            />
          </div>

          {/* Delivery note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700 flex items-start gap-2">
            <span>🚗</span>
            <p>{t('booking.deliveryNote')}</p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full btn-primary py-4 text-base font-bold rounded-xl disabled:opacity-70"
          >
            {submitting ? t('common.loading') : t('booking.submitBooking')}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
