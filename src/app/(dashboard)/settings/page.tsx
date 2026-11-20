'use client';

import React, { useState, useRef } from 'react';
import {
  Building2,
  Upload,
  Landmark,
  CheckCircle2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  GraduationCap,
  Save,
  Image as ImageIcon,
} from 'lucide-react';
import { useSchoolSettings, DEFAULT_SCHOOL_SETTINGS, type SchoolSettings } from '@/lib/school-settings';

export default function SchoolSettingsPage() {
  const { settings, updateSettings, uploadLogo, removeLogo, resetSettings } = useSchoolSettings();

  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if settings loaded from storage
  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleInputChange = (field: keyof SchoolSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setLogoError(null);
    const result = await uploadLogo(file);
    setLogoUploading(false);

    if (!result.success) {
      setLogoError(result.error || 'Failed to upload logo.');
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all school settings and bank information to defaults?')) {
      await resetSettings();
      setFormData(DEFAULT_SCHOOL_SETTINGS);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const pakistaniBanks = [
    'Meezan Bank Limited',
    'Habib Bank Limited (HBL)',
    'United Bank Limited (UBL)',
    'MCB Bank Limited',
    'Allied Bank Limited (ABL)',
    'Bank Alfalah',
    'Faysal Bank',
    'Bank of Punjab (BOP)',
    'Askari Bank',
    'National Bank of Pakistan (NBP)',
    'Dubai Islamic Bank Pakistan',
  ];

  return (
    <div className="w-full min-w-0 space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            System Configuration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 break-words">School Profile &amp; Bank Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure your school name, campus contact details, official logo, and bank collection account for Pakistani fee challans &amp; report cards.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition"
            title="Reset to default Pakistani school profile"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Settings Successfully Saved!</p>
              <p className="text-emerald-700 mt-0.5">
                School branding, bank details, and logo are now updated across the Sidebar, Fee Challans, and Exam Report Cards.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: School Identity & Logo */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900">1. School Identity &amp; Branding</h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Displayed on Sidebar, Challans &amp; Cards</span>
          </div>

          <div className="p-6 space-y-5">
            {/* Logo Upload Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Official School Logo (PNG / JPG)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                <div className="relative group shrink-0">
                  {settings.logoUrl ? (
                    <div className="h-24 w-24 rounded-xl bg-white p-2 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.logoUrl}
                        alt="School Logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-xl bg-indigo-600 text-white flex flex-col items-center justify-center shadow-md">
                      <GraduationCap className="h-10 w-10" />
                      <span className="text-[9px] font-semibold mt-1">NO LOGO</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={logoUploading}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {logoUploading ? 'Uploading...' : 'Upload School Logo'}
                    </button>
                    {settings.logoUrl && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supports high-res transparent PNG or JPG (recommended 250×250px or square, max 2MB).
                  </p>
                  {logoError && (
                    <p className="text-xs text-rose-600 font-semibold">{logoError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* School Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Apex Cambridge Grammar School"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline / Board Affiliation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Affiliated with BISE & Cambridge International"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Campus Address, Phone, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Address <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Plot 18, Block B, Main Boulevard, Gulberg III, Lahore"
                  value={formData.campusAddress}
                  onChange={(e) => handleInputChange('campusAddress', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number(s) <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="+92 42 35789123 / +92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="info@school.edu.pk"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Principal Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Principal / Headmaster Name <span className="text-slate-400">(for Report Card Sign-off)</span>
              </label>
              <input
                type="text"
                placeholder="Prof. Muhammad Tariq Khan"
                value={formData.principalName}
                onChange={(e) => handleInputChange('principalName', e.target.value)}
                className="w-full sm:w-1/2 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Bank Collection Details (for Pakistani Fee Challans) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-emerald-600" />
              <h2 className="font-bold text-sm text-slate-900">2. Bank &amp; Challan Collection Account</h2>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Pakistani 3-Part Challans
            </span>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-500">
              These banking details will appear directly in the header of each copy (Bank Copy, School Copy, Student Copy) on printable A4 fee vouchers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bank Name Selection / Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  list="pakistani-banks-list"
                  type="text"
                  placeholder="e.g. Meezan Bank Limited"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
                <datalist id="pakistani-banks-list">
                  {pakistaniBanks.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>

              {/* Account Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Account Title <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Apex Cambridge Grammar School Collection A/C"
                  value={formData.accountTitle}
                  onChange={(e) => handleInputChange('accountTitle', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Number / IBAN */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Number / IBAN <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. PK36MEZN0001234567890101 or 0102-1234567"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Branch Name / Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branch Name &amp; Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0102 - Gulberg III Branch, Lahore"
                  value={formData.branchName}
                  onChange={(e) => handleInputChange('branchName', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 mb-3 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            Live Challan &amp; Report Card Header Preview
          </div>
          <div className="bg-white text-slate-900 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
            <div className="flex items-center gap-3 text-center sm:text-left">
              {formData.logoUrl ? (
                <div className="h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.logoUrl} alt="Logo Preview" className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <GraduationCap className="h-6 w-6" />
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 uppercase">
                  {formData.schoolName || 'Your School Name Here'}
                </h3>
                <p className="text-[11px] text-slate-500">{formData.tagline}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {formData.campusAddress} • Ph: {formData.phone}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-right text-[11px]">
              <span className="font-bold text-slate-800 block">{formData.bankName}</span>
              <span className="font-mono text-slate-600 block text-[10px]">{formData.accountNumber}</span>
              <span className="text-[9px] text-slate-500">{formData.accountTitle}</span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-3 pt-2 w-full min-w-0">
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Save className="h-4 w-4 shrink-0" />
            Save School &amp; Bank Settings
          </button>
        </div>
      </form>

      {/* Supabase SQL Code Snippet Card */}
      <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-xl border border-slate-800 space-y-3 mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">Supabase PostgreSQL Schema for School Settings</h3>
          </div>
          <span className="text-[10px] px-2 py-1 bg-indigo-950 text-indigo-300 font-mono rounded border border-indigo-800">
            PostgreSQL 15+
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Execute this SQL in your Supabase SQL Editor to store school profile and bank account settings in Supabase instead of localStorage.
        </p>
        <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
          {`-- 1. School Settings Table (Single-row configuration store)
CREATE TABLE public.school_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    school_name TEXT NOT NULL,
    tagline TEXT,
    campus_address TEXT,
    phone TEXT,
    email TEXT,
    bank_name TEXT,
    account_title TEXT,
    account_number TEXT,
    branch_name TEXT,
    logo_url TEXT,
    principal_name TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial default row
INSERT INTO public.school_settings (
    id, school_name, tagline, campus_address, phone, email,
    bank_name, account_title, account_number, branch_name, principal_name
) VALUES (
    1,
    'Apex Cambridge Grammar School',
    'Affiliated with BISE & Cambridge Assessment International Education',
    'Plot # 18, Block B, Main Boulevard, Gulberg III, Lahore, Pakistan',
    '+92 42 35789123 / +92 300 1234567',
    'info@apexschool.edu.pk',
    'Meezan Bank Limited',
    'Apex Cambridge Grammar School Fee A/C',
    'PK36MEZN0001234567890101',
    'Gulberg III Branch, Lahore',
    'Prof. Muhammad Tariq Khan'
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read school settings" ON public.school_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update school settings" ON public.school_settings
    FOR ALL USING (
        public.current_user_role() IN ('super_admin', 'admin')
        OR auth.uid() IS NOT NULL
    );`}
        </pre>
      </div>
    </div>
  );
}
