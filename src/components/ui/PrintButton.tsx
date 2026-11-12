'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export function PrintButton({ label = 'Print Document', className = '' }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold rounded-lg shadow transition ${className}`}
    >
      <Printer className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
