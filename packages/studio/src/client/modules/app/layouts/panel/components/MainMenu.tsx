import { useLanguage } from 'r22n';
import { NavLink } from 'react-router-dom';

const MainMenu: React.FC<{ opened?: boolean }> = ({ opened = false }) => {
  const { _ } = useLanguage();
  return (
    <aside className={`w-56 text-[13px] duration-200 absolute top-12 bottom-0 z-10 bg-b5 border-r border-b0 overflow-auto md:left-0 ${opened? 'left-0': '-left-56' }`}>
      <NavLink 
        to="/schema" 
        className={({ isActive }) => isActive 
          ? `block px-3 py-5 border-b border-b2 bg-b4 cursor-default`
          : `block px-3 py-5 border-b border-b2 text-t2 hover:bg-b-inverse hover:text-t-inverse`
        }
      >
        <i className="fas fa-fw fa-database"></i>
        <span className="inline-block pl-2">{_('Schemas')}</span>
      </NavLink>
      <NavLink 
        to="/fieldset" 
        className={({ isActive }) => isActive 
          ? `block px-3 py-5 border-b border-b2 bg-b4 cursor-default`
          : `block px-3 py-5 border-b border-b2 text-t2 hover:bg-b-inverse hover:text-t-inverse`
        }
      >
        <i className="fas fa-fw fa-sliders"></i>
        <span className="inline-block pl-2">{_('Fieldsets')}</span>
      </NavLink>
    </aside>
  );
};

export default MainMenu;