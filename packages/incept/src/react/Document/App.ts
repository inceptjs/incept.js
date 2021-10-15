import React, { Attributes } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ComponentRoute } from '..';

type Props = Attributes & { 
  routes: ComponentRoute[]
};

export default function DefaultApp(props: Props) {
  const routes = props.routes || [];
  //build the switch cases
  const cases = routes.map((route, key) => {
    return React.createElement(
      Route, 
      { key, path: route.path, exact: true }, 
      React.createElement(route.view, props)
    );
  });
  return React.createElement(Switch, {}, cases);
}