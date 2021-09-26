//vendor imports
import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
//config imports
import screens from './config/screens'

export default function AdminLayout({ routes, settings = {} }) {
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
      <Panel 
        title={settings.title} 
        href={settings.href} 
        src={settings.src}
        menu={menu}
        routes={routes} 
        screens={screens}
        ambiance={ambianceState} 
      />
    </Provider>
  )
}