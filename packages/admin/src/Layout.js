//vendor imports
import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
//local imports
import Panel from './components/Panel'
//config imports
import menu from './config/menu'
import screens from './config/screens'
import theme from './config/theme.css'

export default function AdminLayout({ routes = [], settings = {} }) {
  const [ambiance, setAmbiance] = useState(false)
  const changeAmbiance = () => {
    localStorage.setItem('reactiveAmbiance', !ambiance)
    setAmbiance(!ambiance)
  }

  useEffect(() => {
    setAmbiance(localStorage.getItem('reactiveAmbiance') === 'true')
  }, [])
  const ambianceState = { ambiance, setAmbiance, changeAmbiance }

  return (
    <Provider store={screens.store}>
      <section className={ambiance ? theme['theme-dark']: theme['theme-light']}>
        <Panel 
          title={settings.title || 'Incept'} 
          href={settings.href} 
          src={settings.src}
          menu={menu}
          routes={routes} 
          screens={screens}
          ambiance={ambianceState} 
        />
      </section>
    </Provider>
  )
}