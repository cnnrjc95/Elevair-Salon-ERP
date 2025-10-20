'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center shadow-2xl">
          <h1 className="text-2xl font-semibold text-white">Thanks! 🎉</h1>
          <p className="mt-3 text-sm text-slate-400">
            Our success team will provision an Elevair workspace and email you onboarding steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-10 shadow-2xl"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-white">Request Elevair access</h1>
          <p className="text-sm text-slate-400">
            Owners can invite managers, reception, stylists, finance and HR staff with granular RBAC.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 text-left">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">First name</label>
            <Input name="firstName" required placeholder="Amelia" />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Last name</label>
            <Input name="lastName" required placeholder="Hart" />
          </div>
        </div>
        <div className="space-y-2 text-left">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Work email</label>
          <Input name="email" type="email" required placeholder="you@salon.co.uk" />
        </div>
        <div className="space-y-2 text-left">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Salon name</label>
          <Input name="salon" required placeholder="Elevair Mayfair" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Request invite'}
        </Button>
      </form>
    </div>
  );
}
