import React, { useEffect, useState, useRef } from 'react'
import classes from './Form.module.css'

//in case the parent needs a reference to the field
export default React.forwardRef(function Textarea(props, ref) {
  //guarantee we have a field reference
  const fieldRef = ref || useRef()
  //separate component related props from field attributes
  const { onChange, className, style = {}, ...attributes } = props
  //determine the class name/s
  const classNames = [ classes['form-control'] ]
  if (className) classNames.push(className)
  //if value was set react will treat it as readonly, 
  //so we need set an internal state to be able to change it
  //see: https://reactjs.org/docs/forms.html#the-textarea-tag
  const [ value, setValue ] = useState(props.value || '')
  const resize = (e) => {
    if (!e.target) return
    setValue(e.target.value)
    //auto resize
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
    //allow pass onChange to parent
    if (typeof onChange === 'function') {
      onChange(e)
    }
  }
  useEffect(() => {
    //set the initial height
    if (!fieldRef.current) return
    fieldRef.current.style.height = 'auto'
    fieldRef.current.style.height = `${fieldRef.current.scrollHeight}px`
  })
  //render
  return (
    <textarea 
      ref={fieldRef}
      className={classNames.join(' ')} 
      style={style}
      onChange={resize}
      {...attributes} 
      rows={1}
      value={value}
    />
  )
})