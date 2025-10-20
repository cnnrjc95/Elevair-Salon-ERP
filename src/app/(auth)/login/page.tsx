'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      setError('Invalid credentials');
    } else {
      window.location.href = '/dashboard';
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-10 shadow-2xl">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand-200">
            <ShieldCheck size={16} /> Elevair Staff Access
          </div>
          <h1 className="text-2xl font-semibold text-white">Sign in to continue</h1>
          <p className="text-sm text-slate-400">
            Secure access with email, password, Google SSO, and enforced 2FA.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Email</label>
            <Input name="email" type="email" required placeholder="you@elevair.co.uk" autoComplete="email" />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Password</label>
            <Input name="password" type="password" required placeholder="••••••••" autoComplete="current-password" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in'}
          </Button>
        </form>
        <div className="space-y-3 text-center">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => signIn('google')}
            disabled={loading}
          >
            Continue with Google
          </Button>
          <p className="text-xs text-slate-500">
            Need access? <Link href="/register" className="text-brand-300 hover:text-brand-200">Invite a teammate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
