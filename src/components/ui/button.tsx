'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 text-white hover:bg-brand-400 focus-visible:outline-brand-400',
        secondary: 'border border-slate-700 bg-slate-900 hover:border-brand-400 focus-visible:outline-brand-400',
        ghost: 'text-slate-200 hover:bg-slate-800/60 focus-visible:outline-brand-400'
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-base rounded-xl'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = ({ className, variant, size, asChild, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
};
