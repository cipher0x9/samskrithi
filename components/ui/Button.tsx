import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'gold';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const base = 'btn';
  const v = variant === 'primary' ? 'btn-primary' : variant === 'gold' ? 'btn-gold' : 'btn-ghost';
  return <button className={cn(base, v, className)} {...props} />;
}
