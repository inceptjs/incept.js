import React from 'react'
import classes from './Tabs.module.css'

export default function TabItem(props) {
  const { className, style, children } = props
  const classNames = [ classes['tab-item'] ]
  if (className) {
    classNames.push(className)
  }

  return (
    <li
      className={classNames.join(' ')} 
      style={style}
    >
      {children}
    </li>
  )
}