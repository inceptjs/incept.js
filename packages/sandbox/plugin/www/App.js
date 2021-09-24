import { Switch, Route } from 'inceptjs/components'

export default function App({ routes, ...other }) {
  //build the switch cases
  const cases = routes.map((route, key) => {
    return (
      <Route key={key} path={route.path} exact>
        <route.layout {...other}>
          <route.view {...other} />
        </route.layout>
      </Route>
    )
  })
  return <Switch>{cases}</Switch>
}