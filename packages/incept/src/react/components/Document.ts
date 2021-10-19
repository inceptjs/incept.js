import React from 'react'

export default function HTML(props: Record<string, any>) {
  const { 
    title,  meta, links,     scripts, 
    styles, App,  htmlProps, bodyProps 
  } = props

  return React.createElement('html', htmlProps,
    React.createElement('head', {}, title, meta, links, styles),
    React.createElement('body', bodyProps,
      React.createElement(App),
      scripts
    )
  )
}