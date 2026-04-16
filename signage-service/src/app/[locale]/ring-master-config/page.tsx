'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { getLocaleSegment, resolveLocalizedRedirect } from '../admin-route';
import { adminFetch } from '@/lib/admin-fetch';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';

export default function CmsLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = getLocaleSegment(params?.locale);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminFetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        setError('Access denied');
        setPassword('');
        setLoading(false);
        return;
      }

      const data = await res.json();
      router.push(
        resolveLocalizedRedirect(locale, data.redirectTo, '/ring-master-config/dashboard')
      );
    } catch {
      setError('Connection error');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 font-sans p-4">
      <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-6 w-full max-w-sm p-10 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl">
        <div className="text-center space-y-2">
          <div className="text-4xl">⚙️</div>
          <h1 className="text-xl font-semibold text-white tracking-tight">PixelRing CMS</h1>
          <p className="text-xs font-medium text-violet-500 uppercase tracking-widest">Owner & Config Access</p>
        </div>
        
        <div className="space-y-4 w-full">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@pixelring.de"
            autoComplete="username"
            autoFocus
            required
            disabled={loading}
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>

        {error && <p className="text-sm text-red-500 text-center font-medium">{error}</p>}

        <Button
          type="submit"
          disabled={loading || !email.trim() || !password}
          className="w-full mt-2"
        >
          {loading ? 'Verifying...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
