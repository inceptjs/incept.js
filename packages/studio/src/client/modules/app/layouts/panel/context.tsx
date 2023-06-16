//types
import type { ReactNode } from 'react';
import type { PanelContextProps } from './types';
//helpers
import React from 'react';

const noop = () => {};

/**
 * The i18n context
 */
const PanelContext = React.createContext<PanelContextProps>({ 
  handlers: {
    menu: { toggle: noop },
    mobile: { 
      open: (opened: boolean) => {},
      push: (frame: ReactNode) => {},
      pop: noop,
      clear: noop,
      update: (index: number, frame: ReactNode) => {},
      view: (el: HTMLBaseElement) => {}
    }
  },
  settings: {
    menu: false,
    mobile: false,
    level: 0
  }, 
  mobile: null, 
  frames: []
});

export default PanelContext;



