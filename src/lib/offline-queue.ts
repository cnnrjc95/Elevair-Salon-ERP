'use client';

export type OfflinePayload = {
  id: string;
  endpoint: string;
  body: Record<string, unknown>;
  createdAt: number;
};

const STORAGE_KEY = 'elevair-offline-queue';

const readQueue = (): OfflinePayload[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as OfflinePayload[]) : [];
};

const writeQueue = (queue: OfflinePayload[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

export const enqueue = (payload: OfflinePayload) => {
  const queue = readQueue();
  queue.push(payload);
  writeQueue(queue);
};

export const flushQueue = async () => {
  const queue = readQueue();
  const remaining: OfflinePayload[] = [];
  for (const job of queue) {
    try {
      const res = await fetch(job.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job.body)
      });
      if (!res.ok) {
        remaining.push(job);
      }
    } catch (error) {
      remaining.push(job);
    }
  }
  writeQueue(remaining);
  return remaining.length;
};

export const getQueueLength = () => readQueue().length;
