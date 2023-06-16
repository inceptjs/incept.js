import { useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';

export default function useTheme(init = 'dark') {
  const [ theme, setTheme ] = useState<string>(
    () => getCookie('theme') as string || init
  );

  const set = (theme: string) => {
    setCookie('theme', theme);
    setTheme(theme);
  }

  return { current: theme, set };
};