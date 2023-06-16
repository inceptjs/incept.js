//hooks
import { useEffect } from 'react';
import useTheme from '../../../../common/hooks/useTheme';
import useMenu from '../hooks/useMenu';
import useMobile from '../hooks/useMobile';
//components
import { Outlet } from 'react-router-dom';
import { ToastContainer } from '../../../../common/components/notify';
import { ModalProvider } from '../../../../common/components/modal';
import Header from './Header';
import MainMenu from './MainMenu';
import MobileMenu from './MobileView';
//others
import { unload } from '../../../../common/components/notify';

const PanelLayout: React.FC<{
  head?: React.FC,
  children?: React.ReactNode
}> = props => {
  const { toggle, opened: mainOpened } = useMenu();
  const { handlers, frames, opened: mobileOpened } = useMobile();
  const { current: theme, set: setTheme } = useTheme();
  //unload flash message
  useEffect(unload, []);
  return (
    <section className={`${theme} bg-b4 text-t1 relative w-full h-full overflow-hidden`}>
      <>{props.head && <props.head />}</>
      <Header 
        theme={theme}
        setTheme={setTheme}
        toggle={toggle} 
      />
      <MainMenu opened={mainOpened} />
      <MobileMenu opened={mobileOpened} view={handlers.view}>
        {frames}
      </MobileMenu>
      <section className="absolute top-12 bottom-0 left-0 md:left-56 right-0">
        <Outlet />
      </section>
      <ModalProvider />
      <ToastContainer />
    </section>
  );
};

export { Header, MainMenu, MobileMenu };
export default PanelLayout;