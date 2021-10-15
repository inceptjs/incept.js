import { ReactNode } from 'react'

type Props = { children: ReactNode[] }

export default function DefaultLayout({ children }: Props) {
  return children
}