//vendor imports
import React from 'react'

const origin = { vertical: 'bottom', horizontal: 'left' }

//main component
export default function Notify({ clear, message, severity = 'info' }) {
  if (!message.length) {
    return <></>
  }

  const close = () => clear()

  return (
    <div onClick={close}>
      {severity} {message}
    </div>
  )
}