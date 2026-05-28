import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, TranslationKeys } from './translations';

export interface Language {
  code: string;
  label: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'VI', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'KO', label: '한국어', flag: '🇰🇷' },
  { code: 'ZH', label: '中文 (简体)', flag: '🇨🇳' },
  { code: 'JA', label: '日本語', flag: '🇯🇵' },
  { code: 'TH', label: 'ไทย', flag: '🇹🇭' }
];

interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('tt_vina_preferred_language');
      if (stored) {
        const found = LANGUAGES.find(l => l.code === stored);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return LANGUAGES[0]; // defaults to VI
  });

  useEffect(() => {
    try {
      localStorage.setItem('tt_vina_preferred_language', currentLang.code);
    } catch {
      // ignore
    }
  }, [currentLang]);

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
  };

  const t = (key: keyof TranslationKeys): string => {
    const dictionary = TRANSLATIONS[currentLang.code] || TRANSLATIONS['VI'];
    return dictionary[key] ?? TRANSLATIONS['VI'][key] ?? String(key);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
