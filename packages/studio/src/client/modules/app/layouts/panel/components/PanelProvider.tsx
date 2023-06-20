import type { ReactNode } from 'react';
import type { PanelProviderProps } from '../types';
//hooks
import { useState, useRef } from 'react';
//context
import PanelContext from '../context';
import animate from '../../../../common/helpers/animate';

/**
 * The panel provider (this is what to put in app.tsx)
 */
const PanelProvider: React.FC<PanelProviderProps> = (props) => {
  //extract config from props
  const { children } = props;
  
  const [ settings, update ] = useState<{
    menu: boolean,
    mobile: boolean,
    level: number
  }>({
    menu: false,
    mobile: false,
    level: 0
  });

  //we shouldnt put functions or classes in states
  //instead we use a reference to manage the frames
  const mobile = useRef<{
    view: HTMLBaseElement|null,
    frames: ReactNode[]
  }>({
    view: null,
    frames: []
  });

  const handlers = {
    menu: { 
      toggle: () => update(
        settings => ({ ...settings, menu: !settings.menu })
      ) 
    },
    mobile: { 
      open: (opened: boolean) => update(
        settings =>({ ...settings, mobile: opened })
      ),
      push: (frame: ReactNode) => {
        if (!mobile.current.view) return;
        const dimensions = mobile.current.view.getBoundingClientRect();
        const scrollTo = mobile.current.frames.length * dimensions.width;
        mobile.current.frames.push(frame);
        update(settings => ({ 
          ...settings, 
          mobile: true, 
          level: settings.level + 1 
        })); 
        animate({
          start: mobile.current.view.scrollLeft,
          end: scrollTo,
          duration: 200,
          increment: 5,
          update: value => {
            if (!mobile.current.view) return;
            mobile.current.view.scrollLeft = value;
          }
        });
      },
      pop: () => {
        if (!mobile.current.view) return;
        if (mobile.current.frames.length > 1) {
          const dimensions = mobile.current.view.getBoundingClientRect();
          const scrollTo = (mobile.current.frames.length - 2) * dimensions.width;
          animate({
            start: mobile.current.view.scrollLeft,
            end: scrollTo,
            duration: 200,
            increment: 5,
            update: value => {
              if (!mobile.current.view) return;
              mobile.current.view.scrollLeft = value;
            },
            complete: () => {
              mobile.current.frames.pop();
              update(settings => ({ ...settings, level: settings.level - 1 })); 
            }
          });
        } else {
          update(settings => ({ 
            ...settings, 
            mobile: false, 
            level: 0.5
          })); 
          setTimeout(() => {
            mobile.current.frames.pop();
            update(settings => ({ 
              ...settings, 
              mobile: false, 
              level: 0
            })); 
          }, 200)
        }
      },
      clear: () => {
        mobile.current.frames = [];
      },
      update: (index: number, frame: ReactNode) => {
        mobile.current.frames[index] = frame;
      },
      //this is the callback used by other components 
      //to mark the mobile view container element
      view: (el: HTMLBaseElement) => {
        mobile.current.view = el
      }
    }
  };

  const value = { 
    handlers,
    settings, 
    mobile: mobile.current.view, 
    frames: mobile.current.frames
  };
  
  return (
    <PanelContext.Provider value={value}>
      {children}
    </PanelContext.Provider>
  );
};

export default PanelProvider;