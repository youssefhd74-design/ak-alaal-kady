'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { X, Search, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductRequestModal() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ product_name: '', customer_name: '', customer_phone: '', notes: '' });

  async function handleSubmit() {
    if (!form.product_name || !form.customer_name || !form.customer_phone) {
      toast.error(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/product-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      toast.error(isAr ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => setSubmitted(false), 300);
    setForm({ product_name: '', customer_name: '', customer_phone: '', notes: '' });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-3 rounded-xl transition-colors"
      >
        <Search size={18} />
        {isAr ? 'اطلب قطعة غير متوفرة' : 'Request an unavailable part'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="font-bold text-lg text-gray-800">
                  {isAr ? 'طلب قطعة غير متوفرة' : 'Request an unavailable part'}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {isAr ? 'سنتواصل معك فور توفرها' : "We'll contact you when it's available"}
                </p>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              /* Success state */
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle size={36} className="text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {isAr ? 'تم إرسال طلبك!' : 'Request sent!'}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {isAr
                    ? 'سيتواصل معك فريقنا على رقم هاتفك فور توفر القطعة'
                    : 'Our team will contact you as soon as the part is available'}
                </p>
                <button onClick={handleClose} className="btn-primary px-8">
                  {isAr ? 'حسناً' : 'OK'}
                </button>
              </div>
            ) : (
              /* Form */
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isAr ? 'اسم القطعة المطلوبة *' : 'Part name *'}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={isAr ? 'مثال: فلتر زيت رينو كليو 2019' : 'e.g. Oil filter Renault Clio 2019'}
                    value={form.product_name}
                    onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isAr ? 'اسمك *' : 'Your name *'}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={isAr ? 'أدخل اسمك' : 'Enter your name'}
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isAr ? 'رقم الهاتف *' : 'Phone number *'}
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="01xxxxxxxxx"
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isAr ? 'ملاحظات إضافية' : 'Additional notes'}
                  </label>
                  <textarea
                    className="input-field resize-none"
                    rows={2}
                    placeholder={isAr ? 'موديل السيارة، سنة الصنع، أي تفاصيل إضافية...' : 'Car model, year, any extra details...'}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-70"
                >
                  <Send size={16} />
                  {submitting
                    ? (isAr ? 'جاري الإرسال...' : 'Sending...')
                    : (isAr ? 'إرسال الطلب' : 'Send Request')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
