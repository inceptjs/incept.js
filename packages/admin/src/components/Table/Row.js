//vendor components
import React from 'react'
import PropTypes from 'prop-types'
//self imports
import classes from './Table.module.css'

//main component
export default function TableRow(props) {
  const className = props.stripe
    ? classes['table-row-striped']
    : classes['table-row']

  return <tr className={className} style={props.style}>
    {props.children}
  </tr>
}

TableRow.propTypes = {
  stripe: PropTypes.bool
}

TableRow.defaultProps = {
  stripe: false
}