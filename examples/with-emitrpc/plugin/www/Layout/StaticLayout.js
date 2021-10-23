import React from 'react'
import { RPCEmitter } from 'emitrpc'
import { EmitterContext } from 'emitrpc-react'

const emitter = new RPCEmitter('/emitrpc')

export default function StaticLayout({ children }) {
  return (
    <EmitterContext.Provider value={emitter}>
      {children}
    </EmitterContext.Provider>
  )
}