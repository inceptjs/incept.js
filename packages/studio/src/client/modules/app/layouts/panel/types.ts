import type { ReactNode } from 'react';

export type PanelContextProps = {
  handlers: {
    menu: { toggle: () => void },
    mobile: { 
      open: (opened: boolean) => void,
      push: (frame: ReactNode) => void,
      pop: () => void,
      clear: () => void,
      update: (index: number, frame: ReactNode) => void
      view: (el: HTMLBaseElement) => void
    }
  },
  settings: {
    menu: boolean,
    mobile: boolean,
    level: number
  }, 
  mobile: HTMLBaseElement|null, 
  frames: ReactNode[]
};

export type PanelProviderProps = {
  children: ReactNode
};

