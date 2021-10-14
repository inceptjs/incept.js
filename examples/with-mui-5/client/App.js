import { Switch, Route } from 'inceptjs/components'

export default function App(props) {
  //build the switch cases
  const cases = props.routes.map((route, key) => {
    return (
      <Route key={key} path={route.path} exact>
        <route.layout {...props}>
          <route.view {...props} />
        </route.layout>
      </Route>
    )
  });
  return <Switch>{cases}</Switch>
}