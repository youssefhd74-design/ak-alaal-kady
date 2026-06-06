'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Package, Star } from 'lucide-react';

export default function FeaturedProducts({ products }: { products: any[] }) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <section className="py-14 px-4 bg-gray-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star size={18} className="text-brand-500 fill-brand-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                {isAr ? 'منتجات مميزة' : 'Featured Products'}
              </h2>
            </div>
            <p className="text-gray-500 text-sm">
              {isAr ? 'أكثر قطع الغيار طلباً لسيارات رينو' : 'Most requested Renault spare parts'}
            </p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="text-brand-600 text-sm font-semibold hover:underline flex items-center gap-1"
          >
            {isAr ? 'عرض الكل ←' : '→ View all'}
          </Link>
        </div>

        {/* Grid — bigger cards on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => {
            const inStock = product.stock_quantity > 0;
            return (
              <Link
                key={product.id}
                href={`/${locale}/products`}
                className="card hover:shadow-lg transition-shadow overflow-hidden group flex flex-col"
              >
                {/* Image — taller on desktop */}
                <div className="h-36 sm:h-44 bg-gray-50 flex items-center justify-center border-b border-gray-100 group-hover:bg-orange-50 transition-colors">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={isAr ? product.name_ar : product.name_en}
                      className="object-contain h-28 sm:h-36 w-full px-2"
                    />
                  ) : (
                    <Package size={40} className="text-gray-300" />
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight mb-2 line-clamp-2 flex-1">
                    {isAr ? product.name_ar : product.name_en}
                  </p>
                  <p className="text-brand-600 font-bold text-sm sm:text-base">
                    {product.price?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </p>
                  <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                    inStock
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {inStock
                      ? (isAr ? '✓ متوفر' : '✓ In Stock')
                      : (isAr ? '✗ نفد' : '✗ Out of Stock')}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
