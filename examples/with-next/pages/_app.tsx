import 'styles/globals.css';

import type { AppProps } from 'next/app';
import { R22nProvider } from 'r22n';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <R22nProvider>
      <Component {...pageProps} session={pageProps.session} />
    </R22nProvider>
  );
};