import React, { ReactNode } from 'react'

type Props = { children: ReactNode[] }

export default function Layout({ children }: Props) {
  return React.createElement('div', {}, children)
}