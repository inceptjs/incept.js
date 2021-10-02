//vendor imports
import React from 'react'
import PropTypes from 'prop-types'
//self imports
import classes from './Table.module.css'

//main component
export default function TableFoot(props) {
  //styles
  const style = {}
  if (props.stickyBottom) {
    style.position = 'sticky'
    style.zIndex = 3
    style.bottom = 0
  } 
  if (props.stickyLeft) {
    style.position = 'sticky'
    style.zIndex = 4
    style.left = 0
  }
  if (props.stickyRight) {
    style.position = 'sticky'
    style.zIndex = 2
    style.right = 0
  }
  if (props.noWrap) {
    style.whiteSpace = 'nowrap'
  }
  if (props.style && typeof props.style === 'object') {
    Object.assign(style, props.style)
  }

  //props
  const extras = {}
  if ('rowSpan' in props) {
    extras.rowSpan = props.rowSpan
  }
  if ('colSpan' in props) {
    extras.colSpan = props.colSpan
  }
  return (
    <th 
      className={classes['table-foot']} 
      style={style} 
      {...extras}
    >
      {props.children}
    </th>
  )
}

TableFoot.propTypes = {
  colSpan: PropTypes.number,
  noWrap: PropTypes.bool,
  rowSpan: PropTypes.number,
  stickyBottom: PropTypes.bool,
  stickyLeft: PropTypes.bool,
  stickyRight: PropTypes.bool
}

TableFoot.defaultProps = {
  stickyBottom: false,
  stickyLeft: false,
  stickyRight: false
}