//types
import type { MouseEventHandler } from 'react';
//hooks
import { useLanguage } from 'r22n';
//components
import { Link } from 'react-router-dom';

const Header: React.FC<{
  theme: string,
  setTheme: Function,
  toggle: MouseEventHandler
}> = ({ theme, setTheme, toggle }) => {
  const { _ } = useLanguage();
  const change = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return (
    <header className="absolute top-0 left-0 right-0 bg-b4 border-b border-b0 z-20">
      <div className="flex items-center">
        <div className="md:w-56 h-12 px-3 py-2 flex items-center md:bg-b3 hover:bg-b3 md:border-r border-b0">
          <button className="md:hidden block text-2xl" onClick={toggle}>
            <i className="fas fa-bars"></i>
          </button>
          <Link className="hidden md:block" to="/">
            <img alt="incept" src="https://www.incept.asia/images/logo/incept-logo-square-1.png" height="20" width="20" />
          </Link>
          <Link className="ml-2 font-bold uppercase hidden md:block" to="/">
            {_('Incept Studio')}
          </Link>
        </div>
        <div className="flex-grow"></div>
        <div 
          className={`flex justify-center items-center w-7 h-7 mr-3 rounded-full text-white ${theme === 'dark' ? 'bg-gray-600': 'bg-orange-600'} mr-1`}
          onClick={change}
        >
          <i className={`fas fa-${theme === 'dark' ? 'moon': 'sun'}`}></i>
        </div>
      </div>
    </header>
  );
};

export default Header;