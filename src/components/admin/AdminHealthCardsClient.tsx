'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, X, Check, Car, Link2, MessageCircle, FileText, Trash2, ChevronDown, ChevronUp, Pencil, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { toWhatsAppNumber } from '@/lib/phone';

const CAR_MODELS = ['Clio','Logan','Duster','Symbol','Megane','Sandero','Fluence','Koleos','Kadjar','Captur','Talisman','Other'];
const emptyCard = { customer_name: '', customer_phone: '', car_model: '', car_model_other: '', car_year: '', plate: '', customer_complaint: '', admin_note: '' };
const emptyRecord = {
  service_date: new Date().toISOString().split('T')[0],
  odometer_km: '', services_performed: '', parts_replaced: '',
  next_service_date: '', next_service_note: '', notes: '',
};

export default function AdminHealthCardsClient({ initialCards, initialTotal, pageSize }: { initialCards: any[]; initialTotal: number; pageSize: number }) {
  const [cards, setCards] = useState(initialCards);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function fetchCards(q: string, p: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/health-cards?q=${encodeURIComponent(q)}&page=${p}&limit=${pageSize}`);
      const data = await res.json();
      if (!res.ok) throw new Error();
      setCards(data.cards);
      setTotal(data.total);
      setPage(p);
    } catch {
      toast.error('فشل تحميل البطاقات');
    } finally {
      setLoading(false);
    }
  }

  // Debounced server-side search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchCards(search, 1);
    }, 350);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const [cardModal, setCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [recordModal, setRecordModal] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState(emptyCard);
  const [recordForm, setRecordForm] = useState(emptyRecord);
  const [saving, setSaving] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [deleteRecordId, setDeleteRecordId] = useState<{ cardId: string; recordId: string } | null>(null);

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // ---------- CARD CREATE / EDIT ----------
  function openNewCard() {
    setEditingCard(null);
    setCardForm(emptyCard);
    setCardModal(true);
  }

  function openEditCard(card: any) {
    setEditingCard(card);
    const isKnownModel = CAR_MODELS.includes(card.car_model);
    setCardForm({
      customer_name: card.customer_name,
      customer_phone: card.customer_phone,
      car_model: isKnownModel ? card.car_model : 'Other',
      car_model_other: isKnownModel ? '' : card.car_model,
      car_year: card.car_year || '',
      plate: card.plate || '',
      customer_complaint: card.customer_complaint || '',
      admin_note: card.admin_note || '',
    });
    setCardModal(true);
  }

  async function saveCard() {
    if (!cardForm.customer_name || !cardForm.customer_phone || !cardForm.car_model) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }
    if (cardForm.car_model === 'Other' && !cardForm.car_model_other) {
      toast.error('يرجى كتابة موديل السيارة');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        customer_name: cardForm.customer_name,
        customer_phone: cardForm.customer_phone,
        car_model: cardForm.car_model === 'Other' ? cardForm.car_model_other : cardForm.car_model,
        car_year: cardForm.car_year || null,
        plate: cardForm.plate || null,
        customer_complaint: cardForm.customer_complaint || null,
        admin_note: cardForm.admin_note || null,
      };
      if (editingCard) {
        const res = await fetch(`/api/health-cards/${editingCard.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setCards(prev => prev.map(c => c.id === editingCard.id ? { ...c, ...data } : c));
        toast.success('تم تحديث البطاقة');
      } else {
        const res = await fetch('/api/health-cards', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setCards(prev => [{ ...data, service_records: [] }, ...prev]);
        toast.success('تم إنشاء البطاقة');
      }
      setCardModal(false);
    } catch {
      toast.error('حدث خطأ');
    } finally {
      setSaving(false);
    }
  }

  // ---------- RECORD CREATE / EDIT ----------
  function openNewRecord(cardId: string) {
    setEditingRecord(null);
    setRecordForm(emptyRecord);
    setRecordModal(cardId);
  }

  function openEditRecord(cardId: string, rec: any) {
    setEditingRecord(rec);
    setRecordForm({
      service_date: rec.service_date,
      odometer_km: rec.odometer_km ? String(rec.odometer_km) : '',
      services_performed: rec.services_performed,
      parts_replaced: rec.parts_replaced || '',
      next_service_date: rec.next_service_date || '',
      next_service_note: rec.next_service_note || '',
      notes: rec.notes || '',
    });
    setRecordModal(cardId);
  }

  async function saveRecord() {
    if (!recordForm.services_performed || !recordForm.service_date) {
      toast.error('يرجى إدخال تاريخ الخدمة والأعمال المنفذة');
      return;
    }
    setSaving(true);
    try {
      if (editingRecord) {
        const res = await fetch(`/api/service-records/${editingRecord.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(recordForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setCards(prev => prev.map(c => c.id === recordModal
          ? { ...c, service_records: (c.service_records || []).map((r: any) => r.id === editingRecord.id ? data : r) }
          : c));
        toast.success('تم تحديث السجل');
      } else {
        const res = await fetch(`/api/health-cards/${recordModal}/records`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(recordForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setCards(prev => prev.map(c => c.id === recordModal
          ? { ...c, service_records: [data, ...(c.service_records || [])] }
          : c));
        toast.success('تم إضافة السجل');
      }
      setRecordModal(null);
    } catch {
      toast.error('حدث خطأ');
    } finally {
      setSaving(false);
    }
  }

  async function deleteCard(id: string) {
    try {
      const res = await fetch(`/api/health-cards/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setCards(prev => prev.filter(c => c.id !== id));
      setDeleteCardId(null);
      toast.success('تم حذف البطاقة');
    } catch {
      toast.error('حدث خطأ');
    }
  }

  async function deleteRecord(cardId: string, recordId: string) {
    try {
      const res = await fetch(`/api/service-records/${recordId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setCards(prev => prev.map(c => c.id === cardId
        ? { ...c, service_records: (c.service_records || []).filter((r: any) => r.id !== recordId) }
        : c));
      setDeleteRecordId(null);
      toast.success('تم حذف السجل');
    } catch {
      toast.error('حدث خطأ');
    }
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${appUrl}/ar/card/${token}`);
    toast.success('تم نسخ الرابط');
  }

  function shareWhatsApp(card: any) {
    const link = `${appUrl}/ar/card/${card.token}`;
    const msg = `مرحباً ${card.customer_name} 👋\n\nهذه بطاقة صحة سيارتك ${card.car_model} من AK - علاء القاضي.\nستجد فيها كل سجل الصيانة وموعد الخدمة القادمة:\n\n${link}\n\nاحتفظ بالرابط للرجوع إليه في أي وقت 🚗`;
    window.open(`https://wa.me/${toWhatsAppNumber(card.customer_phone)}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">بطاقات صحة السيارات</h1>
          <p className="text-sm text-gray-400 mt-0.5">{total.toLocaleString()} بطاقة · سجل صيانة دائم لكل عميل</p>
        </div>
        <button onClick={openNewCard} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> بطاقة جديدة
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث بالاسم، الهاتف، اللوحة، أو الموديل..."
          className="input-field ps-10 w-full"
        />
        {loading && <span className="absolute end-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">...</span>}
      </div>

      <div className="flex flex-col gap-3">
        {cards.map(card => {
          const records = card.service_records || [];
          const sorted = [...records].sort((a: any, b: any) => b.service_date.localeCompare(a.service_date));
          const lastRecord = sorted[0];
          const isOpen = expanded === card.id;
          return (
            <div key={card.id} className="card overflow-hidden">
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(isOpen ? null : card.id)}>
                <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
                  <Car size={20} className="text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800">{card.car_model} {card.car_year || ''}</p>
                  <p className="text-sm text-gray-400">{card.customer_name} · {card.customer_phone}{card.plate ? ` · ${card.plate}` : ''}</p>
                </div>
                <div className="text-end shrink-0 hidden sm:block">
                  <p className="text-xs text-gray-400">{records.length} سجل خدمة</p>
                  {lastRecord?.next_service_date && (
                    <p className="text-xs font-medium text-brand-600">القادمة: {new Date(lastRecord.next_service_date).toLocaleDateString('ar-EG')}</p>
                  )}
                </div>
                {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </div>

              {isOpen && (
                <div className="border-t bg-gray-50/50 p-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button onClick={() => openNewRecord(card.id)} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                      <Plus size={14} /> إضافة سجل
                    </button>
                    <button onClick={() => openEditCard(card)} className="text-sm py-2 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-white flex items-center gap-1.5">
                      <Pencil size={14} /> تعديل البيانات
                    </button>
                    <button onClick={() => copyLink(card.token)} className="text-sm py-2 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-white flex items-center gap-1.5">
                      <Link2 size={14} /> نسخ الرابط
                    </button>
                    <button onClick={() => shareWhatsApp(card)} className="text-sm py-2 px-4 rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center gap-1.5">
                      <MessageCircle size={14} /> واتساب
                    </button>
                    <button onClick={() => setDeleteCardId(card.id)} className="text-sm py-2 px-3 rounded-lg text-red-500 hover:bg-red-50 flex items-center gap-1.5 ms-auto">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {(card.customer_complaint || card.admin_note) && (
                    <div className="flex flex-col gap-2 mb-4">
                      {card.customer_complaint && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm">
                          <p className="text-xs text-blue-500 font-bold mb-1">شكوى العميل (عامة)</p>
                          <p className="text-gray-700 whitespace-pre-wrap">{card.customer_complaint}</p>
                        </div>
                      )}
                      {card.admin_note && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm">
                          <p className="text-xs text-yellow-600 font-bold mb-1">🔒 ملاحظة إدارية (داخلية فقط)</p>
                          <p className="text-gray-700 whitespace-pre-wrap">{card.admin_note}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {sorted.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-6">
                      <FileText size={24} className="mx-auto mb-2 opacity-30" />
                      لا توجد سجلات بعد
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {sorted.map((rec: any) => (
                        <div key={rec.id} className="bg-white rounded-xl p-4 border border-gray-100 group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-gray-800 text-sm">
                              {new Date(rec.service_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <div className="flex items-center gap-2">
                              {rec.odometer_km && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                                  {rec.odometer_km.toLocaleString()} كم
                                </span>
                              )}
                              {/* Edit / delete record */}
                              <button onClick={() => openEditRecord(card.id, rec)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => setDeleteRecordId({ cardId: card.id, recordId: rec.id })} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">🔧 {rec.services_performed}</p>
                          {rec.parts_replaced && <p className="text-sm text-gray-500 mb-1">⚙️ قطع مستبدلة: {rec.parts_replaced}</p>}
                          {rec.next_service_date && (
                            <p className="text-xs text-brand-600 font-medium mt-2">
                              📅 الخدمة القادمة: {new Date(rec.next_service_date).toLocaleDateString('ar-EG')}
                              {rec.next_service_note ? ` — ${rec.next_service_note}` : ''}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {cards.length === 0 && (
          <div className="card p-12 text-center text-gray-400">
            <Car size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">{search ? 'لا توجد نتائج لبحثك' : 'لا توجد بطاقات بعد'}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => fetchCards(search, page - 1)}
            disabled={page <= 1 || loading}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
          <span className="text-sm text-gray-500">
            صفحة {page} من {totalPages}
          </span>
          <button
            onClick={() => fetchCards(search, page + 1)}
            disabled={page >= totalPages || loading}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* CARD MODAL */}
      {cardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">{editingCard ? 'تعديل بيانات البطاقة' : 'بطاقة سيارة جديدة'}</h2>
              <button onClick={() => setCardModal(false)}><X size={20} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {[
                { label: 'اسم العميل *', key: 'customer_name' },
                { label: 'رقم الهاتف *', key: 'customer_phone' },
                { label: 'سنة الصنع', key: 'car_year' },
                { label: 'رقم اللوحة', key: 'plate' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type="text" className="input-field" value={(cardForm as any)[key]}
                    onChange={e => setCardForm({ ...cardForm, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">موديل السيارة *</label>
                <select className="input-field" value={cardForm.car_model}
                  onChange={e => setCardForm({ ...cardForm, car_model: e.target.value })}>
                  <option value="">اختر الموديل</option>
                  {CAR_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              {cardForm.car_model === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اكتب موديل السيارة *</label>
                  <input type="text" className="input-field" placeholder="مثال: تويوتا كورولا"
                    value={cardForm.car_model_other}
                    onChange={e => setCardForm({ ...cardForm, car_model_other: e.target.value })} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شكوى العميل <span className="text-xs text-blue-500">(تظهر للعميل)</span></label>
                <textarea className="input-field resize-none" rows={3}
                  placeholder="صف المشكلة التي اشتكى منها العميل..."
                  value={cardForm.customer_complaint}
                  onChange={e => setCardForm({ ...cardForm, customer_complaint: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة إدارية <span className="text-xs text-yellow-600">(داخلية — لا تظهر للعميل أبداً)</span></label>
                <textarea className="input-field resize-none bg-yellow-50" rows={3}
                  placeholder="ملاحظات للفريق فقط..."
                  value={cardForm.admin_note}
                  onChange={e => setCardForm({ ...cardForm, admin_note: e.target.value })} />
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setCardModal(false)} className="btn-secondary flex-1">إلغاء</button>
              <button onClick={saveCard} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Check size={16} /> {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD MODAL */}
      {recordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">{editingRecord ? 'تعديل سجل الخدمة' : 'سجل خدمة جديد'}</h2>
              <button onClick={() => setRecordModal(null)}><X size={20} /></button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الخدمة *</label>
                <input type="date" className="input-field" value={recordForm.service_date}
                  onChange={e => setRecordForm({ ...recordForm, service_date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عداد الكيلومترات</label>
                <input type="number" className="input-field" placeholder="85000" value={recordForm.odometer_km}
                  onChange={e => setRecordForm({ ...recordForm, odometer_km: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">الأعمال المنفذة *</label>
                <textarea className="input-field resize-none" rows={2} placeholder="تغيير زيت المحرك، فلتر زيت..."
                  value={recordForm.services_performed}
                  onChange={e => setRecordForm({ ...recordForm, services_performed: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">القطع المستبدلة</label>
                <input type="text" className="input-field" placeholder="فلتر زيت، تيل فرامل"
                  value={recordForm.parts_replaced}
                  onChange={e => setRecordForm({ ...recordForm, parts_replaced: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">موعد الخدمة القادمة</label>
                <input type="date" className="input-field" value={recordForm.next_service_date}
                  onChange={e => setRecordForm({ ...recordForm, next_service_date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة الخدمة القادمة</label>
                <input type="text" className="input-field" placeholder="تغيير زيت بعد 5000 كم"
                  value={recordForm.next_service_note}
                  onChange={e => setRecordForm({ ...recordForm, next_service_note: e.target.value })} />
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setRecordModal(null)} className="btn-secondary flex-1">إلغاء</button>
              <button onClick={saveRecord} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Check size={16} /> {saving ? 'جاري الحفظ...' : 'حفظ السجل'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CARD */}
      {deleteCardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">حذف البطاقة وكل سجلاتها؟</h3>
            <p className="text-gray-500 text-sm mb-5">سيتوقف رابط العميل عن العمل. لا يمكن التراجع.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteCardId(null)} className="btn-secondary flex-1">إلغاء</button>
              <button onClick={() => deleteCard(deleteCardId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-lg">حذف</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE RECORD */}
      {deleteRecordId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">حذف هذا السجل؟</h3>
            <p className="text-gray-500 text-sm mb-5">سيُحذف سجل الخدمة نهائياً من البطاقة.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteRecordId(null)} className="btn-secondary flex-1">إلغاء</button>
              <button onClick={() => deleteRecord(deleteRecordId.cardId, deleteRecordId.recordId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-lg">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
