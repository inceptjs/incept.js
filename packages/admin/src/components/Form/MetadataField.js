//vendor imports
import React, { useState, useRef } from 'react'
import IconPlus from '@inceptjs/icons/regular/Plus'
import IconRemove from '@inceptjs/icons/regular/X'
import Button from '../Button'
import Input from './InputField'
//self imports
import classes from './Form.module.css'

function PairField({ name, value, index, pairs, set }) {
  const update = () => {
    if (!nameRef.current || !valueRef.current) {
      return
    }

    const newPairs = [ ...pairs ]
    const nameValue = nameRef.current.value
    const valueValue = valueRef.current.value
    newPairs[index] = [ nameValue, valueValue ]
    set(newPairs)
  }

  const remove = () => {
    const newPairs = [ ...pairs ]
    newPairs[index] = false
    set(newPairs)
  }

  const nameRef = React.createRef()
  const valueRef = React.createRef()

  return (
    <div className={classes['field-metadata-display']}>
      <Input 
        ref={nameRef}
        className={classes['field-metadata-display-key']}
        value={name}
        onChange={update}
        required 
      />
      <Input 
        ref={valueRef}
        className={classes['field-metadata-display-value']}
        value={value}
        onChange={update}
        required 
      />
      <Button 
        outline
        error
        className={classes['field-metadata-remove']}
        onClick={remove}
      >
        <IconRemove size={16} />
      </Button>
    </div>
  )
}

export default React.forwardRef(function MetadataField(props, ref) {
  //guarantee we have a field reference
  const fieldRef = ref || useRef()
  //extract props
  const { name, value, onChange, addLabel } = props
  //make sure we have an object
  const safeValue = value && typeof value === 'object' ? value : {}
  //change from object to array pairs
  const safePairs = Object.keys(safeValue).map(name => {
    return [ name, safeValue[name] ]
  })
  //states
  const [ pairs, setPairs ] = useState(safePairs)
  //actions
  const add = () => setPairs(pairs.concat([['', '']]))
  const update = (e) => {
    //allow pass onChange to parent
    if (typeof onChange === 'function') {
      onChange(e)
    }
  }
  //partials
  const displays = pairs.map((pair, key) => (
    Array.isArray(pair) ? <PairField 
      key={key} 
      name={pair[0]} 
      value={pair[1]} 
      index={key}
      pairs={pairs}
      set={setPairs}
    /> : null
  ))

  const inputs = pairs.map((pair, key) => (
    Array.isArray(pair) 
      && typeof pair[0] === 'string' 
      && pair[0].length 
    ? (
      <input 
        key={key} 
        onChange={update}
        type="hidden" 
        name={`${name}[${pair[0]}]`} 
        value={pair[1]} 
      />
    ) : null
  ))
  //render
  return (
    <div ref={fieldRef} className={classes['field-metadata']}>
      {displays}
      {inputs}
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