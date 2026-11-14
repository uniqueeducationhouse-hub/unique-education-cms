'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

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
  schoolName: 'Apex Cambridge Grammar School',
  tagline: 'Affiliated with BISE & Cambridge Assessment International Education',
  campusAddress: 'Plot # 18, Block B, Main Boulevard, Gulberg III, Lahore, Pakistan',
  phone: '+92 42 35789123 / +92 300 1234567',
  email: 'info@apexschool.edu.pk',
  bankName: 'Meezan Bank Limited',
  accountTitle: 'Apex Cambridge Grammar School Fee A/C',
  accountNumber: 'PK36MEZN0001234567890101',
  branchName: 'Gulberg III Branch, Lahore',
  logoUrl: null,
  principalName: 'Prof. Muhammad Tariq Khan',
};

const STORAGE_KEY = 'sms_school_settings_pk';

interface SchoolSettingsContextType {
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  uploadLogo: (file: File) => Promise<{ success: boolean; error?: string }>;
  removeLogo: () => void;
  resetSettings: () => void;
  isLoaded: boolean;
}

const SchoolSettingsContext = createContext<SchoolSettingsContextType>({
  settings: DEFAULT_SCHOOL_SETTINGS,
  updateSettings: () => {},
  uploadLogo: async () => ({ success: false }),
  removeLogo: () => {},
  resetSettings: () => {},
  isLoaded: false,
});

export function SchoolSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SCHOOL_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
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
  }, []);

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save school settings to localStorage', e);
      }
      return updated;
    });
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
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        updateSettings({ logoUrl: base64Url });
        resolve({ success: true });
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read image file.' });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeLogo = () => {
    updateSettings({ logoUrl: null });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SCHOOL_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
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
