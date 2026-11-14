'use client';

export interface SubjectItem {
  id: string;
  name: string;
  totalMarks: number;
  passingMarks: number;
}

export type ClassSubjectsMap = Record<string, SubjectItem[]>;

export const ALL_SCHOOL_CLASSES = [
  'Playgroup',
  'Nursery',
  'KG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

export const DEFAULT_PAKISTANI_SUBJECTS: ClassSubjectsMap = {
  Playgroup: [
    { id: 'sub-pg-1', name: 'English (Phonics & ABC)', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-pg-2', name: 'Urdu (Huroof-e-Tahajji)', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-pg-3', name: 'Mathematics (Numbers 1-20)', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-pg-4', name: 'General Knowledge & Rhymes', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-pg-5', name: 'Nazra Quran & Daily Duas', totalMarks: 50, passingMarks: 20 },
  ],
  Nursery: [
    { id: 'sub-nur-1', name: 'English (Reading & Writing)', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-nur-2', name: 'Urdu (Reading & Writing)', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-nur-3', name: 'Mathematics (Counting 1-50)', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-nur-4', name: 'General Knowledge & Art', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-nur-5', name: 'Islamiyat & Nazra', totalMarks: 50, passingMarks: 20 },
  ],
  KG: [
    { id: 'sub-kg-1', name: 'English (Vocabulary & Sentences)', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-kg-2', name: 'Urdu (Jumlay & Imla)', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-kg-3', name: 'Mathematics (Addition & Subtraction)', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-kg-4', name: 'General Science & Environment', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-kg-5', name: 'Islamiat & Nazra Quran', totalMarks: 50, passingMarks: 20 },
  ],
  'Class 1': [
    { id: 'sub-c1-1', name: 'English', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c1-2', name: 'Urdu', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c1-3', name: 'Mathematics', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c1-4', name: 'General Science', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c1-5', name: 'Islamiat', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c1-6', name: 'Computer Education', totalMarks: 50, passingMarks: 20 },
  ],
  'Class 2': [
    { id: 'sub-c2-1', name: 'English', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c2-2', name: 'Urdu', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c2-3', name: 'Mathematics', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c2-4', name: 'General Science', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c2-5', name: 'Islamiat', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c2-6', name: 'Computer Education', totalMarks: 50, passingMarks: 20 },
  ],
  'Class 3': [
    { id: 'sub-c3-1', name: 'English', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c3-2', name: 'Urdu', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c3-3', name: 'Mathematics', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c3-4', name: 'General Science', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c3-5', name: 'Social Studies', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c3-6', name: 'Islamiat', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c3-7', name: 'Computer Education', totalMarks: 50, passingMarks: 20 },
  ],
  'Class 4': [
    { id: 'sub-c4-1', name: 'English', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c4-2', name: 'Urdu', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c4-3', name: 'Mathematics', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c4-4', name: 'General Science', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c4-5', name: 'Social Studies', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c4-6', name: 'Islamiat', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c4-7', name: 'Computer Education', totalMarks: 50, passingMarks: 20 },
  ],
  'Class 5': [
    { id: 'sub-c5-1', name: 'English', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c5-2', name: 'Urdu', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c5-3', name: 'Mathematics', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c5-4', name: 'General Science', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c5-5', name: 'Social Studies', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c5-6', name: 'Islamiat', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c5-7', name: 'Computer Education', totalMarks: 50, passingMarks: 20 },
  ],
  'Class 6': [
    { id: 'sub-c6-1', name: 'English', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c6-2', name: 'Urdu', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c6-3', name: 'Mathematics', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c6-4', name: 'General Science', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c6-5', name: 'History & Geography', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c6-6', name: 'Islamiat', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c6-7', name: 'Computer Education', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c6-8', name: 'Tarjuma-tul-Quran', totalMarks: 50, passingMarks: 20 },
  ],
  'Class 7': [
    { id: 'sub-c7-1', name: 'English', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c7-2', name: 'Urdu', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c7-3', name: 'Mathematics', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c7-4', name: 'General Science', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c7-5', name: 'History & Geography', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c7-6', name: 'Islamiat', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c7-7', name: 'Computer Education', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c7-8', name: 'Tarjuma-tul-Quran', totalMarks: 50, passingMarks: 20 },
  ],
  'Class 8': [
    { id: 'sub-c8-1', name: 'English', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c8-2', name: 'Urdu', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c8-3', name: 'Mathematics', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c8-4', name: 'General Science', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c8-5', name: 'History & Geography', totalMarks: 100, passingMarks: 40 },
    { id: 'sub-c8-6', name: 'Islamiat', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c8-7', name: 'Computer Education', totalMarks: 50, passingMarks: 20 },
    { id: 'sub-c8-8', name: 'Tarjuma-tul-Quran', totalMarks: 50, passingMarks: 20 },
  ],
  'Class 9': [
    { id: 'sub-c9-1', name: 'English Language & Lit', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c9-2', name: 'Urdu Lazmi', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c9-3', name: 'Mathematics (Science)', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c9-4', name: 'Physics', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c9-5', name: 'Chemistry', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c9-6', name: 'Biology / Computer Science', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c9-7', name: 'Islamiyat Compulsory', totalMarks: 50, passingMarks: 17 },
    { id: 'sub-c9-8', name: 'Tarjuma-tul-Quran Majeed', totalMarks: 50, passingMarks: 17 },
  ],
  'Class 10': [
    { id: 'sub-c10-1', name: 'English Language & Lit', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c10-2', name: 'Urdu Lazmi', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c10-3', name: 'Mathematics (Science)', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c10-4', name: 'Physics', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c10-5', name: 'Chemistry', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c10-6', name: 'Biology / Computer Science', totalMarks: 75, passingMarks: 25 },
    { id: 'sub-c10-7', name: 'Pakistan Studies (Mutala-e-Pakistan)', totalMarks: 50, passingMarks: 17 },
    { id: 'sub-c10-8', name: 'Tarjuma-tul-Quran Majeed', totalMarks: 50, passingMarks: 17 },
  ],
};

const SUBJECTS_STORAGE_KEY = 'sms_class_subjects_pk';

export function loadSavedSubjects(): ClassSubjectsMap {
  if (typeof window === 'undefined') return DEFAULT_PAKISTANI_SUBJECTS;
  try {
    const raw = localStorage.getItem(SUBJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with default to guarantee all classes exist
      return { ...DEFAULT_PAKISTANI_SUBJECTS, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to parse saved subjects from storage', e);
  }
  return DEFAULT_PAKISTANI_SUBJECTS;
}

export function saveSubjects(data: ClassSubjectsMap) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save subjects to storage', e);
  }
}
