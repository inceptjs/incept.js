//vendor imports
import React from 'react'
//local imports
import IconCheck from '../../components/Icon/regular/Check'
import Button from '../../components/Button'
import Screen from '../../components/Screen'
//self imports
import classes from './Template.module.css'

//main component
export default function TemplateForm({ backward }) {
  const prev = () => backward(1)
  return (
    <>
      <Screen.Head title="Create Schema" onClick={prev} />
      <Screen.Body withFoot style={{ padding: 10 }}>
        Form Body
      </Screen.Body>
      <Screen.Foot>
        <Button 
          solid
          primary
          className={classes['form-publish']} 
          icon={IconCheck}
        >
          Publish
        </Button>
      </Screen.Foot>
    </>
  )
}