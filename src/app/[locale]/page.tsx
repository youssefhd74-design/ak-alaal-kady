import { useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import ProductRequestModal from '@/components/storefront/ProductRequestModal';
import { supabase } from '@/lib/supabase';
import { Wrench, ShieldCheck, Truck, Star } from 'lucide-react';

export default async function HomePage() {
  const locale = 'ar'; // default, client will handle switching

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(6);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm">
            <Star size={14} className="text-yellow-300" />
            <span>الوجهة الأولى لصيانة رينو في مصر</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            متخصصون في صيانة سيارات رينو
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            قطع غيار أصلية وخدمة احترافية على أعلى مستوى
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ar/products" className="bg-white text-brand-700 hover:bg-orange-50 font-bold px-8 py-3.5 rounded-xl transition-colors text-lg">
              تسوق الآن
            </Link>
            <Link href="/ar/booking" className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-3.5 rounded-xl transition-colors text-lg">
              احجز موعد
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts} />
      )}

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">لماذا AK؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'قطع أصلية', desc: 'نستخدم قطع غيار أصلية معتمدة لرينو فقط', color: 'text-green-600 bg-green-50' },
              { icon: Wrench, title: 'فنيون خبراء', desc: 'فريق متخصص بخبرة سنوات في سيارات رينو', color: 'text-brand-600 bg-brand-50' },
              { icon: Truck, title: 'توصيل سريع', desc: 'توصيل مجاني لمناطق متعددة', color: 'text-blue-600 bg-blue-50' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${color}`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request a product CTA */}
      <section className="bg-gray-50 border-y border-gray-200 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">لم تجد القطعة التي تبحث عنها؟</h2>
          <p className="text-gray-500 mb-5 text-sm">أخبرنا باسم القطعة وسنتواصل معك فور توفرها</p>
          <ProductRequestModal />
        </div>
      </section>

      {/* Book CTA */}
      <section className="bg-brand-50 border-y border-brand-100 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-brand-800 mb-3">احجز موعدك اليوم</h2>
          <p className="text-brand-600 mb-6">صيانة دورية أو إصلاح عطل — نحن هنا لمساعدتك</p>
          <Link href="/ar/booking" className="btn-primary inline-flex items-center gap-2 text-base">
            <Wrench size={18} />
            احجز موعد
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
