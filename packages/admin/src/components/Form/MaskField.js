//vendor imports
import React from 'react'
import PropTypes from 'prop-types'
import Inputmask from 'inputmask'
//vendor components
import InputField from './InputField'

export default function MaskField(props) {
  const { mask, ...attributes } = props
  const im = new Inputmask(mask)
  const ref = (ref) => {
    if (!ref) return
    im.mask(ref)
  }

  return <InputField ref={ref} {...attributes} />
}

MaskField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  mask: PropTypes.string.isRequired
}