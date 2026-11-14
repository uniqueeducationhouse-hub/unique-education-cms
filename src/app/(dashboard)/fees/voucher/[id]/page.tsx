import React from 'react';
import { PrintableChallan } from '@/components/fees/PrintableChallan';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [
    { id: 'vch-001' },
    { id: 'vch-002' },
    { id: 'vch-003' },
    { id: 'vch-004' },
    { id: 'vch-005' },
  ];
}

export default async function PrintableVoucherPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-7xl mx-auto">
      <PrintableChallan voucherId={id} />
    </div>
  );
}
