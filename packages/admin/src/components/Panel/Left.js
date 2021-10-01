//vendor imports
import React from 'react'
//local imports
import Button from '../Button'
import IconChevronLeft from '../Icon/regular/chevron-left'
//self imports
import Menu from './Menu'
import classes from './Panel.module.css'

//main component
export default function PanelLeft(props) {
  //expand props
  const { src, href, title, menu, open, toggle } = props

  //render
  return (
    <aside className={classes['panel-left']}>
      <header className={classes['panel-left-head']}>
        <Button 
          transparent
          type="button" 
          className={classes['panel-left-head-button']} 
          onClick={toggle}
        >
          <IconChevronLeft />
        </Button>
        <a className={classes['panel-left-head-link']} href={href}>
          {src && <img 
            src={src} 
            height="20" 
            width="20" 
            onError="this.style.display='none'" 
          />}
          {title}
        </a>
      </header>
      <main className={classes['panel-left-menu']}>
        <Menu items={menu} classes={classes} />
      </main>
    </aside>
  )
}