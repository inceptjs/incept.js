import { useState } from 'react'; 

export default function usePanelMenus() {

  const [menuStates, setMenuStates ] = useState({
    mainMenuOpened: false,
    userMenuOpened: false
  });
  //open or close the main menu
  const toggleMainMenu = () => setMenuStates({
    mainMenuOpened: !menuStates.mainMenuOpened,
    userMenuOpened: false
  });
  //open or close the user menu
  const toggleUserMenu = () => setMenuStates({
    mainMenuOpened: false,
    userMenuOpened: !menuStates.userMenuOpened
  });

  return {
    main: {
      opened: menuStates.mainMenuOpened,
      toggle: toggleMainMenu
    },
    user: {
      opened: menuStates.userMenuOpened,
      toggle: toggleUserMenu
    }
  };
};