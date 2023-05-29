//components
//import HTMLHead from 'shared/common/components/Head';
//import Crumbs from '@ev3/ui/dist/tailwind/Crumbs';
//hooks
import { useLanguage } from '@ev3/i18n';

export type User = {};
import { UserDefaultForm, useUserCreate } from '@inceptjs/client';

/**
 * User create body component
 */
const Body = () => {
  //hooks
  const { handlers, input, status, response } = useUserCreate();

  //render
  return (
    <main className="flex-grow h-full relative overflow-auto bg-b0">
      <div className="p-4">
        <UserDefaultForm 
          handlers={handlers}
          data={input}
          response={response}
          status={status}
        />
      </div>
    </main>
  );
};

export default Body;