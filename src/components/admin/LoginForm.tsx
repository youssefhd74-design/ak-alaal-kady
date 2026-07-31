'use client';

import { useState } from 'react';
import { Wrench, Mail, Lock } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      setError('يرجى إدخال البريد وكلمة المرور');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'بيانات الدخول غير صحيحة');
        setLoading(false);
        return;
      }
      window.location.href = '/admin';
    } catch {
      setError('حدث خطأ، حاول مجدداً');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex bg-brand-600 rounded-2xl p-3 mb-3">
            <Wrench size={28} className="text-white" />
          </div>
          <h1 className="text-white text-xl font-bold">AK - لوحة التحكم</h1>
          <p className="text-gray-400 text-sm mt-1">علاء القاضي · متخصصون في رينو</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1.5 font-medium">البريد الإلكتروني</label>
            <div className="relative">
              <Mail size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                dir="ltr"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 ps-9 py-3 text-white text-sm focus:outline-none focus:border-brand-500 text-left"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-1.5 font-medium">كلمة المرور</label>
            <div className="relative">
              <Lock size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                dir="ltr"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 ps-9 py-3 text-white text-sm focus:outline-none focus:border-brand-500 text-left"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm rounded-lg px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </div>
      </div>
    </div>
  );
}
