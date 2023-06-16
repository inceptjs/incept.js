//hooks
import { useContext } from 'react';
//components
import PanelContext from '../context';

export default function useMenu() {
  const { handlers, settings } = useContext(PanelContext);
  return { toggle: handlers.menu.toggle, opened: settings.menu };
}