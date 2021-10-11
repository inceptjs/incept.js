//vendor imports
import React, { useState, useEffect } from 'react'
import IconPlus from '@inceptjs/icons/regular/Plus'
import IconCamera from '@inceptjs/icons/regular/Camera'
//local imports
import Button from '../../components/Button'
import { Table, Thead } from '../../components/Table'
//self imports
import SearchForm from './Search/Form'
import SearchRows from './Search/Rows'
import Form from './Form'
import Detail from './Detail'
import store from './store'
import classes from './Template.module.css'

//main component
export default function TemplateSearch(props) {
  const { backward, forward, open, crumbs, notify } = props
  //define listeners
  const form = () => open(
    <Form 
      forward={forward} 
      backward={backward} 
      notify={notify} 
    />
  )
  const detail = (id) => () => open(
    <Detail 
      id={id} 
      forward={forward} 
      backward={backward} 
      notify={notify} 
    />
  )
  //get rows
  const [rows, setRows] = useState(false)
  //only on first mount
  useEffect(() => {
    //set the crumb trails
    crumbs([{ icon: IconCamera, title: 'Template One' }])
    setTimeout(() => {
      store.get().then(res => setRows(res.results.rows))
    }, 2000)
  }, [])
  //render
  return (
    <>
      <header className={classes['search-header']}>
        <h1 className={classes['search-header-title']}>Template One</h1>
        <div className={classes['search-header-link']}>
          <Button outline primary onClick={form} icon={IconPlus}>
            Template Form
          </Button>
        </div>
        <SearchForm />
      </header>
      <Table>
        <Thead stickyTop stickyLeft>ID</Thead>
        <Thead stickyTop>Image</Thead>
        <Thead stickyTop>Name</Thead>
        <Thead stickyTop>Bio</Thead>
        <Thead stickyTop>Active</Thead>
        <Thead stickyTop>Created</Thead>
        <Thead stickyTop>Updated</Thead>
        <Thead stickyTop stickyRight>{'&nbsp;'}</Thead>
        <SearchRows tbody rows={rows} detail={detail} />
      </Table>
    </>
  )
}