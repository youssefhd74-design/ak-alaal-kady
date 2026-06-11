import { createAdminClient } from '@/lib/supabase';
import Navbar from '@/components/shared/Navbar';
import { Car, Calendar, Gauge, Wrench, Settings2, ShieldCheck, AlertCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function CarCardPage({
  params: { locale, token },
}: { params: { locale: string; token: string } }) {
  const isAr = locale === 'ar';
  const db = createAdminClient();

  const { data: card } = await db
    .from('car_cards')
    .select('customer_name, car_model, car_year, plate, created_at, service_records(*)')
    .eq('token', token)
    .single();

  if (!card) notFound();

  const records = ((card as any).service_records || [])
    .sort((a: any, b: any) => b.service_date.localeCompare(a.service_date));
  const latest = records[0];
  const nextDue = latest?.next_service_date ? new Date(latest.next_service_date) : null;
  const today = new Date();
  const daysUntil = nextDue ? Math.ceil((nextDue.getTime() - today.getTime()) / 86400000) : null;
  const isOverdue = daysUntil !== null && daysUntil < 0;
  const isSoon = daysUntil !== null && daysUntil >= 0 && daysUntil <= 14;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 60%, #16213e 100%)' }}>
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-lg mx-auto">

          {/* Car identity card */}
          <div className="rounded-2xl overflow-hidden mb-5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(234,88,12,0.25)', backdropFilter: 'blur(10px)' }}>
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #ea580c, #f97316, #ea580c)' }} />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center border border-brand-900">
                  <Car size={26} className="text-brand-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
                    {isAr ? 'بطاقة صحة السيارة' : 'Car Health Card'}
                  </p>
                  <h1 className="text-2xl font-bold text-white">
                    Renault {(card as any).car_model} {(card as any).car_year || ''}
                  </h1>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-xs text-gray-500">{isAr ? 'المالك' : 'Owner'}</p>
                  <p className="text-gray-200 font-medium mt-0.5">{(card as any).customer_name}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-xs text-gray-500">{isAr ? 'رقم اللوحة' : 'Plate'}</p>
                  <p className="text-gray-200 font-medium mt-0.5 font-mono">{(card as any).plate || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next service banner */}
          {nextDue && (
            <div className="rounded-2xl p-5 mb-5 flex items-start gap-4"
              style={{
                background: isOverdue ? 'rgba(239,68,68,0.12)' : isSoon ? 'rgba(234,179,8,0.1)' : 'rgba(34,197,94,0.08)',
                border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.35)' : isSoon ? 'rgba(234,179,8,0.3)' : 'rgba(34,197,94,0.25)'}`,
              }}>
              {isOverdue
                ? <AlertCircle size={22} className="text-red-400 shrink-0 mt-0.5" />
                : <ShieldCheck size={22} className={isSoon ? 'text-yellow-400 shrink-0 mt-0.5' : 'text-green-400 shrink-0 mt-0.5'} />}
              <div>
                <p className={`font-bold text-sm ${isOverdue ? 'text-red-300' : isSoon ? 'text-yellow-300' : 'text-green-300'}`}>
                  {isOverdue
                    ? (isAr ? '⚠️ الخدمة القادمة متأخرة' : '⚠️ Next service is overdue')
                    : isSoon
                    ? (isAr ? '⏰ الخدمة القادمة قريباً' : '⏰ Next service coming soon')
                    : (isAr ? '✓ سيارتك في حالة جيدة' : '✓ Your car is in good shape')}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  {isAr ? 'موعد الخدمة القادمة: ' : 'Next service due: '}
                  <span className="font-bold">{nextDue.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  {latest.next_service_note && <span className="block text-xs text-gray-400 mt-0.5">{latest.next_service_note}</span>}
                </p>
                <a href={`/${locale}/booking`}
                  className="inline-block mt-3 text-xs font-bold px-4 py-2 rounded-lg text-white"
                  style={{ background: '#ea580c' }}>
                  {isAr ? 'احجز موعدك الآن ←' : 'Book your appointment →'}
                </a>
              </div>
            </div>
          )}

          {/* Service history timeline */}
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <Wrench size={16} className="text-brand-500" />
            {isAr ? 'سجل الصيانة' : 'Service History'}
            <span className="text-xs text-gray-500 font-normal">({records.length})</span>
          </h2>

          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Settings2 size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">{isAr ? 'لا توجد سجلات بعد' : 'No records yet'}</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-2 bottom-2 start-[15px] w-px" style={{ background: 'rgba(234,88,12,0.25)' }} />
              <div className="flex flex-col gap-4">
                {records.map((rec: any, i: number) => (
                  <div key={rec.id} className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="relative shrink-0 w-8 flex justify-center pt-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 ${i === 0 ? 'bg-brand-500 border-brand-400' : 'bg-gray-800 border-gray-600'}`}
                        style={i === 0 ? { boxShadow: '0 0 10px rgba(234,88,12,0.6)' } : {}} />
                    </div>
                    {/* Record card */}
                    <div className="flex-1 rounded-xl p-4 mb-1"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <p className="font-bold text-gray-200 text-sm flex items-center gap-1.5">
                          <Calendar size={12} className="text-brand-500" />
                          {new Date(rec.service_date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        {rec.odometer_km && (
                          <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                            <Gauge size={11} />
                            {rec.odometer_km.toLocaleString()} {isAr ? 'كم' : 'km'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{rec.services_performed}</p>
                      {rec.parts_replaced && (
                        <p className="text-xs text-gray-400 mt-2 flex items-start gap-1.5">
                          <Settings2 size={11} className="mt-0.5 shrink-0" />
                          {isAr ? 'قطع مستبدلة: ' : 'Parts replaced: '}{rec.parts_replaced}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer brand */}
          <div className="text-center mt-10 pb-6">
            <p className="text-gray-600 text-xs">
              {isAr ? 'صادرة عن' : 'Issued by'} <span className="text-gray-400 font-semibold">AK - Alaa Al Kady</span>
            </p>
            <p className="text-gray-700 text-xs mt-0.5">
              {isAr ? 'متخصصون في صيانة رينو · القاهرة' : 'Renault Maintenance Specialists · Cairo'}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
