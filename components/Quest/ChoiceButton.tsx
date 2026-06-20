'use client';

import React from 'react';

interface Props {
  text: string;
  onClick: () => void;
  preview?: string;
  disabled?: boolean;
}

export function ChoiceButton({ text, onClick, preview, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="choice-btn w-full text-left rounded-2xl border border-[#2a2530] bg-[#141428] p-4 mb-3 active:scale-[0.985] transition disabled:opacity-60"
    >
      <div className="font-medium text-[#e8e0d0]">{text}</div>
      {preview && <div className="mt-1 text-xs text-[#8a8578]">{preview}</div>}
    </button>
  );
}
