import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ComponentRoute } from '..'

type Props = { 
  routes: ComponentRoute[]
}

export default function App({ routes, ...other }: Props) {
  //build the switch cases
  const cases = routes.map((route, key) => {
    return React.createElement(
      Route, 
      { key, path: route.path, exact: true }, 
      React.createElement(
        route.layout, 
        other, 
        React.createElement(route.view, other)
      )
    )
  })
  return React.createElement(Switch, {}, cases)
}