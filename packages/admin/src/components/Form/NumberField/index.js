//vendor imports
import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
//vendor components
import InputField from '../InputField'
//self imports
import { getFormatsFromInput, getFormats, padDecimals } from './helpers'

//main component
export default function NumberField(props) {
  //expand props
  const { 
    name,      value,   min,      max,      
    separator, decimal, decimals, abs, 
    ...attributes 
  } = props

  const ref = useRef()
  const options = { min, max, separator, decimal, decimals, abs }
  const initial = getFormats(String(value || ''), options)
  //states
  const [ hiddenValue, setHiddenValue ] = useState(initial.value)
  const [ displayValue, setDisplayValue ] = useState(initial.display)
  const [ cursor, setCursor ] = useState(0)
  //actions
  const format = (e) => {
    const input = e.target
    const pointer = input.selectionStart
    const { value, display } = getFormatsFromInput(input, options)

    if (hiddenValue !== value) {
      setHiddenValue(value)
    }
    
    if (displayValue !== display) {
      if (display.length > displayValue.length) {
        setCursor(pointer + (display.length - displayValue.length) - 1)
      } else if (display.length < displayValue.length) {
        setCursor(pointer - (displayValue.length - display.length) + 1)
      } else {
        setCursor(pointer)
      }
      
      setDisplayValue(display)
    }
  }

  const defocus = () => {
    setDisplayValue(padDecimals(displayValue, decimal, decimals))
  }

  useEffect(() => {
    if (!ref.current) return
    if (cursor >= 0) {
      ref.current.selectionStart = cursor
      ref.current.selectionEnd = cursor
    } 
  })

  return (
    <>
      <input name={name} type="hidden" value={hiddenValue} />
      <InputField 
        ref={ref} 
        {...attributes}
        onChange={format} 
        onBlur={defocus} 
        stateValue={displayValue}  
      />
    </>
  )
}

NumberField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  min: PropTypes.number,
  max: PropTypes.number,
  format: PropTypes.string,
  separator: PropTypes.string,
  decSeparator: PropTypes.string,
  decimals: PropTypes.number,
  abs: PropTypes.bool,
  zeros: PropTypes.bool
}