import { SupportedLocale } from '../components/FlagIcon';

export interface LocaleConfig {
  code: SupportedLocale;
  label: string;
  nativeName: string;
  shortLabel: string;
  isDefault?: boolean;
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  {
    code: 'vi',
    label: 'Tiếng Việt',
    nativeName: 'Tiếng Việt',
    shortLabel: 'VI',
    isDefault: true
  },
  {
    code: 'en',
    label: 'Tiếng Anh',
    nativeName: 'English',
    shortLabel: 'EN'
  },
  {
    code: 'de',
    label: 'Tiếng Đức',
    nativeName: 'Deutsch',
    shortLabel: 'DE'
  },
  {
    code: 'zh-CN',
    label: 'Tiếng Trung',
    nativeName: '中文',
    shortLabel: 'ZH'
  },
  {
    code: 'ko',
    label: 'Tiếng Hàn',
    nativeName: '한국어',
    shortLabel: 'KO'
  },
  {
    code: 'ja',
    label: 'Tiếng Nhật',
    nativeName: '日本語',
    shortLabel: 'JA'
  },
  {
    code: 'th',
    label: 'Tiếng Thái',
    nativeName: 'ไทย',
    shortLabel: 'TH'
  }
];

export const DEFAULT_LOCALE: SupportedLocale = 'vi';
export const LOCALE_STORAGE_KEY = 'tt_vina_locale';
