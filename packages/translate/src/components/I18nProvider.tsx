import type { Language, I18nProviderProps } from '../types';
//hooks
import { useState, useEffect } from 'react';
//context
import I18nContext from '../context';

/**
 * The i18n provider (this is what to put in app.tsx)
 */
const I18nProvider: React.FC<I18nProviderProps> = (props) => {
  const { children, ...config} = props;

  if (!config.translations) {
    config.translations = {};
  }

  if (!config.timezone) {
    config.timezone = 'UTC';
  }

  const [ 
    timezone, 
    changeTimezone
  ] = useState(config.timezone);
  const [ 
    language, 
    setLanguage 
  ] = useState<Language>({
    name: 'en_US',
    translations: {}
  });
  useEffect(() => {
    setLanguage({
      name: config.language as string,
      translations: config.translations as Record<string, string>
    });
  }, []) ;

  const changeLanguage = (
    language: string, 
    translations?: Record<string, string>
  ) => {
    if (!translations) {
      translations = {};
    }
    setLanguage({ name: language, translations: translations });
  };
  
  const value = {
    placeholder: config.placeholder || '%s',
    language,
    changeLanguage,
    timezone,
    changeTimezone,
  };
  
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nProvider;