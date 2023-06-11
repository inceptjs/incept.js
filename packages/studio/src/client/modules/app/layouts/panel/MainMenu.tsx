import { useLanguage } from 'r22n';

const MainMenu: React.FC<{ open?: boolean }> = ({ open = false }) => {
  const { _ } = useLanguage();
  return (
    <aside className={`w-64 duration-200 absolute top-12 bottom-0 z-50 bg-b3 border-r border-b1 overflow-auto md:left-0 ${open? 'left-0': '-left-64' }`}>
      <a href="/request" className={`block p-3 border-b border-solid border-b2 cursor-pointer`}>
        <i className="text-t2 fas fa-fw fa-bullhorn"></i>
        <span className="inline-block pl-2">{_('Requests')}</span>
      </a>
      <a href="/company" className={`block p-3 border-b border-solid border-b2 cursor-pointer`}>
        <i className="text-t2 fas fa-fw fa-shop"></i>
        <span className="inline-block pl-2">{_('Companies')}</span>
      </a>
      <a href="/user" className={`block p-3 border-b border-solid border-b2 cursor-pointer`}>
        <i className="text-t2 fas fa-fw fa-users"></i>
        <span className="inline-block pl-2">{_('Users')}</span>
      </a>
    </aside>
  );
};

export default MainMenu;