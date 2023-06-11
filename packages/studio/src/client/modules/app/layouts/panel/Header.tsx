//types
import type { MouseEventHandler } from 'react';
//hooks
import { useLanguage } from 'r22n';

const Header: React.FC<{
  theme: string,
  setTheme: Function,
  toggleMainMenu: MouseEventHandler,
  toggleUserMenu: MouseEventHandler
}> = ({ theme, setTheme, toggleMainMenu, toggleUserMenu }) => {
  const { _ } = useLanguage();
  const toggle = () => setTheme(
    theme === 'theme-dark' ? 'theme-light' : 'theme-dark'
  );
  return (
    <header className="absolute top-0 left-0 right-0">
      <div className="px-3 flex items-center h-12 py-2">
        <button className="md:hidden block text-2xl mr-3" onClick={toggleMainMenu}>
          <i className="fas fa-bars"></i>
        </button>
        <a className="hidden sm:block" href="/">
          <img alt="shoppable" src="/logo.png" height="32" width="32" />
        </a>
        <a className="uppercase hidden sm:block" href="/">
          {_('Admin Dashboard')}
        </a>
        <div className="flex-grow"></div>
        <div 
          className={`flex justify-center items-center w-7 h-7 rounded-full text-white ${theme === 'theme-dark' ? 'bg-gray-600': 'bg-orange-600'} mr-1`}
          onClick={() => toggle()}
        >
          <i className={`fas fa-${theme === 'theme-dark' ? 'moon': 'sun'}`}></i>
        </div>
        <button className="text-3xl" onClick={toggleUserMenu}>
          <i className="fas fa-user-circle"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;