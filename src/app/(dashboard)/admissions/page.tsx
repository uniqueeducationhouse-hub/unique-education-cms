import React, { Suspense } from 'react';
import { AdmissionsClient } from '@/components/admissions/AdmissionsClient';
import { getStudents, getTeachers, getClassesAndSections } from '@/lib/actions/admissions';
import { Loader2 } from 'lucide-react';

async function AdmissionsData() {
  const [studentsResult, teachersResult, classesResult] = await Promise.all([
    getStudents(),
    getTeachers(),
    getClassesAndSections(),
  ]);

  const dbError = studentsResult.error || teachersResult.error || classesResult.error;

  return (
    <AdmissionsClient
      initialStudents={studentsResult.data}
      initialTeachers={teachersResult.data}
      classes={classesResult.data}
      dbError={dbError}
    />
  );
}

export default function AdmissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <span>Connecting to Supabase and loading student & faculty records...</span>
        </div>
      }
    >
      <AdmissionsData />
    </Suspense>
  );
}
