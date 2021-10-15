import React, { ReactElement } from 'react'

type Props = { 
  Head: ReactElement, 
  Body: ReactElement,
  props: { [key: string]: any }
}

export default function HTML({ Head, Body, props = {} }: Props) {
  return React.createElement('html', props, Head, Body)
}