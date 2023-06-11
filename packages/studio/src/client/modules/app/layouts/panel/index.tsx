//hooks
import { useEffect } from 'react';
import useTheme from '../../../common/hooks/useTheme';
import usePanelMenus from './usePanelMenus';
//components
import { ToastContainer } from '../../../common/components/global/notify';
import { ModalProvider } from '../../../common/components/global/modal';
import Header from './Header';
import MainMenu from './MainMenu';
//others
import { unload } from '../../../common/components/global/notify';

const LayoutPanelPage: React.FC<{
  head?: React.FC,
  children?: React.ReactNode
}> = props => {
  const { main, user } = usePanelMenus();
  const { current: theme, set: setTheme } = useTheme();
  //unload flash message
  useEffect(unload, []);
  return (
    <section className={`${theme} bg-b1 text-t1 relative w-full h-full overflow-hidden`}>
      <>{props.head && <props.head />}</>
      <Header 
        theme={theme}
        setTheme={setTheme}
        toggleMainMenu={() => main.toggle()} 
        toggleUserMenu={() => user.toggle()}
      />
      <MainMenu open={main.opened} />
      <section className="absolute top-12 bottom-0 left-0 md:left-64 right-0">
        {props.children}
      </section>
      <ModalProvider />
      <ToastContainer />
    </section>
  );
};

export { Header, MainMenu };

export default LayoutPanelPage;