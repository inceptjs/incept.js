//vendor imports
import React from 'react'
//local imports
import IconMenu from '../Icon/regular/Menu'
import IconSun from '../Icon/regular/Sun'
import IconMoon from '../Icon/regular/Moon'
import IconUser from '../Icon/regular/user-circle'
import IconBell from '../Icon/regular/Bell'
import Crumbs from '../Crumbs'
import Button from '../Button'
//self imports
import classes from './Panel.module.css'

//main component
export default function PanelHead({ toggle, crumbs, ambiance }) {
  //render
  return (
    <header className={classes['panel-head']}>
      <div className={classes['panel-head-top']}>
        <Button transparent onClick={toggle} >
          <IconMenu className={classes['panel-head-menu-toggle']} />
        </Button>
        <div style={{ flexGrow: 1 }} />
        <IconBell 
          className={classes['panel-head-icon']} 
        />
        {ambiance && ambiance.ambiance
          ? (
            <IconMoon 
              className={classes['panel-head-icon']} 
              onClick={ambiance.changeAmbiance} 
              style={{ marginLeft: 10 }}
            /> 
          ) : (
            <IconSun 
              className={classes['panel-head-icon']} 
              onClick={ambiance.changeAmbiance} 
              style={{ marginLeft: 10 }}
            />
          )
        }
        <IconUser 
          className={classes['panel-head-icon']} 
          style={{ marginLeft: 10 }}
        />
      </div>
      <Crumbs crumbs={crumbs} />
    </header>
  )
}