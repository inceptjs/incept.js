//vendor imports
import React, { useState, useRef } from 'react'
import IconPlus from '@inceptjs/icons/regular/Plus'
import IconRemove from '@inceptjs/icons/regular/X'
import IconFile from '@inceptjs/icons/regular/File'
//local imports
import { Table, Tfoot, Trow, Tcol } from '../Table'
import Button from '../Button'
//self imports
import classes from './Form.module.css'

const images = [ 'jpg', 'jpeg', 'pjpeg', 'svg', 'png', 'ico', 'gif' ]

function getExtension(data) {
  if (Array.isArray(data)) {
    return data[0].split('.').pop()
  }

  return data.split('.').pop()
}

function FileRow({ name, data, index, files, set }) {
  const remove = () => {
    const newFiles = [ ...files ]
    newFiles[index] = false
    set(newFiles)
  }

  const file = Array.isArray(data)? data[1]: data
  const filename = Array.isArray(data)? data[0]: data

  const preview = images.includes(getExtension(data))
    ? <img src={file} width={70} height={70} />
    : <IconFile size={24} />
  
  return (
    <Trow>
      <Tcol>{preview}</Tcol>
      <Tcol>{filename}</Tcol>
      <Tcol>
        <Button 
          outline
          error
          className={classes['field-textlist-remove']}
          onClick={remove}
        >
          <IconRemove size={16} />
        </Button>
        <input type="hidden" name={name} value={file} />
      </Tcol>
    </Trow>
  )
}

export default function FileField(props) {
  //expand props
  const { name, value, addLabel, multiple, limit } = props
  const safeFiles = Array.isArray(value) ? value : [value]
  const safeLimit = !isNaN(limit) ? limit : multiple ? 0: 1 
  const safeMultiple = safeLimit !== 1
  const uploadRef = useRef()
  const path = safeMultiple? `${name}[]`: name
  const fileProps = {}
  if (safeMultiple) fileProps.multiple = true
  if (props.accept) fileProps.accept = props.accept
  //states
  const [ files, set ] = useState(safeFiles)
  //actions
  const add = () => {
    if (!uploadRef.current 
      || !uploadRef.current.files 
      || !uploadRef.current.files[0]
    ) {
      return
    }

    const newFiles = []
    for (const file of uploadRef.current.files) {
      const reader = new FileReader()
      reader.onload = () => {
        newFiles.push([ file.name, reader.result ])
        if (newFiles.length === uploadRef.current.files.length) {
          set(files.concat(newFiles))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const explorer = () => {
    if (!uploadRef.current) return
    uploadRef.current.click()
  }

  if (safeLimit && files.length > safeLimit) {
    set(files.filter(file => file !== false).slice(0, safeLimit))
  }

  const rows = files.map(
    (file, key) => file !== false && <FileRow 
      key={key}
      name={path} 
      data={file} 
      files={files} 
      set={set} 
      index={key}
      tbody
    />
  )

  const filtered = files.filter(file => file !== false)
  const exceeded = filtered.length >= safeLimit
  
  const styles = {
    foot: { backgroundColor: 'transparent', padding: 0 }
  }

  return (
    <Table>
      {rows}
      {!exceeded && <Tfoot style={styles.foot} colSpan={3}>
        <Button 
          outline
          secondary
          stretch
          type="button"
          icon={IconPlus}
          onClick={explorer}
        >
          {addLabel || 'Add File'}
          <input 
            ref={uploadRef} 
            type="file" 
            onChange={add} 
            {...fileProps}
            hidden 
          />
        </Button>
      </Tfoot>}
    </Table>
  )
}