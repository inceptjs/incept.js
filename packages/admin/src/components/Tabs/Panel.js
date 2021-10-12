import React from 'react'
import classes from './Tabs.module.css'

export default function TabPanel(props) {
  const { active, className, style, children } = props
  const classNames = [ classes['tab-panel'] ]
  if (active) {
    classNames.push(classes['tab-panel-active'])
  }
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