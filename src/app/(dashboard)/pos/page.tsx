'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { enqueue, flushQueue, getQueueLength } from '@/lib/offline-queue';
import { v4 as uuid } from 'uuid';

export default function POSPage() {
  const [queueLength, setQueueLength] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setQueueLength(getQueueLength());
  }, []);

  const recordOfflineSale = () => {
    enqueue({
      id: uuid(),
      endpoint: '/api/v1/pos/offline',
      body: { items: [{ name: 'Walk-in retail', price: 25 }], locationId: 'offline' },
      createdAt: Date.now()
    });
    setQueueLength(getQueueLength());
  };

  const syncNow = async () => {
    setSyncing(true);
    await flushQueue();
    setQueueLength(getQueueLength());
    setSyncing(false);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">POS & Checkout</h1>
          <p className="text-sm text-slate-400">
            Built-in Stripe (card, Apple Pay, Google Pay) plus cash handling, split payments, tips, commissions and VAT rules.
          </p>
        </div>
        <Button onClick={syncNow} variant="secondary" disabled={syncing}>
          {syncing ? 'Syncing…' : 'Force sync'}
        </Button>
      </div>
      <Card className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Offline queue</h2>
          <p className="text-sm text-slate-400">
            Elevair keeps offline transactions encrypted in the browser and syncs automatically once back online.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-brand-500/10 px-4 py-3 text-sm text-brand-100">
            Pending sales: {queueLength}
          </div>
          <Button onClick={recordOfflineSale}>Simulate offline sale</Button>
        </div>
      </Card>
    </div>
  );
}
