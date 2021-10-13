//vendor imports
import React, { useState, useRef } from 'react'
import IconPlus from '@inceptjs/icons/regular/Plus'
import IconRemove from '@inceptjs/icons/regular/X'
import Button from '../Button'
import Input from './InputField'
//self imports
import classes from './Form.module.css'

function ItemField({ onChange, name, value, index, values, set }) {
  const update = () => {
    if (!ref.current) {
      return
    }

    const newValues = [ ...values ]
    newValues[index] = ref.current.value
    set(newValues)
    //allow pass onChange to parent
    if (typeof onChange === 'function') {
      onChange(e)
    }
  }

  const remove = () => {
    const newValues = [ ...values ]
    newValues[index] = false
    set(newValues)
  }

  const ref = React.createRef()

  return (
    <div className={classes['field-textlist-display']}>
      <Input 
        ref={ref}
        className={classes['field-textlist-display-value']}
        name={name}
        value={value}
        onChange={update}
        required 
      />
      <Button 
        outline
        error
        className={classes['field-textlist-remove']}
        onClick={remove}
      >
        <IconRemove size={16} />
      </Button>
    </div>
  )
}

export default React.forwardRef(function TextlistField(props, ref) {
  //guarantee we have a field reference
  const fieldRef = ref || useRef()
  //extract props
  const { name, value, onChange, addLabel } = props
  //make sure we have an array
  const safeValue = Array.isArray(value) ? value : []
  //states
  const [ values, setValues ] = useState(safeValue)
  //actions
  const add = () => setValues(values.concat(['']))
  //partials
  const displays = values.map((value, key) => (
    typeof value === 'string' ? <ItemField 
      key={key} 
      onChange={onChange}
      name={`${name}[]`} 
      value={value} 
      index={key}
      values={values}
      set={setValues}
    /> : null
  ))
  //render
  return (
    <div ref={fieldRef} className={classes['field-metadata']}>
      {displays}
      <Button 
        outline
        secondary
        icon={IconPlus}
        onClick={add}
        className={classes['field-metadata-add']}
      >
        {addLabel || 'Add'}
      </Button>
    </div>
  )
})