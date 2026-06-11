'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import CarDiagram from '@/components/storefront/CarDiagram';
import {
  Wrench, AlertTriangle, Calendar, Clock, User, Phone,
  MapPin, Car, FileText, CheckCircle, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const RENAULT_MODELS = [
  'Clio', 'Logan', 'Duster', 'Symbol', 'Megane',
  'Sandero', 'Fluence', 'Koleos', 'Kadjar', 'Captur', 'Talisman', 'Other'
];

const TIME_SLOTS = [
  '9:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'
];

// Floating label input
function FloatingInput({
  label, value, onChange, type = 'text', placeholder = ' ', icon: Icon
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; icon?: any;
}) {
  return (
    <div className="relative group">
      <div className="relative flex items-center">
        {Icon && (
          <Icon size={15} className="absolute start-3.5 text-gray-400 pointer-events-none z-10" />
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder=" "
          className="peer w-full rounded-xl bg-gray-50 border-0 pt-5 pb-2 px-4 ps-10 text-sm text-gray-800
            focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white
            transition-all shadow-sm focus:shadow-md placeholder-transparent"
          style={{ paddingInlineStart: Icon ? '2.5rem' : '1rem' }}
        />
        <label className="absolute start-10 top-1.5 text-xs text-gray-400 font-medium
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
          peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-brand-500
          transition-all pointer-events-none"
          style={{ insetInlineStart: Icon ? '2.5rem' : '1rem' }}>
          {label}
        </label>
      </div>
    </div>
  );
}

function FloatingSelect({
  label, value, onChange, options, icon: Icon
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; icon?: any;
}) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className="absolute start-3.5 top-4 text-gray-400 pointer-events-none z-10" />}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl bg-gray-50 border-0 pt-5 pb-2 px-4 text-sm text-gray-800
          focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white
          transition-all shadow-sm focus:shadow-md appearance-none"
        style={{ paddingInlineStart: Icon ? '2.5rem' : '1rem' }}
      >
        <option value="" disabled>{label}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <label className="absolute start-10 top-1.5 text-xs text-gray-400 font-medium pointer-events-none"
        style={{ insetInlineStart: Icon ? '2.5rem' : '1rem' }}>
        {label}
      </label>
    </div>
  );
}

export default function BookingPage() {
  const locale = useLocale();
  const router = useRouter();
  const isAr = locale === 'ar';

  const [form, setForm] = useState({
    service_type: '' as 'maintenance' | 'malfunction' | '',
    customer_name: '', customer_phone: '',
    customer_area: '', customer_address: '',
    car_model: '', car_year: '',
    preferred_date: '', preferred_time: '', notes: '',
    door_to_door: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const toggleD2D = () => setForm(p => ({ ...p, door_to_door: !p.door_to_door }));

  const summary = {
    service: form.service_type === 'maintenance'
      ? (isAr ? 'صيانة مجدولة' : 'Scheduled Maintenance')
      : form.service_type === 'malfunction'
      ? (isAr ? 'تشخيص عطل' : 'Fault Diagnosis')
      : (isAr ? 'لم يتم الاختيار' : 'Not selected'),
    car: form.car_model
      ? `${form.car_model}${form.car_year ? ` · ${form.car_year}` : ''}`
      : (isAr ? 'لم يتم الاختيار' : 'Not selected'),
    date: form.preferred_date
      ? new Date(form.preferred_date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : (isAr ? 'لم يتم الاختيار' : 'Not selected'),
    time: form.preferred_time || (isAr ? 'أي وقت' : 'Any time'),
    name: form.customer_name || (isAr ? '—' : '—'),
    area: form.customer_area || (isAr ? '—' : '—'),
  };

  const completeness = [
    form.service_type, form.car_model, form.preferred_date,
    form.customer_name, form.customer_phone, form.customer_area, form.customer_address
  ].filter(Boolean).length;
  const progress = Math.round((completeness / 7) * 100);

  async function handleSubmit() {
    const required = ['service_type','customer_name','customer_phone','customer_area','customer_address','car_model','preferred_date'];
    if (required.some(k => !(form as any)[k])) {
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
      const s = await fetch('/api/settings?key=whatsapp_number');
      const { value: wa } = await s.json();
      router.push(`/${locale}/booking/confirmation?ref=${data.id}&type=appointment&wa=${wa || ''}`);
    } catch {
      toast.error(isAr ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isAr ? 'احجز موعد صيانة' : 'Book a Service Appointment'}
            </h1>
            <p className="text-gray-500 mt-2">
              {isAr
                ? 'خبراء رينو في خدمتك — اختر الخدمة وأكمل البيانات'
                : 'Renault experts at your service — select your service and complete your details'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>{isAr ? 'اكتمال الطلب' : 'Booking completeness'}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Main 2-col layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT: Form ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Car Diagram */}
              <div className="rounded-2xl overflow-hidden bg-gray-900 px-4 pt-2 pb-4">
                <CarDiagram serviceType={form.service_type} />
              </div>

              {/* Service Type */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-600 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                  {isAr ? 'نوع الخدمة' : 'Service Type'}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: 'maintenance',
                      icon: Wrench,
                      title: isAr ? 'صيانة مجدولة' : 'Scheduled Maintenance',
                      desc: isAr ? 'زيت · فلاتر · إطارات · فحص دوري' : 'Oil · Filters · Tires · Inspection',
                      color: 'brand',
                    },
                    {
                      value: 'malfunction',
                      icon: AlertTriangle,
                      title: isAr ? 'تشخيص عطل' : 'Fault Diagnosis',
                      desc: isAr ? 'تشخيص وإصلاح الأعطال الطارئة' : 'Diagnose & fix unexpected faults',
                      color: 'red',
                    },
                  ].map(({ value, icon: Icon, title, desc, color }) => {
                    const active = form.service_type === value;
                    return (
                      <button
                        key={value}
                        onClick={() => set('service_type', value)}
                        className="relative rounded-xl p-4 text-start transition-all border-2"
                        style={{
                          borderColor: active
                            ? color === 'brand' ? '#ea580c' : '#ef4444'
                            : '#f3f4f6',
                          background: active
                            ? color === 'brand' ? 'rgba(234,88,12,0.05)' : 'rgba(239,68,68,0.05)'
                            : '#f9fafb',
                        }}
                      >
                        {active && (
                          <div className="absolute top-3 end-3">
                            <CheckCircle size={14} className={color === 'brand' ? 'text-brand-500' : 'text-red-500'} />
                          </div>
                        )}
                        <div className={`inline-flex p-2.5 rounded-xl mb-3 ${
                          active
                            ? color === 'brand' ? 'bg-brand-100 text-brand-600' : 'bg-red-100 text-red-500'
                            : 'bg-gray-100 text-gray-400'
                        } transition-colors`}>
                          <Icon size={20} />
                        </div>
                        <p className="font-semibold text-gray-800 text-sm mb-0.5">{title}</p>
                        <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Car Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-600 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                  {isAr ? 'بيانات السيارة' : 'Car Details'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingSelect
                    label={isAr ? 'موديل السيارة *' : 'Car Model *'}
                    value={form.car_model}
                    onChange={v => set('car_model', v)}
                    icon={Car}
                    options={RENAULT_MODELS.map(m => ({ value: m, label: m }))}
                  />
                  <FloatingInput
                    label={isAr ? 'سنة الصنع' : 'Year'}
                    value={form.car_year}
                    onChange={v => set('car_year', v)}
                    type="number"
                    icon={Calendar}
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-600 text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
                  {isAr ? 'الموعد المفضل' : 'Preferred Schedule'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <FloatingInput
                    label={isAr ? 'التاريخ *' : 'Date *'}
                    value={form.preferred_date}
                    onChange={v => set('preferred_date', v)}
                    type="date"
                    icon={Calendar}
                  />
                  <FloatingSelect
                    label={isAr ? 'الوقت المفضل' : 'Preferred Time'}
                    value={form.preferred_time}
                    onChange={v => set('preferred_time', v)}
                    icon={Clock}
                    options={TIME_SLOTS.map(t => ({ value: t, label: t }))}
                  />
                </div>
                {/* Time slots quick select */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                  {['9:00 AM','11:00 AM','1:00 PM','3:00 PM','5:00 PM'].map(t => (
                    <button
                      key={t}
                      onClick={() => set('preferred_time', t)}
                      className="text-xs py-2 px-2 rounded-lg border transition-all font-medium"
                      style={{
                        borderColor: form.preferred_time === t ? '#ea580c' : '#e5e7eb',
                        background: form.preferred_time === t ? 'rgba(234,88,12,0.08)' : '#f9fafb',
                        color: form.preferred_time === t ? '#ea580c' : '#6b7280',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-600 text-white rounded-full text-xs flex items-center justify-center font-bold">4</span>
                  {isAr ? 'بياناتك' : 'Your Details'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingInput
                    label={isAr ? 'الاسم الكامل *' : 'Full Name *'}
                    value={form.customer_name}
                    onChange={v => set('customer_name', v)}
                    icon={User}
                  />
                  <FloatingInput
                    label={isAr ? 'رقم الهاتف *' : 'Phone Number *'}
                    value={form.customer_phone}
                    onChange={v => set('customer_phone', v)}
                    type="tel"
                    icon={Phone}
                  />
                  <FloatingInput
                    label={isAr ? 'المنطقة / الحي *' : 'Area / District *'}
                    value={form.customer_area}
                    onChange={v => set('customer_area', v)}
                    icon={MapPin}
                  />
                  <FloatingInput
                    label={isAr ? 'العنوان التفصيلي *' : 'Full Address *'}
                    value={form.customer_address}
                    onChange={v => set('customer_address', v)}
                    icon={MapPin}
                  />
                </div>
                {/* Notes */}
                <div className="mt-4 relative">
                  <FileText size={15} className="absolute start-3.5 top-4 text-gray-400 pointer-events-none" />
                  <textarea
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    rows={3}
                    placeholder={isAr ? 'ملاحظات إضافية — صف المشكلة أو أي تفاصيل مهمة...' : 'Additional notes — describe the issue or any important details...'}
                    className="w-full rounded-xl bg-gray-50 border-0 p-4 ps-10 text-sm text-gray-700
                      focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white
                      transition-all shadow-sm resize-none placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Door-to-Door service card */}
              <button
                onClick={toggleD2D}
                className="relative rounded-2xl p-5 text-start transition-all border-2 bg-white shadow-sm"
                style={{
                  borderColor: form.door_to_door ? '#ea580c' : '#f3f4f6',
                  background: form.door_to_door ? 'rgba(234,88,12,0.04)' : 'white',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                    form.door_to_door ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Car size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-gray-800">
                        {isAr ? 'خدمة من الباب للباب 🚗' : 'Door-to-Door Service 🚗'}
                      </p>
                      {/* Toggle visual */}
                      <div className={`w-11 h-6 rounded-full relative transition-colors ${
                        form.door_to_door ? 'bg-brand-500' : 'bg-gray-200'
                      }`}>
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                          form.door_to_door ? 'start-[22px]' : 'start-0.5'
                        }`} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {isAr
                        ? 'نستلم سيارتك من أي مكان ونعيدها إليك بعد اكتمال الخدمة — وفّر وقتك بالكامل'
                        : "We pick up your car from wherever it is and return it to you once the service is complete — save your entire day"}
                    </p>
                    {form.door_to_door && (
                      <p className="text-xs text-brand-600 font-medium mt-2 flex items-center gap-1">
                        <CheckCircle size={12} />
                        {isAr ? 'تم تفعيل الخدمة — سنتواصل معك لتحديد موقع الاستلام' : 'Service activated — we will contact you to arrange pickup location'}
                      </p>
                    )}
                  </div>
                </div>
              </button>

              {/* Mobile CTA — only visible on mobile */}
              <div className="lg:hidden flex flex-col gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold text-base transition-all"
                  style={{
                    background: progress === 100 ? '#ea580c' : '#e5e7eb',
                    color: progress === 100 ? 'white' : '#9ca3af',
                  }}
                >
                  {submitting
                    ? (isAr ? 'جاري الإرسال...' : 'Sending...')
                    : (isAr ? 'تأكيد الموعد 🔒' : 'Secure My Appointment 🔒')}
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Shield size={12} />
                  <span>{isAr ? 'لا يلزم دفع حتى اكتمال الخدمة' : 'No payment required until service is complete'}</span>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Sticky Summary (desktop only) ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 flex flex-col gap-4">

                {/* Summary card — desktop only */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-gray-900 px-5 py-4">
                    <p className="text-white font-bold text-sm">
                      {isAr ? 'ملخص الحجز' : 'Booking Summary'}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {isAr ? 'يتحدث تلقائياً' : 'Updates as you type'}
                    </p>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    {[
                      { label: isAr ? 'الخدمة' : 'Service', value: summary.service, icon: Wrench },
                      { label: isAr ? 'السيارة' : 'Car', value: summary.car, icon: Car },
                      { label: isAr ? 'التاريخ' : 'Date', value: summary.date, icon: Calendar },
                      { label: isAr ? 'الوقت' : 'Time', value: summary.time, icon: Clock },
                      { label: isAr ? 'الاسم' : 'Name', value: summary.name, icon: User },
                      { label: isAr ? 'المنطقة' : 'Area', value: summary.area, icon: MapPin },
                      { label: isAr ? 'من الباب للباب' : 'Door-to-Door', value: form.door_to_door ? (isAr ? '✓ مفعّلة' : '✓ Enabled') : (isAr ? 'غير مفعّلة' : 'Not enabled'), icon: Car },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={13} className="text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Progress in summary */}
                  <div className="px-5 pb-4">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {isAr ? `${7 - completeness} حقل متبقي` : `${7 - completeness} fields remaining`}
                    </p>
                  </div>
                </div>

                {/* CTA — desktop only */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting || progress < 100}
                  className="hidden lg:block w-full py-4 rounded-xl font-bold text-base transition-all"
                  style={{
                    background: progress === 100 ? '#ea580c' : '#e5e7eb',
                    color: progress === 100 ? 'white' : '#9ca3af',
                    cursor: progress === 100 ? 'pointer' : 'not-allowed',
                  }}
                >
                  {submitting
                    ? (isAr ? 'جاري الإرسال...' : 'Sending...')
                    : (isAr ? 'تأكيد الموعد 🔒' : 'Secure My Appointment 🔒')}
                </button>

                {/* Trust signal — desktop only */}
                <div className="hidden lg:flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Shield size={12} />
                  <span>{isAr ? 'لا يلزم دفع حتى اكتمال الخدمة' : 'No payment required until service is complete'}</span>
                </div>

              </div>
            </div>

          </div>



        </div>
      </main>
      <Footer />
    </div>
  );
}
