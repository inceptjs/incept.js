//vendor imports
import React from 'react'
import PropTypes from 'prop-types'
//self imports
import classes from './Screen.module.css'

//main component
export default function ScreenBody(props) {
  //styles
  const style = {}
  if (props.withFoot) {
    style.bottom = 57
  } else if (props.withFoot2) {
    style.bottom = 93
  }

  if (props.style && typeof props.style === 'object') {
    Object.assign(style, props.style)
  }
  //render
  return (
    <section className={classes['screen-body']} style={style}>
      {props.children}
    </section>
  )
}

ScreenBody.propTypes = {
  withFoot: PropTypes.bool,
  withFoot2: PropTypes.bool
}

ScreenBody.defaultProps = {
  withFoot: false,
  withFoot2: false
}