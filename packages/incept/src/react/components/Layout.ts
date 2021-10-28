import React, { Attributes, ComponentType } from 'react'

type ComponentRoute = { 
  path: string; 
  view: ComponentType;
  layout: ComponentType;
};

type LayoutProps = Attributes & { 
  view: ComponentType;
  routes: ComponentRoute[];
  routeProps: Attributes;
}

export default function DefaultLayout(props: LayoutProps) {
  const { view, /*routes,*/ routeProps } = props;
  return React.createElement(view, routeProps);
}