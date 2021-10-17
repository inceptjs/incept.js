import { Switch, Route } from 'inceptjs/components'

import './global.css'

export default function TailwindApp(props) {
  const routes = props.routes || []
  //build the switch cases
  const cases = routes.map((route, key) => {
    return (
      <Route key={key} path={route.path} exact={true}>
        <route.layout {...props}>
          <route.view {...props} />
        </route.layout>
      </Route>
    )
  })
  return React.createElement(Switch, {}, cases)
}