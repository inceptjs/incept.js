//components
import HTMLHead from 'shared/common/components/Head';
import Crumbs from '@inceptjs/react/dist/Crumbs';
//hooks
import useLanguage from '@inceptjs/translate/dist/hooks/useLanguage';

export type User = {};

import {
  //so you can make your own form
  UserFormFields,
  //so you can make your own filter form
  UserFilterFields,
  //so you can make your own table
  UserListFormats,
  //so you can make your own detail
  UserViewFormats,
  //default form
  UserDefaultForm,
  //default view
  UserDefaultView,
  //default filter form
  UserDefaultFilters,
  //default table
  UserDefaultTable,
  //rest calls
  useUserCreate,
  useUserUpdate,
  useUserRemove,
  useUserView,
  useUserRows
} from '.ev3/client';

const {
  NameField,
  UsernameField,
  PasswordField,
  RoleField
} = UserFormFields;

const {
  RoleFilter,
  ActiveFilter
} = UserFilterFields;

const {
  NameFormat,
  UsernameFormat,
  RoleFormat,
  ActiveFormat,
  CreatedAtFormat,
  UpdatedAtFormat
} = UserViewFormats;

/**
 * User create body component
 */
export const Body = () => {
  //hooks
  const { _ } = useLanguage();
  const { handlers, input, status, response } = useUserCreate();
  const { handlers, input, status, response } = useUserUpdate(id);
  const { handlers, status, response } = useUserRemove(id);
  const { status, response } = useUserView(id);
  const { status, response } = useUserRows();

  //render
  return (
    <main className="flex-grow h-full relative overflow-auto bg-b0">
      <div className="p-4">
        <UserForm 
          handlers={handlers}
          data={input} 
          response={response} 
          status={status}
        />
        <UserFilter 
          handlers={handlers}
          data={input} 
        />
        <UserView response={response} status={status} />
        <UserTable response={response} status={status} />
      </div>
    </main>
  );
};

/**
 * User create head component
 */
export const Head = () => {
  const { _ } = useLanguage();
  return (
    <HTMLHead>
      <title>{_('Create User')}</title>
    </HTMLHead>
  );
};