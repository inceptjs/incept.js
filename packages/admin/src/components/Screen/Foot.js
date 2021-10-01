//vendor imports
import React from 'react'
//self imports
import classes from './Screen.module.css'

export default function ScreenFoot({ children, style }) {
  return (
    <footer className={classes['screen-foot']} style={style}>
      {children}
    </footer>
  )
}