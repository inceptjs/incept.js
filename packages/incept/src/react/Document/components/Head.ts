import React from 'react'

type Props = { 
  title?: string, 
  props?: { [key: string]: any }, 
  children?: React.ReactNode[]
}

export default function HTMLHead(headProps: Props = {}) {
  const { title = '', props = {}, children = [] } = headProps
  return React.createElement('head', props,
    React.createElement('title', {}, title),
    ...children
  )
}