import { cn } from '@/lib/cn';
import { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-xl shadow-black/10 backdrop-blur',
        className
      )}
      {...props}
    />
  );
}
