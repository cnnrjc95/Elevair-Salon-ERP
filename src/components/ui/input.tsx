import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30',
        className
      )}
      {...props}
    />
  );
});
