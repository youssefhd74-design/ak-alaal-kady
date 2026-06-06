'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import CarDiagram from '@/components/storefront/CarDiagram';
import { Wrench, AlertTriangle, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingPage() {
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
    if (required.some((k) => !(form as any)[k])) {
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
      router.push(`/${locale}/booking/confirmation?ref=${data.id}&type=appointment&wa=${settings.value || ''}`);
    } catch {
      toast.error(isAr ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {isAr ? 'احجز موعدك' : 'Book Your Appointment'}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {isAr ? 'اختر نوع الخدمة وأدخل بياناتك' : 'Choose your service type and enter your details'}
            </p>
          </div>

          {/* Car Diagram */}
          <div className="card mb-5 overflow-hidden bg-gray-900 px-4 pt-2 pb-4">
            <CarDiagram serviceType={form.service_type} />
          </div>

          {/* Service type */}
          <div className="card p-6 mb-5">
            <h2 className="font-bold text-gray-700 mb-4">
              {isAr ? 'نوع الخدمة' : 'Service Type'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'maintenance', icon: Wrench, title: isAr ? 'صيانة دورية' : 'Regular Maintenance', desc: isAr ? 'تغيير زيت، فلاتر، إطارات، وغيرها' : 'Oil change, filters, tires, and more' },
                { value: 'malfunction', icon: AlertTriangle, title: isAr ? 'عطل أو مشكلة' : 'Malfunction / Issue', desc: isAr ? 'تشخيص وإصلاح الأعطال' : 'Diagnosis and repair of faults' },
              ].map(({ value, icon: Icon, title, desc }) => (
                <button
                  key={value}
                  onClick={() => setField('service_type', value)}
                  className={`border-2 rounded-xl p-4 text-start transition-all ${
                    form.service_type === value
                      ? value === 'maintenance' ? 'border-brand-500 bg-brand-50' : 'border-red-400 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <Icon size={18} className={form.service_type === value
                      ? value === 'maintenance' ? 'text-brand-600' : 'text-red-500'
                      : 'text-gray-400'} />
                    <span className="font-semibold text-gray-800">{title}</span>
                  </div>
                  <p className="text-sm text-gray-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Customer info */}
          <div className="card p-6 mb-5">
            <h2 className="font-bold text-gray-700 mb-4">
              {isAr ? 'بيانات العميل' : 'Customer Information'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'الاسم الكامل *' : 'Full Name *'}</label>
                <input type="text" className="input-field" placeholder={isAr ? 'أدخل اسمك الكامل' : 'Enter your full name'} value={form.customer_name} onChange={(e) => setField('customer_name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'رقم الهاتف *' : 'Phone Number *'}</label>
                <input type="tel" className="input-field" placeholder="01xxxxxxxxx" value={form.customer_phone} onChange={(e) => setField('customer_phone', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'المنطقة / الحي *' : 'Area / District *'}</label>
                <input type="text" className="input-field" placeholder={isAr ? 'مثال: المعادي، مدينة نصر' : 'e.g. Maadi, Nasr City'} value={form.customer_area} onChange={(e) => setField('customer_area', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'العنوان التفصيلي *' : 'Detailed Address *'}</label>
                <input type="text" className="input-field" placeholder={isAr ? 'الشارع، المبنى، الشقة' : 'Street, building, apartment'} value={form.customer_address} onChange={(e) => setField('customer_address', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Car info */}
          <div className="card p-6 mb-5">
            <h2 className="font-bold text-gray-700 mb-4">
              {isAr ? 'بيانات السيارة' : 'Car Details'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'موديل السيارة *' : 'Car Model *'}</label>
                <select className="input-field" value={form.car_model} onChange={(e) => setField('car_model', e.target.value)}>
                  <option value="">{isAr ? 'اختر الموديل' : 'Select model'}</option>
                  {['Clio', 'Logan', 'Duster', 'Symbol', 'Megane', 'Sandero', 'Fluence', 'Koleos', 'Kadjar', 'Captur', 'Talisman', 'Other'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'سنة الصنع' : 'Year'}</label>
                <input type="number" className="input-field" placeholder="2018" min="2000" max="2025" value={form.car_year} onChange={(e) => setField('car_year', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="card p-6 mb-5">
            <h2 className="font-bold text-gray-700 mb-4">
              {isAr ? 'الموعد المفضل' : 'Preferred Schedule'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={13} className="inline me-1" />
                  {isAr ? 'التاريخ المفضل *' : 'Preferred Date *'}
                </label>
                <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]} value={form.preferred_date} onChange={(e) => setField('preferred_date', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock size={13} className="inline me-1" />
                  {isAr ? 'الوقت المفضل' : 'Preferred Time'}
                </label>
                <select className="input-field" value={form.preferred_time} onChange={(e) => setField('preferred_time', e.target.value)}>
                  <option value="">{isAr ? 'أي وقت' : 'Any time'}</option>
                  {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card p-6 mb-6">
            <label className="block font-bold text-gray-700 mb-2">
              {isAr ? 'ملاحظات إضافية' : 'Additional Notes'}
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder={isAr ? 'صف المشكلة أو أي تفاصيل مهمة...' : 'Describe the issue or any important details...'}
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
            />
          </div>

          {/* Delivery note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700 flex items-start gap-2">
            <span>🚗</span>
            <p>{isAr ? 'خدمة التوصيل متاحة في مناطق محددة' : 'Delivery service available in select areas'}</p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full btn-primary py-4 text-base font-bold rounded-xl disabled:opacity-70"
          >
            {submitting
              ? (isAr ? 'جاري الإرسال...' : 'Sending...')
              : (isAr ? 'تأكيد الحجز' : 'Confirm Booking')}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
