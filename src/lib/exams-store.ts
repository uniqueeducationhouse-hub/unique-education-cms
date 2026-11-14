'use client';

export interface ExamSession {
  id: string;
  title: string;
  term: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  passing_percentage: number;
  is_published: boolean;
  description?: string;
}

export const DEFAULT_PAKISTANI_EXAMS: ExamSession[] = [
  {
    id: 'exam-01',
    title: 'Midterm Examination 2026-27',
    term: 'Midterm',
    academic_year: '2026-2027',
    start_date: '2026-10-15',
    end_date: '2026-10-28',
    passing_percentage: 40,
    is_published: true,
    description: 'Comprehensive mid-session academic assessment for all grades.',
  },
  {
    id: 'exam-02',
    title: 'Final Term Examination 2026-27',
    term: 'Final Term',
    academic_year: '2026-2027',
    start_date: '2027-03-01',
    end_date: '2027-03-18',
    passing_percentage: 40,
    is_published: false,
    description: 'Annual promotional examinations conducted under institutional board guidelines.',
  },
  {
    id: 'exam-03',
    title: 'Monthly Test (November 2026)',
    term: 'Monthly Assessment',
    academic_year: '2026-2027',
    start_date: '2026-11-25',
    end_date: '2026-11-30',
    passing_percentage: 40,
    is_published: true,
    description: 'Monthly revision test evaluating core concepts in Urdu, Math, Science & English.',
  },
  {
    id: 'exam-04',
    title: 'Pre-Board / Send-Up Examination',
    term: 'Send-Up',
    academic_year: '2026-2027',
    start_date: '2027-01-10',
    end_date: '2027-01-22',
    passing_percentage: 40,
    is_published: false,
    description: 'Mock board examination for Class 9 and Class 10 preparing for BISE Board Exams.',
  },
];

const STORAGE_KEY = 'sms_exam_sessions_pk';

export function loadExamSessions(): ExamSession[] {
  if (typeof window === 'undefined') return DEFAULT_PAKISTANI_EXAMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load exam sessions from storage', e);
  }
  return DEFAULT_PAKISTANI_EXAMS;
}

export function saveExamSessions(sessions: ExamSession[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save exam sessions to storage', e);
  }
}
