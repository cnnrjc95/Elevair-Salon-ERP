import { prisma } from '@/server/db/client';

export const revenueSummary = async (locationId: string, start: Date, end: Date) => {
  const payments = await prisma.payment.groupBy({
    by: ['method'],
    where: { locationId, processedAt: { gte: start, lte: end }, status: 'CAPTURED' },
    _sum: { amount: true, tipAmount: true }
  });
  return payments;
};

export const noShowRate = async (locationId: string, start: Date, end: Date) => {
  const total = await prisma.appointment.count({ where: { locationId, startAt: { gte: start, lte: end } } });
  const noShows = await prisma.appointment.count({
    where: { locationId, startAt: { gte: start, lte: end }, status: 'NO_SHOW' }
  });
  return total === 0 ? 0 : Number((noShows / total).toFixed(2));
};

export const exportCsv = (rows: Array<Record<string, unknown>>) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]!);
  const csv = [headers.join(',')];
  for (const row of rows) {
    csv.push(headers.map((key) => JSON.stringify(row[key] ?? '')).join(','));
  }
  return csv.join('\n');
};
