//vendor imports
import React, { useState, useEffect } from 'react'
import IconEdit from '@inceptjs/icons/regular/Edit'
import IconCopy from '@inceptjs/icons/regular/Copy'
import IconRemove from '@inceptjs/icons/regular/X'
//local imports
import Button from '../../components/Button'
import Screen from '../../components/Screen'
import { Table, Thead } from '../../components/Table'
import { Tabs, TabItem, TabPanel } from '../../components/Tabs'
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
  const [ activeTab, setTab ] = useState(0)
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
        <Tabs onChange={setTab}>
          <TabItem active={activeTab === 0}>Information</TabItem>
          <TabItem active={activeTab === 1}>Friends</TabItem>
          <TabPanel active={activeTab === 0} style={{ padding: 10 }}>
            <Metadata row={row} />
          </TabPanel>
          <TabPanel active={activeTab === 1} style={{ padding: 10 }}>
            <Table>
              <Thead stickyTop stickyLeft>ID</Thead>
              <Thead stickyTop>Image</Thead>
              <Thead stickyTop>Name</Thead>
              <Thead stickyTop>Bio</Thead>
              <Thead stickyTop>Active</Thead>
              <Thead stickyTop>Created</Thead>
              <Thead stickyTop>Updated</Thead>
              <Thead stickyTop stickyRight>{' '}</Thead>
              <SearchRows tbody rows={row.friends} detail={detail} />
            </Table>
          </TabPanel>
        </Tabs>
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