//vendor imports
import React from 'react'
//self imports
import ScreenHead from './Head'
import ScreenBody from './Body'
import ScreenFoot from './Foot'

import classes from './Screen.module.css'

export default function Screen({ children }) {
  return (
    <section className={classes['screen']}>
      {children}
    </section>
  )
}

Screen.Head = ScreenHead
Screen.Body = ScreenBody
Screen.Foot = ScreenFoot