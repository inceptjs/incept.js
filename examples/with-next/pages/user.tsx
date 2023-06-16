import type { FormEvent } from 'react';
import { UserDefaultForm } from 'inceptjs/client';
import { useForm } from 'inceptjs';

export default function Page() {
  const { input, handlers } = useForm((e: FormEvent<Element>) => {
    e.preventDefault();
    console.log('User form submitted!');
    return false;
  })
  return (
    <UserDefaultForm handlers={handlers} status={'pending'} />
  );

};
