'use client';

import { useState } from 'react';
import { MessageCircle, Building2, MapPin, Clock, Truck, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  function setField(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch {
      toast.error('حدث خطأ عند الحفظ');
    } finally {
      setSaving(false);
    }
  }

  const waPreview = settings.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number}?text=مرحباً`
    : null;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">الإعدادات</h1>

      <div className="flex flex-col gap-5">
        {/* WhatsApp */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={20} className="text-green-600" />
            <h2 className="font-bold text-gray-800">واتساب التواصل</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم واتساب *</label>
            <input
              type="text"
              className="input-field"
              placeholder="مثال: 201012345678"
              value={settings.whatsapp_number || ''}
              onChange={(e) => setField('whatsapp_number', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">أدخل الرقم مع كود الدولة بدون + (مثال: 201012345678)</p>
          </div>
          {waPreview && (
            <a href={waPreview} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-green-600 text-sm hover:underline">
              <MessageCircle size={14} />
              اختبار رابط واتساب
            </a>
          )}
        </div>

        {/* Business info */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={20} className="text-brand-600" />
            <h2 className="font-bold text-gray-800">بيانات النشاط</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم النشاط التجاري</label>
              <input type="text" className="input-field" value={settings.business_name || ''} onChange={(e) => setField('business_name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin size={13} className="inline me-1" />
                عنوان الورشة
              </label>
              <input type="text" className="input-field" value={settings.business_address || ''} onChange={(e) => setField('business_address', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock size={13} className="inline me-1" />
                ساعات العمل
              </label>
              <input type="text" className="input-field" placeholder="السبت - الخميس: 9ص - 6م" value={settings.working_hours || ''} onChange={(e) => setField('working_hours', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Truck size={13} className="inline me-1" />
                مناطق التوصيل
              </label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="المعادي، مدينة نصر، مصر الجديدة..."
                value={settings.delivery_areas || ''}
                onChange={(e) => setField('delivery_areas', e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center justify-center gap-2 py-3 text-base disabled:opacity-70"
        >
          {saving ? <><span className="animate-spin">⟳</span> جاري الحفظ...</> : <><Save size={18} /> حفظ الإعدادات</>}
        </button>
      </div>
    </div>
  );
}
