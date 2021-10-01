//vendor imports
import React, { useState } from 'react'
import { Link } from 'inceptjs/components'

export default function Menu(props) {
  const { classes, items, opened = true, level = 0 } = props
  const children = items.map((item, i) => (
    <MenuItem item={item} key={i} level={level} classes={classes} />
  ))

  return (
    <ul 
      className={classes['panel-left-menu-list']}
      style={{ height: opened ? 'auto': 0 }}
    >
      {children}
    </ul>
  )
}

function MenuItem({ classes, item, level }) {
  if (item.children) {
    const [ opened, open ] = useState(false)
    const onClick = () => { open(!opened) }
    return (
      <li>
        <a 
          className={classes['panel-left-menu-link']} 
          style={{ paddingLeft: (30 * level) + 20 }} 
          onClick={onClick}
        >
          {item.icon && <item.icon 
            className={classes['panel-left-menu-icon']} 
          />}
          <span>{item.title}</span>
        </a>
        <Menu 
          classes={classes}
          items={item.children} 
          opened={opened} 
          level={level + 1} 
        />
      </li>
    )
  }

  if (item.href) {
    return (
      <li>
        <Link 
          to={item.href} 
          className={classes['panel-left-menu-link']}
          style={{ paddingLeft: (30 * level) + 20 }} 
        >
          {item.icon && <item.icon 
            className={classes['panel-left-menu-icon']} 
          />}
          <span>{item.title}</span>
        </Link>
      </li>
    )
  }

  const onClick = () => {
    //TODO
  }
  
  return (
    <li>
      <a 
        className={classes['panel-left-menu-link']} 
        onClick={onClick}
        style={{ paddingLeft: (30 * level) + 20 }} 
      >
        {item.icon && <item.icon 
          className={classes['panel-left-menu-icon']} 
        />}
        <span>{item.title}</span>
      </a>
    </li>
  )
}