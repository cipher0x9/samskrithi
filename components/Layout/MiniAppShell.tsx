'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export function MiniAppShell({ children, title }: Props) {
  return (
    <div className="min-h-[100dvh] pb-20">
      {title && (
        <div className="sticky top-0 z-40 border-b border-[#2a2530] bg-[#0a0a1a]/95 px-4 py-3 text-center text-sm tracking-widest">
          {title}
        </div>
      )}
      <div className="px-4 pt-2">{children}</div>
    </div>
  );
}
