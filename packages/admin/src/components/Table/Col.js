//vendor imports
import React from 'react'
import PropTypes from 'prop-types'
//self imports
import classes from './Table.module.css'

function Rule({width}) {
  const style = {
    border: 0,
    margin: 0,
    width: width
  }
  return <hr style={style} />
}

//main component
export default function TableCol(props) {
  //styles
  const style = {}
  if (props.stickyBottom) {
    style.position = 'sticky'
    style.zIndex = 1
    style.bottom = 0
  } 
  if (props.stickyLeft) {
    style.position = 'sticky'
    style.zIndex = 2
    style.left = 0
  }
  if (props.stickyRight) {
    style.position = 'sticky'
    style.zIndex = 2
    style.right = 0
  }
  if (props.stickyTop) {
    style.position = 'sticky'
    style.zIndex = 1
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
  if ('rowSpan' in props) {
    extras.rowSpan = props.rowSpan
  }
  if ('colSpan' in props) {
    extras.colSpan = props.colSpan
  }

  let rule = null
  if (props.wrap1) {
    rule = <Rule width={100} />
  } else if (props.wrap2) {
    rule = <Rule width={200} />
  } else if (props.wrap3) {
    rule = <Rule width={300} />
  } else if (props.wrap4) {
    rule = <Rule width={400} />
  } else if (props.wrap5) {
    rule = <Rule width={500} />
  } 
  return (
    <td 
      className={classes['table-col']} 
      style={style} 
      {...extras}
    >
      {props.children}
      {rule}
    </td>
  )
}

TableCol.propTypes = {
  colSpan: PropTypes.number,
  noWrap: PropTypes.bool,
  rowSpan: PropTypes.number,
  stickyBottom: PropTypes.bool,
  stickyLeft: PropTypes.bool,
  stickyRight: PropTypes.bool,
  stickyTop: PropTypes.bool,
  wrap1: PropTypes.bool,
  wrap2: PropTypes.bool,
  wrap3: PropTypes.bool,
  wrap4: PropTypes.bool,
  wrap5: PropTypes.bool
}

TableCol.defaultProps = {
  noWrap: false,
  stickyBottom: false,
  stickyLeft: false,
  stickyRight: false,
  stickyTop: false,
  wrap1: false,
  wrap2: false,
  wrap3: false,
  wrap4: false,
  wrap5: false
}