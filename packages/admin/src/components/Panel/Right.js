//vendor imports
import React from 'react'
//self imports
import classes from './Panel.module.css'

//main component
export default React.forwardRef(function PanelRight(props, ref) {
  //expand props
  const { screens, close } = props
  //render
  return (
    <aside ref={ref} className={classes['panel-right']}>{screens}</aside>
  )
})