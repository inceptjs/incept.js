import React from 'react'
import classes from './Tabs.module.css'

export default function TabPanel(props) {
  const { className, style, children } = props
  const classNames = [ classes['tab-panel'] ]
  if (className) {
    classNames.push(className)
  }

  return (
    <div
      className={classNames.join(' ')} 
      style={style}
    >
      {children}
    </div>
  )
}