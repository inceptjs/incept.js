//vendor imports
import React from 'react'
import PropTypes from 'prop-types'
//self imports
import classes from './Table.module.css'

//main component
export default function TableHead(props) {
  //styles
  const style = {}
  if (props.stickyLeft) {
    style.position = 'sticky'
    style.zIndex = 4
    style.left = 0
  }
  if (props.stickyRight) {
    style.position = 'sticky'
    style.zIndex = 4
    style.right = 0
  }
  if (props.stickyTop) {
    style.position = 'sticky'
    style.zIndex = 3
    style.top = 0
  } 
  if (props.noWrap) {
    style.whiteSpace = 'nowrap'
  }
  if (props.style && typeof props.style === 'object') {
    Object.assign(style, props.style)
  }

  //props
  const extras = {}
  if ('rowspan' in props) {
    extras.rowSpan = props.rowspan
  }
  if ('colspan' in props) {
    extras.colSpan = props.colspan
  }
  if ('rowSpan' in props) {
    extras.rowSpan = props.rowSpan
  }
  if ('colSpan' in props) {
    extras.colSpan = props.colSpan
  }
  return (
    <th 
      className={classes['table-head']} 
      style={style} 
      {...extras}
    >
      {props.children}
    </th>
  )
}

TableHead.propTypes = {
  colSpan: PropTypes.number,
  noWrap: PropTypes.bool,
  rowSpan: PropTypes.number,
  stickyLeft: PropTypes.bool,
  stickyRight: PropTypes.bool,
  stickyTop: PropTypes.bool
}

TableHead.defaultProps = {
  stickyLeft: false,
  stickyRight: false,
  stickyTop: false
}