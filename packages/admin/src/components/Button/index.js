import React from 'react'
import classes from './Button.module.css'

export default function Button(props) {
  const type = props.type || 'submit'
  let key = 'solid'
  if ('outline' in props) {
    key = 'outline'
  } else if ('transparent' in props) {
    key = 'transparent'
  }

  let layout = 'default'
  if ('primary' in props) {
    layout = 'primary'
  } else if ('secondary' in props) {
    layout = 'secondary'
  } else if ('error' in props) {
    layout = 'error'
  } else if ('warning' in props) {
    layout = 'warning'
  } else if ('success' in props) {
    layout = 'success'
  }

  const classNames = [
    classes['btn'], 
    classes[`btn-${key}-${layout}`]
  ]

  if ('stretch' in props) {
    classNames.push(classes['btn-stretch'])
  } else if ('stretch-2' in props) {
    classNames.push(classes['btn-stretch-2'])
  } else if ('stretch-3' in props) {
    classNames.push(classes['btn-stretch-3'])
  } else if ('stretch-4' in props) {
    classNames.push(classes['btn-stretch-4'])
  } else if ('stretch-5' in props) {
    classNames.push(classes['btn-stretch-5'])
  } 

  if (props.className) {
    classNames.push(props.className)
  }
  
  const onClick = props.onClick || (() => {})

  return (
    <button type={type} className={classNames.join(' ')} onClick={onClick}>
      {props.icon && <props.icon size="16" className={classes['btn-icon']} />}
      {props.children}
    </button>
  )
}