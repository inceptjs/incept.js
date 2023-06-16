//hooks
import { useContext } from 'react';
//components
import PanelContext from '../context';

export default function useMobile() {
  const { handlers, settings, mobile, frames } = useContext(PanelContext);
  return { 
    mobile,
    frames, 
    opened: settings.mobile,
    handlers: handlers.mobile
  };
}