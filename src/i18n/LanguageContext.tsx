import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SupportedLocale } from '../components/FlagIcon';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from './config';

import viData from './locales/vi.json';
import enData from './locales/en.json';
import deData from './locales/de.json';
import zhData from './locales/zh-CN.json';
import koData from './locales/ko.json';
import jaData from './locales/ja.json';
import thData from './locales/th.json';

const TRANSLATIONS_MAP: Record<SupportedLocale, Record<string, any>> = {
  'vi': viData,
  'en': enData,
  'de': deData,
  'zh-CN': zhData,
  'ko': koData,
  'ja': jaData,
  'th': thData,
};

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as SupportedLocale;
      if (saved && SUPPORTED_LOCALES.some(l => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('Cannot read locale from storage:', e);
    }
    return DEFAULT_LOCALE;
  });

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    if (!SUPPORTED_LOCALES.some(l => l.code === newLocale)) return;
    setLocaleState(newLocale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      // Also sync document lang
      document.documentElement.lang = newLocale;
    } catch (e) {
      console.warn('Cannot save locale to storage:', e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback((key: string, fallback?: string): string => {
    const keys = key.split('.');
    const currentDict = TRANSLATIONS_MAP[locale] || TRANSLATIONS_MAP[DEFAULT_LOCALE];
    const defaultDict = TRANSLATIONS_MAP[DEFAULT_LOCALE];

    let val: any = currentDict;
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        val = undefined;
        break;
      }
    }

    if (val !== undefined && typeof val === 'string') {
      return val;
    }

    // Fallback to Vietnamese
    let fbVal: any = defaultDict;
    for (const k of keys) {
      if (fbVal && typeof fbVal === 'object' && k in fbVal) {
        fbVal = fbVal[k];
      } else {
        fbVal = undefined;
        break;
      }
    }

    if (fbVal !== undefined && typeof fbVal === 'string') {
      return fbVal;
    }

    return fallback !== undefined ? fallback : key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
