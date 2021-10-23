import React from 'react'
import { EmitterContext } from 'emitrpc-react'
import app from 'inceptjs'

export default function ServerLayout({ children }) {
  return (
    <EmitterContext.Provider value={app}>
      {children}
    </EmitterContext.Provider>
  )
}