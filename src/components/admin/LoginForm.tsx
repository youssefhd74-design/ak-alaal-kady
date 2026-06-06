'use client';

import { useState } from 'react';
import { Wrench, Lock } from 'lucide-react';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        setError('كلمة المرور غير صحيحة');
      }
    } catch {
      setError('حدث خطأ، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
          <Wrench size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">AK - Alaal Kady</h1>
        <p className="text-gray-400 text-sm mt-1">لوحة الإدارة</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={18} className="text-orange-600" />
          <h2 className="font-bold text-gray-800">دخول الإدارة</h2>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="أدخل كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading || !password}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </div>
    </div>
  );
}
