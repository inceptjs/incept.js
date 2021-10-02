//vendor imports
import React from 'react'
//local imports
import { Table, Trow, Tcol } from '../../../components/Table'

export default function Metadata({ row }) {
  return typeof row === 'object' ? (
    <Table>
      <Trow stripe>
        <Tcol>Image</Tcol>
        <Tcol><img src={row.image} width={100} height={100} /></Tcol>
      </Trow>
      <Trow stripe>
        <Tcol>Name</Tcol>
        <Tcol>{row.name}</Tcol>
      </Trow>
      <Trow stripe>
        <Tcol>Bio</Tcol>
        <Tcol>{row.bio}</Tcol>
      </Trow>
      <Trow stripe>
        <Tcol>Active</Tcol>
        <Tcol>{row.active?'Yes':'No'}</Tcol>
      </Trow>
      <Trow stripe>
        <Tcol>Created</Tcol>
        <Tcol>{row.created}</Tcol>
      </Trow>
      <Trow stripe>
        <Tcol>Updated</Tcol>
        <Tcol>{row.updated}</Tcol>
      </Trow>
    </Table>
  ) : null
}