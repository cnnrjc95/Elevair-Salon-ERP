'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';

const mockAppointments = [
  { id: '1', client: 'Olivia Johnson', service: 'Signature Cut', time: '10:00' },
  { id: '2', client: 'Leo Turner', service: 'Hydra Facial', time: '10:30' },
  { id: '3', client: 'Freya Patel', service: 'Balayage & Gloss', time: '11:15' }
];

export default function KioskPage() {
  const [checkedIn, setCheckedIn] = useState<string[]>([]);

  return (
    <div className="space-y-6 p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Self-check-in kiosk</h1>
        <p className="text-sm text-slate-400">
          Guests scan a QR code or tap the kiosk to confirm arrival, triggering automations and notifying their stylist.
        </p>
      </header>
      <Card className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {mockAppointments.map((appt) => (
            <button
              key={appt.id}
              onClick={() => setCheckedIn((prev) => (prev.includes(appt.id) ? prev : [...prev, appt.id]))}
              className={`rounded-2xl border border-slate-800 px-4 py-5 text-left transition ${
                checkedIn.includes(appt.id)
                  ? 'bg-brand-500/20 text-brand-100'
                  : 'bg-slate-900/60 text-slate-200 hover:border-brand-400'
              }`}
            >
              <p className="text-sm font-semibold">{appt.client}</p>
              <p className="text-xs text-slate-400">{appt.service}</p>
              <p className="text-xs text-slate-500">{appt.time}</p>
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-300">
          Checked-in: {checkedIn.length} / {mockAppointments.length}
        </div>
      </Card>
    </div>
  );
}
