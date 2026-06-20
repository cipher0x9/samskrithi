'use client';

import React from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-4xl mb-3">🕉️</div>
      <div className="text-xl font-semibold text-[#d4a853]">Something went off the path</div>
      <p className="mt-2 text-sm text-[#8a8578] max-w-[320px]">The temple encountered an error. Your progress is safe.</p>
      <button onClick={() => reset()} className="btn btn-primary mt-6">Try again</button>
      {error?.digest && <div className="text-[10px] text-[#8a8578] mt-4">ref: {error.digest}</div>}
    </div>
  );
}
