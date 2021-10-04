//vendor imports
import React from 'react'
//vendor icons
import IconHome from '../Icon/regular/home'
import IconChevronRight from '../Icon/regular/chevron-right'
import { Link } from 'react-router-dom'

import classes from './Crumbs.module.css'

function Item({ href, title, Icon, last }) {
  const item = href
    ? <Link to={href} className={classes['crumbs-link']}>{title}</Link>
    : <span className={classes['crumbs-item']}>{title}</span>
  
  return (
    <>
      {Icon && <Icon className={classes['crumbs-icon']} />}
      {item}
      {!last && <IconChevronRight size={16} className={classes['crumbs-separator']} />}
    </>
  )
}

export default function Crumbs({ crumbs }) {
  const trail = [
    {
      href: '/',
      icon: IconHome,
      title: 'Admin'
    }, 
    ...crumbs
  ]
  const items = trail.map((item, key) => (
    <Item 
      key={key} 
      href={item.href} 
      title={item.title} 
      Icon={item.icon} 
      last={key === (trail.length - 1)}
    />
  ))

  return <nav className={classes['crumbs']}>{items}</nav>
}