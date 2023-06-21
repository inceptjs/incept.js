import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
//providers
import { R22nProvider } from 'r22n';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//components
import Loader from 'frui/tailwind/Loader';
import PanelProvider from './layouts/panel/components/PanelProvider';
import PanelLayout from './layouts/panel/components/PanelLayout';
import ErrorPage from './500';
//pages
const SchemaPage = React.lazy(() => import('../schema/pages/SchemaPage'));
const FieldsetPage = React.lazy(() => import('../fieldset/pages/FieldsetPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (<PanelLayout />),
    errorElement: (<ErrorPage />),
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<Loader />}>
            <SchemaPage />
          </React.Suspense>
        )
      },
      {
        path: '/schema',
        element: (
          <React.Suspense fallback={<Loader />}>
            <SchemaPage />
          </React.Suspense>
        )
      },
      {
        path: '/fieldset',
        element: (
          <React.Suspense fallback={<Loader />}>
            <FieldsetPage />
          </React.Suspense>
        )
      }
    ]
  },
]);

export default function App() {
  return (
    <R22nProvider>
      <PanelProvider>
        <RouterProvider router={router} />
      </PanelProvider>
    </R22nProvider>
  );
}