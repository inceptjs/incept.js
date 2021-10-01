//vendor imports
import React from 'react'
import PropTypes from 'prop-types'
//local imports
import IconChevronLeft from '../Icon/regular/chevron-left'
//self imports
import classes from './Screen.module.css'

export default function ScreenHead({ title, onClick, style, children }) {
  return (
    <header className={classes['screen-head']} style={style}>
      <button onClick={onClick} className={classes['screen-head-back']}>
        <IconChevronLeft size={30} />
      </button>
      <h6 className={classes['screen-head-title']}>{title}</h6>
      {children}
    </header>
  )
}

ScreenHead.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func
}