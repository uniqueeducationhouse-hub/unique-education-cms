'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  campusAddress: string;
  phone: string;
  email: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  branchName: string;
  logoUrl: string | null;
  principalName: string;
}

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  schoolName: 'Unique Education, Pakistan Campus',
  tagline: 'Excellence in Education & Professional Development',
  campusAddress: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
  phone: '+92 42 35789123 / +92 300 1234567',
  email: 'info@uniqueeducation.edu.pk',
  bankName: 'Meezan Bank Limited',
  accountTitle: 'Unique Education Fee Collection A/C',
  accountNumber: 'PK36MEZN0001234567890101',
  branchName: 'Gulberg III Branch, Lahore',
  logoUrl: '/logo.png',
  principalName: 'Prof. Muhammad Tariq Khan',
};

const STORAGE_KEY = 'sms_school_settings_pk';

interface SchoolSettingsContextType {
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => Promise<void>;
  uploadLogo: (file: File) => Promise<{ success: boolean; error?: string }>;
  removeLogo: () => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoaded: boolean;
}

const SchoolSettingsContext = createContext<SchoolSettingsContextType>({
  settings: DEFAULT_SCHOOL_SETTINGS,
  updateSettings: async () => {},
  uploadLogo: async () => ({ success: false }),
  removeLogo: async () => {},
  resetSettings: async () => {},
  isLoaded: false,
});

export function SchoolSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SCHOOL_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const supabase = createClient();

  // Load from Supabase (with localStorage fallback) on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('school_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (data && !error) {
          const loaded: SchoolSettings = {
            schoolName: data.school_name || DEFAULT_SCHOOL_SETTINGS.schoolName,
            tagline: data.tagline || DEFAULT_SCHOOL_SETTINGS.tagline,
            campusAddress: data.campus_address || DEFAULT_SCHOOL_SETTINGS.campusAddress,
            phone: data.phone || DEFAULT_SCHOOL_SETTINGS.phone,
            email: data.email || DEFAULT_SCHOOL_SETTINGS.email,
            bankName: data.bank_name || DEFAULT_SCHOOL_SETTINGS.bankName,
            accountTitle: data.account_title || DEFAULT_SCHOOL_SETTINGS.accountTitle,
            accountNumber: data.account_number || DEFAULT_SCHOOL_SETTINGS.accountNumber,
            branchName: data.branch_name || DEFAULT_SCHOOL_SETTINGS.branchName,
            logoUrl: data.logo_url || '/logo.png',
            principalName: data.principal_name || DEFAULT_SCHOOL_SETTINGS.principalName,
          };
          setSettings(loaded);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
          setIsLoaded(true);
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch school_settings failed, falling back to local storage', err);
      }

      // Fallback to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.warn('Failed to load school settings from localStorage', e);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchSettings();
  }, [supabase]);

  const updateSettings = async (newSettings: Partial<SchoolSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    // Save to localStorage immediately for resilient offline/fallback state
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    // Save to Supabase school_settings table
    try {
      const dbPayload = {
        id: 1,
        school_name: updated.schoolName,
        tagline: updated.tagline,
        campus_address: updated.campusAddress,
        phone: updated.phone,
        email: updated.email,
        bank_name: updated.bankName,
        account_title: updated.accountTitle,
        account_number: updated.accountNumber,
        branch_name: updated.branchName,
        logo_url: updated.logoUrl,
        principal_name: updated.principalName,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('school_settings').upsert(dbPayload);
      if (error) {
        console.warn('Supabase school_settings upsert error:', error.message);
      }
    } catch (err) {
      console.warn('Failed to persist school settings to Supabase', err);
    }
  };

  const uploadLogo = async (file: File): Promise<{ success: boolean; error?: string }> => {
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Please upload a valid image file (PNG, JPG, or WEBP).' };
    }
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'Logo image must be under 2MB in size.' };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Url = e.target?.result as string;
        await updateSettings({ logoUrl: base64Url });
        resolve({ success: true });
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read image file.' });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeLogo = async () => {
    await updateSettings({ logoUrl: null });
  };

  const resetSettings = async () => {
    setSettings(DEFAULT_SCHOOL_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
      await supabase.from('school_settings').upsert({
        id: 1,
        school_name: DEFAULT_SCHOOL_SETTINGS.schoolName,
        tagline: DEFAULT_SCHOOL_SETTINGS.tagline,
        campus_address: DEFAULT_SCHOOL_SETTINGS.campusAddress,
        phone: DEFAULT_SCHOOL_SETTINGS.phone,
        email: DEFAULT_SCHOOL_SETTINGS.email,
        bank_name: DEFAULT_SCHOOL_SETTINGS.bankName,
        account_title: DEFAULT_SCHOOL_SETTINGS.accountTitle,
        account_number: DEFAULT_SCHOOL_SETTINGS.accountNumber,
        branch_name: DEFAULT_SCHOOL_SETTINGS.branchName,
        logo_url: null,
        principal_name: DEFAULT_SCHOOL_SETTINGS.principalName,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Error resetting settings', e);
    }
  };

  return (
    <SchoolSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        uploadLogo,
        removeLogo,
        resetSettings,
        isLoaded,
      }}
    >
      {children}
    </SchoolSettingsContext.Provider>
  );
}

export function useSchoolSettings() {
  return useContext(SchoolSettingsContext);
}
