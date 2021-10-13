//vendor imports
import React from 'react'
import IconCheck from '@inceptjs/icons/regular/Check'
//local imports
import Button from '../../components/Button'
import Screen from '../../components/Screen'
import { 
  FormGroup, 
  InputField, 
  Textarea, 
  FileField,
  MaskField,
  NumberField,
  TextlistField, 
  MetadataField 
} from '../../components/Form'
//self imports
import classes from './Template.module.css'

//main component
export default function TemplateForm({ backward }) {
  const prev = () => backward(1)
  return (
    <>
      <Screen.Head title="Create Schema" onClick={prev} />
      <Screen.Body withFoot>
        <FormGroup inline label="Name" name="name" error="Error Message">
          <InputField name="name" placeholder="Enter Name" dir="rtl" />
          <Button 
            solid
            primary
            icon={IconCheck}
          >
            Publish
          </Button>
        </FormGroup>
        <FormGroup label="Age" name="age">
          <InputField name="age" placeholder="Enter Age" type="number" dir="rtl" />
        </FormGroup>
        <FormGroup label="Date" name="date">
          <InputField name="date" placeholder="Enter Date" type="datetime-local" dir="rtl" />
        </FormGroup>
        <FormGroup label="Bio" name="bio">
          <Textarea name="bio" placeholder="Enter Bio" value="Sample Value" />
        </FormGroup>
        <FormGroup label="Metadata" name="meta">
          <MetadataField 
            addLabel="Add Item"
            margin="normal"
            name="meta" 
            value={{ foo: 'bar', bar: 'foo' }} 
          />
        </FormGroup>
        <FormGroup label="Text List" name="textlist">
          <TextlistField 
            addLabel="Add Item"
            name="names" 
            value={['foo', 'bar']} 
          />
        </FormGroup>
        <FormGroup label="Mask" name="mask">
          <MaskField name="mask" mask="(999) 999-9999" />
        </FormGroup>
        <FormGroup label="File" name="file">
          <FileField 
            addLabel="Upload File"
            limit={3}
            accept="image/*"
            name="file" 
            value={'https://randomuser.me/api/portraits/women/12.jpg'} 
          />
        </FormGroup>
        <FormGroup label="Number" name="number">
          <NumberField 
            name="number" 
            decimals={2}
            decimal={'.'}
            separator={','}
            min={-100}
            max={1000000}
          />
        </FormGroup>
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