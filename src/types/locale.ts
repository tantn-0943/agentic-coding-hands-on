export interface Locale {
  code: 'vi' | 'en'
  label: 'VN' | 'EN'
  flagSrc: string
}

export type LocaleCode = Locale['code']

export const LOCALES: Locale[] = [
  { code: 'vi', label: 'VN', flagSrc: '/icons/vn-flag.svg' },
  { code: 'en', label: 'EN', flagSrc: '/icons/en-flag.svg' },
]

export const DEFAULT_LOCALE: LocaleCode = 'vi'

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'
