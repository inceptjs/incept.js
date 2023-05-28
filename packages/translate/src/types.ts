import { ReactNode } from 'react';

export type Language = {
  name: string,
  translations: Record<string, string>
};

export type I18nContextProps = {
  placeholder: string,
  language: Language,
  changeLanguage: (language: string, translations?: Record<string, string>) => void,
  timezone: string,
  changeTimezone: (timezone: string) => void,
};

export type I18nProviderProps = {
  language?: string,
  translations?: Record<string, string>,
  placeholder?: string,
  timezone?: string,
  children: ReactNode
};

