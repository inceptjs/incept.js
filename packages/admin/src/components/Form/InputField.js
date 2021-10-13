import React, { useState, useRef } from 'react'
import classes from './Form.module.css'

//in case the parent needs a reference to the field
export default React.forwardRef(function Input(props, ref) {
  //guarantee we have a field reference
  const fieldRef = ref || useRef()
  //separate component related props from field attributes
  const { onChange, stateValue, className, style = {}, ...attributes } = props
  //determine the class name/s
  const classNames = [ classes['form-control'] ]
  if (className) classNames.push(className)

  if (typeof stateValue !== 'undefined') {
    return <input 
      ref={fieldRef}
      className={classNames.join(' ')} 
      style={style}
      {...attributes} 
      onChange={onChange}
      value={stateValue}
    />
  }
  //if value was set react will treat it as readonly, 
  //so we need set an internal state to be able to change it
  //see: https://reactjs.org/docs/forms.html#the-textarea-tag
  const [ value, setValue ] = useState(props.value || '')
  const changeValue = (e) => {
    if (!e.target) return
    setValue(e.target.value || '')
    //allow pass onChange to parent
    if (typeof onChange === 'function') {
      onChange(e)
    }
  }
  //render
  return (
    <input 
      ref={fieldRef}
      className={classNames.join(' ')} 
      style={style}
      onChange={changeValue}
      {...attributes} 
      value={value}
    />
  )
})