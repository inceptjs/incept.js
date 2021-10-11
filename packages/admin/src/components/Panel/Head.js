//vendor imports
import React from 'react'
//local imports
import IconMenu from '@inceptjs/icons/regular/Menu'
import IconSun from '@inceptjs/icons/regular/Sun'
import IconMoon from '@inceptjs/icons/regular/Moon'
import IconUser from '@inceptjs/icons/regular/user-circle'
import IconBell from '@inceptjs/icons/regular/Bell'
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
        <Button transparent onClick={ambiance.changeAmbiance} >
          {ambiance && ambiance.ambiance
            ? (
              <IconMoon 
                className={classes['panel-head-icon']} 
                style={{ marginLeft: 10 }}
              /> 
            ) : (
              <IconSun 
                className={classes['panel-head-icon']} 
                style={{ marginLeft: 10 }}
              />
            )
          }
        </Button>
        <IconUser 
          className={classes['panel-head-icon']} 
          style={{ marginLeft: 10 }}
        />
      </div>
      <Crumbs crumbs={crumbs} />
    </header>
  )
}