import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur-sm">
      {children}
    </div>
  );
}
