import React from 'react';
import { PrintableReportCard } from '@/components/exams/PrintableReportCard';

interface PageProps {
  params: Promise<{ studentId: string }>;
}

export function generateStaticParams() {
  return [
    { studentId: 's-001' },
    { studentId: 's-002' },
    { studentId: 's-003' },
    { studentId: 's-004' },
    { studentId: 's-005' },
    { studentId: 's-006' },
  ];
}

export default async function PrintableReportCardPage({ params }: PageProps) {
  const { studentId } = await params;

  return (
    <div className="max-w-5xl mx-auto">
      <PrintableReportCard studentId={studentId} />
    </div>
  );
}
