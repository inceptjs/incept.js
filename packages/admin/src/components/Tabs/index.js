import React, { useState } from 'react'
import TabItem from './Tab'
import TabPanel from './Panel'
import classes from './Tabs.module.css'

//helpers
function getTabs(children) {
  const tabs = []
  for (const child of children) {
    if (Array.isArray(child)) {
      tabs.push.apply(tabs, getTabs(child))
    } else if (child.type && child.type.name === 'TabItem') {
      tabs.push(child)
    } else if (child.props && 'tabitem' in child.props) {
      tabs.push(child)
    }
  }

  return tabs
}

function getPanels(children) {
  const panels = []
  for (const child of children) {
    if (Array.isArray(child)) {
      panels.push.apply(panels, getPanels(child))
    } else if (child.type && child.type.name === 'TabPanel') {
      panels.push(child)
    } else if (child.props && 'tabpanel' in child.props) {
      panels.push(child)
    }
  }

  return panels
}

export default function Tabs(props) {
  const { value, onChange, className, style, children } = props
  const classNames = [ classes['tabs'] ]
  if (className) {
    classNames.push(className)
  }
  const [ index, setTab ] = useState(value)
  const selectTab = (e) => {
    console.log(e.target)
  }

  const tabs = getTabs(children)
  const panels = getPanels(children)

  return (
    <div
      className={classNames.join(' ')} 
      style={style}
    >
      {tabs.length && <ul 
        className={classes['tab-list']} 
        onClick={selectTab}
      >
        {tabs}
      </ul>}
      {panels}
    </div>
  )
}

export { Tabs, TabItem, TabPanel }