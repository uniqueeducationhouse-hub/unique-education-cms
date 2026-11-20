'use client';

import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, AlertCircle, Loader2, PlusCircle } from 'lucide-react';
import { createStudent, type CreateStudentInput } from '@/lib/actions/admissions';
import type { SchoolClass, Section } from '@/types/database.types';

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: (SchoolClass & { sections: Section[] })[];
  onSuccess?: () => void;
  onAddClass?: () => void;
}

export function NewStudentModal({ isOpen, onClose, classes, onSuccess, onAddClass }: NewStudentModalProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Available sections for chosen class
  const activeClass = classes.find((c) => c.id === selectedClassId) ?? classes[0];
  const availableSections = activeClass?.sections ?? [];
  const defaultSectionId = availableSections[0]?.id ?? '';

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    admission_number: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    roll_number: `${Math.floor(1000 + Math.random() * 9000)}`,
    gender: 'female' as 'male' | 'female' | 'other',
    date_of_birth: '2012-05-15',
    blood_group: 'O+',
    section_id: defaultSectionId,
    guardian_name: '',
    guardian_relation: 'Father',
    guardian_phone: '',
    guardian_email: '',
    address: '',
  });

  if (!isOpen) return null;

  // Guard: no classes configured yet
  const hasNoClasses = classes.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const resolvedClassId = selectedClassId || classes[0]?.id || '';
    const resolvedSectionId = formData.section_id || defaultSectionId || '';

    // Validate UUIDs before hitting Supabase
    if (!resolvedClassId || !resolvedSectionId) {
      setErrorMsg('Please select a valid Class and Section before submitting.');
      setIsSubmitting(false);
      return;
    }

    const payload: CreateStudentInput = {
      ...formData,
      class_id: resolvedClassId,
      section_id: resolvedSectionId,
    };

    const res = await createStudent(payload);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to enroll student');
    } else {
      setSuccessMsg('Student successfully enrolled into Supabase database!');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-4 sm:my-8 min-w-0">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-indigo-400 shrink-0" />
            <h3 className="font-bold text-base">New Student Admission</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Empty Classes Warning */}
        {hasNoClasses && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <p className="font-bold mb-1">⚠️ No classes configured yet</p>
            <p className="text-amber-700 mb-3">
              You need to add at least one class and section before enrolling students.
              Run the seed SQL from <code className="font-mono bg-amber-100 px-1 rounded">supabase/schema.sql</code> in your Supabase SQL Editor, or use the button below.
            </p>
            {onAddClass && (
              <button
                type="button"
                onClick={() => { onClose(); onAddClass(); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Add Class / Section
              </button>
            )}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Liam"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Vance"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admission Number *</label>
              <input
                required
                type="text"
                value={formData.admission_number}
                onChange={(e) => setFormData({ ...formData, admission_number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roll Number *</label>
              <input
                required
                type="text"
                value={formData.roll_number}
                onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Class / Grade *</label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  const cls = classes.find((c) => c.id === e.target.value);
                  if (cls?.sections[0]) {
                    setFormData((prev) => ({ ...prev, section_id: cls.sections[0].id }));
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Section *</label>
              <select
                value={formData.section_id || defaultSectionId}
                onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              >
                {availableSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                required
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider">
              Parent / Guardian Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guardian Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Vance"
                  value={formData.guardian_name}
                  onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relation *</label>
                <input
                  required
                  type="text"
                  placeholder="Father / Mother / Guardian"
                  value={formData.guardian_relation}
                  onChange={(e) => setFormData({ ...formData, guardian_relation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guardian Phone *</label>
                <input
                  required
                  type="tel"
                  placeholder="+1 555-0100"
                  value={formData.guardian_phone}
                  onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guardian Email</label>
                <input
                  type="email"
                  placeholder="guardian@example.com"
                  value={formData.guardian_email}
                  onChange={(e) => setFormData({ ...formData, guardian_email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || hasNoClasses}
              className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>Enrolling...</span>
                </>
              ) : (
                <span>Complete Admission</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
