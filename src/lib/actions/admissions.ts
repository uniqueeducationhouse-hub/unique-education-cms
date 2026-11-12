'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Student, Teacher, SchoolClass, Section } from '@/types/database.types';

export interface CreateStudentInput {
  first_name: string;
  last_name: string;
  admission_number: string;
  roll_number: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  class_id: string;
  section_id: string;
  guardian_name: string;
  guardian_relation: string;
  guardian_phone: string;
  guardian_email?: string;
  blood_group?: string;
  address?: string;
}

export interface CreateTeacherInput {
  first_name: string;
  last_name: string;
  employee_id: string;
  email: string;
  phone: string;
  qualification?: string;
  specialization?: string;
  joining_date: string;
  salary?: number;
}

export async function getStudents(): Promise<{ data: Student[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('students')
      .select('*, class:classes(*), section:sections(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      return { data: [], error: error.message };
    }

    return { data: (data as Student[]) || [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch students';
    return { data: [], error: message };
  }
}

export async function getTeachers(): Promise<{ data: Teacher[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teachers:', error);
      return { data: [], error: error.message };
    }

    return { data: (data as Teacher[]) || [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch teachers';
    return { data: [], error: message };
  }
}

export async function getClassesAndSections(): Promise<{
  data: (SchoolClass & { sections: Section[] })[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('classes')
      .select('*, sections(*)')
      .order('numeric_order', { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as (SchoolClass & { sections: Section[] })[]) || [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch classes';
    return { data: [], error: message };
  }
}

export async function createStudent(input: CreateStudentInput): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('students').insert({
      admission_number: input.admission_number,
      roll_number: input.roll_number,
      first_name: input.first_name,
      last_name: input.last_name,
      gender: input.gender,
      date_of_birth: input.date_of_birth,
      class_id: input.class_id,
      section_id: input.section_id,
      guardian_name: input.guardian_name,
      guardian_relation: input.guardian_relation,
      guardian_phone: input.guardian_phone,
      guardian_email: input.guardian_email || null,
      blood_group: input.blood_group || null,
      address: input.address || null,
      status: 'active',
      admission_date: new Date().toISOString().split('T')[0],
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admissions');
    revalidatePath('/');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create student';
    return { success: false, error: message };
  }
}

export async function createTeacher(input: CreateTeacherInput): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('teachers').insert({
      employee_id: input.employee_id,
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      phone: input.phone,
      qualification: input.qualification || null,
      specialization: input.specialization || null,
      joining_date: input.joining_date,
      salary: input.salary || null,
      status: 'active',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admissions');
    revalidatePath('/');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create teacher';
    return { success: false, error: message };
  }
}

export async function getDashboardStats() {
  try {
    const supabase = await createClient();

    const [
      { count: studentsCount, error: sErr },
      { count: teachersCount, error: tErr },
      { count: classesCount, error: cErr },
      { data: recentStudents, error: rErr },
      { data: vouchers, error: vErr },
    ] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('teachers').select('*', { count: 'exact', head: true }),
      supabase.from('classes').select('*', { count: 'exact', head: true }),
      supabase.from('students').select('*, class:classes(*), section:sections(*)').order('created_at', { ascending: false }).limit(4),
      supabase.from('fee_vouchers').select('base_amount, paid_amount, status'),
    ]);

    const totalCollected = (vouchers || [])
      .filter((v) => v.status === 'paid')
      .reduce((sum, v) => sum + Number(v.paid_amount || 0), 0);

    return {
      studentsCount: studentsCount ?? 0,
      teachersCount: teachersCount ?? 0,
      classesCount: classesCount ?? 0,
      recentStudents: recentStudents || [],
      totalCollected,
      isConnected: !sErr && !tErr,
      error: sErr?.message || tErr?.message || null,
    };
  } catch (err: unknown) {
    return {
      studentsCount: 0,
      teachersCount: 0,
      classesCount: 0,
      recentStudents: [],
      totalCollected: 0,
      isConnected: false,
      error: err instanceof Error ? err.message : 'Database query failed',
    };
  }
}
