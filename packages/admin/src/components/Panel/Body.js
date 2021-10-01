//vendor imports
import React from 'react'
import { Switch, Route } from 'inceptjs/components'
//self imports
import classes from './Panel.module.css'

//main component
export default function PanelBody(props) {
  const { 
    //array of bread crumbs
    crumbs, 
    //array of route information
    routes, 
    //callback to open right panel
    open, 
    //callback to close right panel
    close, 
    //callback to forward screen right panel
    forward, 
    //callback to backward screen right panel
    backward, 
    //callback to notify for errors or success, etc.
    notify 
  } = props
  //add a home route (TODO)
  routes.push({ href: '/', view: () => <h1>Hello</h1> })
  //build the switch cases
  const cases = routes.filter(route => !!route.view).map((route, key) => (
    <Route key={key} path={route.href}>
      <route.view
        open={open} 
        close={close} 
        forward={forward} 
        backward={backward}
        crumbs={crumbs}
        notify={notify}
      />
    </Route>
  ))
  //render
  return (
    <main className={classes['panel-body']}>
      <Switch>{cases}</Switch>
    </main>
  )
}