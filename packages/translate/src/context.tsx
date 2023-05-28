//types
import type { I18nContextProps } from './types';
//helpers
import React from 'react';

/**
 * The i18n context
 */
const I18nContext = React.createContext<I18nContextProps>({
  changeLanguage: () => {},
  language: {
    name: 'en_US',
    translations: {}
  },
  placeholder: '%s',
  changeTimezone: () => {},
  timezone: 'UTC'
});

export default I18nContext;



