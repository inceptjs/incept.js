//vendor imports
import React, { useState, useEffect } from 'react'
//local imports
import IconEdit from '../../components/Icon/regular/Edit'
import IconCopy from '../../components/Icon/regular/Copy'
import IconRemove from '../../components/Icon/regular/X'
import Button from '../../components/Button'
import Screen from '../../components/Screen'
import { Table, Thead } from '../../components/Table'
//self imports
import Form from './Form'
import SearchRows from './Search/Rows'
import Metadata from './Detail/Metadata'
import store from './store'
import classes from './Template.module.css'

//main components
export default function TemplateDetail(props) {
  //expand props
  const { id, backward, forward, notify } = props
  //setup states
  const [ row, setRow ] = useState(false)
  //setup actions
  const prev = () => backward(1)
  const form = () => forward(
    <Form forward={forward} backward={backward} />
  )
  const detail = (id) => () => forward(
    <TemplateDetail 
      id={id} 
      forward={forward} 
      backward={backward} 
      notify={notify} 
    />
  )

  //only on first mount
  useEffect(() => {
    setTimeout(() => {
      store.get(id).then(res => {
        if (res.error) {
          prev()
          return notify(`Error: ${res.message}`, 'error')
        }
        setRow(res.results)
      })
    }, 2000)
  }, [])
  //render
  return (
    <>
      <Screen.Head title="Template Detail" onClick={prev} />
      <Screen.Body withFoot2>
        <Metadata row={row} />
        <Table>
          <Thead sticky-top sticky-left>ID</Thead>
          <Thead sticky-top>Image</Thead>
          <Thead sticky-top>Name</Thead>
          <Thead sticky-top>Bio</Thead>
          <Thead sticky-top>Active</Thead>
          <Thead sticky-top>Created</Thead>
          <Thead sticky-top>Updated</Thead>
          <Thead sticky-top sticky-right>&nbsp;</Thead>
          <SearchRows tbody rows={row.friends} detail={detail} />
        </Table>
      </Screen.Body>
      <Screen.Foot>
        <Button 
          solid
          primary
          className={classes['detail-edit']} 
          icon={IconEdit}
          onClick={form}
        >
          Edit
        </Button>
        <Button 
          outline
          primary
          className={classes['detail-copy']} 
          icon={IconCopy}
        >
          Copy
        </Button>
        <Button
          outline
          error 
          className={classes['detail-remove']} 
          icon={IconRemove}
        >
          Remove
        </Button>
      </Screen.Foot>
    </>
  )
}