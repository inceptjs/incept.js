import Button from '@ev3/ui/dist/tailwind/Button';
import Control from '@ev3/ui/dist/tailwind/Control';

import Input from '@ev3/ui/dist/tailwind/FieldInput';
import Textarea from '@ev3/ui/dist/tailwind/FieldTextarea';
import FieldNumber from '@ev3/ui/dist/tailwind/FieldNumber';
import Password from '@ev3/ui/dist/tailwind/FieldPassword';
import InputMask from '@ev3/ui/dist/tailwind/FieldMask';

import Checkbox from '@ev3/ui/dist/tailwind/FieldCheckbox';
import Radio from '@ev3/ui/dist/tailwind/FieldRadio';
import Switch from '@ev3/ui/dist/tailwind/FieldSwitch';

import Select from '@ev3/ui/dist/tailwind/FieldSelect';
import SelectCountry from '@ev3/ui/dist/tailwind/FieldCountry';
import SelectCurrency from '@ev3/ui/dist/tailwind/FieldCurrency';

import Autocomplete from '@ev3/ui/dist/tailwind/FieldAutocomplete';

import FieldDate from '@ev3/ui/dist/tailwind/FieldDate';
import FieldTime from '@ev3/ui/dist/tailwind/FieldTime';
import FieldDatetime from '@ev3/ui/dist/tailwind/FieldDatetime';

import Textlist from '@ev3/ui/dist/tailwind/FieldTextlist';
import Metadata from '@ev3/ui/dist/tailwind/FieldMetadata';

import Alert from '@ev3/ui/dist/tailwind/Alert';
import Badge from '@ev3/ui/dist/tailwind/Badge';
import Table, { Thead, Tfoot, Trow, Tcol } from '@ev3/ui/dist/tailwind/Table';

import Loader from '@ev3/ui/dist/tailwind/Loader';

import { useState } from 'react';

const Page = () => {
  const [ complete, setComplete] = useState<string[]>([]);
  const remote = (query: string) => {
    setTimeout(() => {
      if (!query.length) return setComplete([]);
      setComplete(['big', 'small', 'medium', 'large', 'extra large'])
    }, 500)
  };
  const [ radio1, setRadio1 ] = useState<any>();
  const [ radio2, setRadio2 ] = useState<any>();
  const [ radio3, setRadio3 ] = useState<any>();
  const options = [
    {label: 'Option 1', value: 'option-1', keyword: 'option1'},
    {label: (<em className="font-bold">Option 2</em>), value: 'option-2', keyword: 'option2'},
    {label: 'Option 3', value: 'option-3', keyword: 'option3'},
  ];
  return (
    <div className="p-4">
      <Loader color="#006699" show={true} label="Loading..." />
      <Control label="Input 1">
        <Input defaultValue="value 1" onUpdate={console.log} />
      </Control>
      <Control label="Input 2" error="something" >
        <Input error={true} />
      </Control>
      <Control label="Input 3" className="text-xs my-4">
        <Input defaultValue="value 3" onUpdate={console.log} />
      </Control>
      <Control label="Number 1" className="mt-2">
        <FieldNumber defaultValue={1900.01} onUpdate={console.log} />
      </Control>
      <Control label="Number 2" error="something" className="mt-2">
        <FieldNumber defaultValue="1900.01" min="0" max="2000" onUpdate={console.log} />
      </Control>
      <Control label="Password 1" className="mt-2">
        <Password onUpdate={console.log} />
      </Control>
      <Control label="Password 2" error="something" className="mt-2 text-xs">
        <Password error={true} onUpdate={console.log} />
      </Control>
      <Control label="Input Mask 1">
        <InputMask mask="9999-9999-9999-9999" onUpdate={console.log} />
      </Control>
      <Control label="Input Mask 2" className="text-xs" error="something" >
        <InputMask mask="9(999) 999-999" error={true} />
      </Control>
      <Control label="Textarea 1">
        <Textarea defaultValue="value 1" onUpdate={console.log} />
      </Control>
      <Control label="Textarea 2" error="something" className="mt-2">
        <Textarea error={true} />
      </Control>
      <Control label="Textarea 3" className="text-xs my-4">
        <Textarea defaultValue="value 3" onUpdate={console.log} />
      </Control>
      <Control label="Radio 1" className="mt-2">
        <Radio label="Radio A" checked={radio1 === 1} onChange={() => setRadio1(1)} />
        <span className="mx-4">
          <Radio label="Radio B" check color="#FF893C" checked={radio1 === 2} onChange={() => setRadio1(2)} />
        </span>
        <Radio label="Radio C" square solid sharp checked={radio1 === 3} onChange={() => setRadio1(3)} />
      </Control>
      <Control label="Radio 2" className="mt-2" error="something">
        <Radio label="Radio D" square solid error={true} checked={radio2 === 1} onChange={() => setRadio2(1)} onUpdate={console.log} />
        <span className="mx-4">
          <Radio label="Radio E" sharp check color="#28A745" error={true} checked={radio2 === 2} onChange={() => setRadio2(2)} onUpdate={console.log} />
        </span>
        <Radio label="Radio F" error={true} checked={radio2 === 3} onChange={() => setRadio2(3)} onUpdate={console.log} />
      </Control>
      <Control label="Radio 3" className="text-xs my-4">
        <Radio label="Radio G" checked={radio3 === 1} onChange={() => setRadio3(1)} />
        <span className="mx-4">
          <Radio label="Radio H" checked={radio3 === 2} onChange={() => setRadio3(2)} />
        </span>
        <Radio label="Radio I" checked={radio3 === 3} onChange={() => setRadio3(3)} />
      </Control>
      <Control label="Checkbox 1" className="mt-2">
        <Checkbox label="Checkbox A" />
        <span className="mx-4">
          <Checkbox label="Checkbox B" color="#FF893C" circle sharp />
        </span>
        <Checkbox label="Checkbox C" solid square />
      </Control>
      <Control label="Checkbox 2" className="mt-2" error="something">
        <Checkbox error={true} label="Checkbox D" color="#FF893C" solid rounded value={2} onUpdate={console.log} />
        <span className="mx-4">
          <Checkbox error={true} label="Checkbox E" circle onUpdate={console.log} />
        </span>
        <Checkbox error={true} label="Checkbox F" rounded square value="3" onUpdate={console.log} />
      </Control>
      <Control label="Checkbox 3" className="text-xs my-4">
        <Checkbox label="Checkbox G" />
        <span className="mx-4">
          <Checkbox label="Checkbox H" />
        </span>
      </Control>
      <Control label="Switch 1" className="mt-2">
        <Switch label="Switch A" value="1" onUpdate={console.log} />
        <span className="mx-4">
          <Switch label="Switch B" value={2} onUpdate={console.log} rounded onoff blue />
        </span>
        <Switch label="Switch C" onUpdate={console.log} checkex orange knob="ridge" />
      </Control>
      <Control label="Switch 2" className="text-xs my-4">
        <Switch label="Switch D" rounded knob="ridge" green />
      </Control>
      <Control label="Switch 3" className="mt-2" error="something">
        <Switch error={true} label="Switch E" knob="checkex" green />
        <span className="mx-4">
          <Switch error={true} label="Switch F" rounded sunmoon orange />
        </span>
        <Switch error={true} label="Switch G" blue knob="ridge" />
      </Control>
      <Control label="Date 1">
        <FieldDate defaultValue={new Date()} onUpdate={console.log} />
        <FieldTime defaultValue={Date.now()} onUpdate={console.log} className="my-2" />
        <FieldDatetime defaultValue={'2023-01-01T05:00Z'} onUpdate={console.log} />
      </Control>
      <Control label="Date 2" error="something" className="mt-2">
        <FieldDate defaultValue={new Date()} onUpdate={console.log} error={true} />
        <FieldTime defaultValue={Date.now()} onUpdate={console.log} className="my-2" error={true} />
        <FieldDatetime defaultValue={'2023-01-01T05:00Z'} onUpdate={console.log} error={true} />
      </Control>
      <Control label="Select 1" className="mt-2 relative z-50">
        <Select options={options} onUpdate={console.log} />
      </Control>
      <Control label="Select 2" className="mt-2 relative z-40" error="something">
        <Select options={options} onUpdate={console.log} error={true} searchable={true} />
      </Control>
      <Control label="Country 1" className="mt-2 relative z-30">
        <SelectCountry onUpdate={console.log} />
      </Control>
      <Control label="Country 2" className="mt-2 relative z-20" error="something">
        <SelectCountry onUpdate={console.log} error={true} />
      </Control>
      <Control label="Currency 1" className="mt-2 relative z-10">
        <SelectCurrency onUpdate={console.log} />
      </Control>
      <Control label="Currency 2" className="mt-2 relative" error="something">
        <SelectCurrency onUpdate={console.log} error={true} />
      </Control>
      <Control label="Textlist 1" className="my-2">
        <Textlist value={['a', 'b']} onUpdate={console.log} />
      </Control>
      <Control label="Textlist 2" className="my-2" error="something">
        <Textlist value={['c', 'd']} onUpdate={console.log} error={true} />
      </Control>
      <Control label="Textlist 3" className="my-2 text-xs">
        <Textlist value={['a', 'b']} onUpdate={console.log} />
      </Control>
      <Control label="Metadata 1" className="my-2">
        <Metadata 
          value={[{name: 'a', value: 'b'}, {name: 'c', value: 'd'}]} 
          onUpdate={console.log} 
        />
      </Control>
      <Control label="Metadata 2" className="my-2" error="something">
        <Metadata 
          type="number"
          min="0"
          max="10000000"
          step="0.01"
          value={[{name: 'a', value: 2.05}, {name: 'c', value: 10000}]} 
          onUpdate={console.log} 
          error={true}
        />
      </Control>
      <Control label="Metadata 3" className="my-2">
        <Metadata 
          type="date"
          value={[{name: 'a', value: Date.now()}, {name: 'c', value: new Date}]} 
          onUpdate={console.log} 
        />
      </Control>
      <Control label="Metadata 4" className="text-xs my-4">
        <Metadata 
          type="time"
          value={[{name: 'a', value: Date.now()}, {name: 'c', value: new Date}]} 
          onUpdate={console.log} 
        />
      </Control>
      <Control label="Metadata 5" className="my-2">
        <Metadata 
          type="datetime"
          value={[{name: 'a', value: Date.now()}, {name: 'c', value: new Date}]} 
          onUpdate={console.log} 
          error={true}
        />
      </Control>
      <Control label="Autocomplete 1" className="my-2">
        <Autocomplete 
          options={complete}
          onQuery={remote}
          onUpdate={console.log} 
        />
      </Control>
      <div className="mt-8">
        <Button xs>Button XS</Button>
        <Button xs curved success>Button 1</Button>
        <Button xs rounded warning>Button 2</Button>
        <Button xs pill danger>Button 3</Button>
        <Button xs info>Button 4</Button>
        <Button xs muted>Button 5</Button>
  
        <Button xs outline success>Button 6</Button>
        <Button xs outline warning>Button 7</Button>
        <Button xs curved outline danger>Button 8</Button>
        <Button xs rounded outline info>Button 9</Button>
        <Button xs pill outline muted>Button 10</Button>
  
        <Button xs rounded transparent success>Button 11</Button>
        <Button xs pill transparent warning>Button 12</Button>
        <Button xs curved transparent danger>Button 13</Button>
        <Button xs transparent info>Button 14</Button>
        <Button xs transparent muted>Button 15</Button>
      </div>
      <div className="mt-8">
        <Button sm>Button SM</Button>
        <Button rounded sm success>Button 1</Button>
        <Button pill sm warning>Button 2</Button>
        <Button curved sm danger>Button 3</Button>
        <Button sm info>Button 4</Button>
        <Button sm muted>Button 5</Button>
  
        <Button sm outline success>Button 6</Button>
        <Button curved sm outline warning>Button 7</Button>
        <Button rounded sm outline danger>Button 8</Button>
        <Button pill sm outline info>Button 9</Button>
        <Button sm outline muted>Button 10</Button>
  
        <Button sm transparent success>Button 11</Button>
        <Button sm transparent warning>Button 12</Button>
        <Button sm transparent danger>Button 13</Button>
        <Button rounded sm transparent info>Button 14</Button>
        <Button pill sm transparent muted>Button 15</Button>
      </div>
      <div className="mt-8">
        <Button md>Button MD</Button>
        <Button rounded md success>Button 1</Button>
        <Button pill md warning>Button 2</Button>
        <Button curved md danger>Button 3</Button>
        <Button md info>Button 4</Button>
        <Button md muted>Button 5</Button>
  
        <Button md outline color="#006699">Button 5.5</Button>
        <Button md outline success>Button 6</Button>
        <Button curved md outline warning>Button 7</Button>
        <Button rounded md outline danger>Button 8</Button>
        <Button pill md outline info>Button 9</Button>
        <Button md outline muted>Button 10</Button>
  
        <Button md transparent success>Button 11</Button>
        <Button md transparent warning>Button 12</Button>
        <Button curved md transparent danger>Button 13</Button>
        <Button rounded md transparent info>Button 14</Button>
        <Button pill md transparent muted>Button 15</Button>
      </div>
      <div className="mt-8">
        <Button lg>Button LG</Button>
        <Button rounded lg success>Button 1</Button>
        <Button pill lg warning>Button 2</Button>
        <Button curved lg danger>Button 3</Button>
        <Button lg info>Button 4</Button>
        <Button lg muted>Button 5</Button>
  
        <Button lg outline success>Button 6</Button>
        <Button curved lg outline warning>Button 7</Button>
        <Button rounded lg outline danger>Button 8</Button>
        <Button pill lg outline info>Button 9</Button>
        <Button lg outline muted>Button 10</Button>
  
        <Button lg transparent success>Button 11</Button>
        <Button lg transparent warning>Button 12</Button>
        <Button curved lg transparent danger>Button 13</Button>
        <Button rounded lg transparent info>Button 14</Button>
        <Button pill lg transparent muted>Button 15</Button>
      </div>
      <div className="mt-8">
        <Button xl>Button XL</Button>
        <Button rounded xl success>Button 1</Button>
        <Button pill xl warning>Button 2</Button>
        <Button curved xl danger>Button 3</Button>
        <Button xl info>Button 4</Button>
        <Button xl muted>Button 5</Button>
  
        <Button xl outline success>Button 6</Button>
        <Button curved xl outline warning>Button 7</Button>
        <Button rounded xl outline danger>Button 8</Button>
        <Button pill xl outline info>Button 9</Button>
        <Button xl outline muted>Button 10</Button>
  
        <Button xl transparent success>Button 11</Button>
        <Button xl transparent warning>Button 12</Button>
        <Button curved xl transparent danger>Button 13</Button>
        <Button rounded xl transparent info>Button 14</Button>
        <Button pill xl transparent muted>Button 15</Button>
      </div>
      <div className="mt-8">
        <Alert success>
          <i className="fas fa-check-circle mr-2"></i>
          Alert 1
        </Alert>
        <Alert warning curved className="mt-1">
          <i className="fas fa-exclamation-circle mr-2"></i>
          Alert 2
        </Alert>
        <Alert error rounded className="mt-1">
          <i className="fas fa-times-circle mr-2"></i>
          Alert 3
        </Alert>
        <Alert info pill className="mt-1">
          <i className="fas fa-info-circle mr-2"></i>
          Alert 4
        </Alert>
        <Alert muted className="mt-1">Alert 5</Alert>
        <Alert color="#006699" className="mt-1">Alert 6</Alert>
      </div>
      <div className="mt-8">
        <Alert outline success>
          <i className="fas fa-check-circle mr-2"></i>
          Alert 1
        </Alert>
        <Alert outline curved warning className="mt-1">
          <i className="fas fa-exclamation-circle mr-2"></i>
          Alert 2
        </Alert>
        <Alert outline rounded error className="mt-1">
          <i className="fas fa-times-circle mr-2"></i>
          Alert 3
        </Alert>
        <Alert outline pill info className="mt-1">
          <i className="fas fa-info-circle mr-2"></i>
          Alert 4
        </Alert>
        <Alert outline muted className="mt-1">Alert 5</Alert>
        <Alert outline color="#006699" className="mt-1">Alert 6</Alert>
      </div>
      <div className="mt-8">
        <Badge success className="mr-1">Badge 1</Badge>
        <Badge warning curved className="mt-1 mr-1">Badge 2</Badge>
        <Badge error rounded className="mt-1 mr-1">Badge 3</Badge>
        <Badge info pill className="mt-1 mr-1">Badge 4</Badge>
        <Badge muted className="mt-1 mr-1">Badge 5</Badge>
        <Badge color="#006699" className="mt-1">Badge 6</Badge>
      </div>
      <div className="mt-8">
        <Badge outline success className="mr-1">Badge 1</Badge>
        <Badge outline curved warning className="mt-1 mr-1">Badge 2</Badge>
        <Badge outline rounded error className="mt-1 mr-1">Badge 3</Badge>
        <Badge outline pill info className="mt-1 mr-1">Badge 4</Badge>
        <Badge outline muted className="mt-1 mr-1">Badge 5</Badge>
        <Badge outline color="#006699" className="mt-1">Badge 6</Badge>
      </div>
      <div className="mt-8">
        <Badge success className="mr-1">9</Badge>
        <Badge warning curved className="mt-1 mr-1">99</Badge>
        <Badge error rounded className="mt-1 mr-1">999</Badge>
        <Badge info pill className="mt-1 mr-1">9,999</Badge>
        <Badge muted className="mt-1">9M</Badge>
      </div>
      <div className="mt-8">
        <Badge outline success className="mr-1">9</Badge>
        <Badge outline curved warning className="mt-1 mr-1">99</Badge>
        <Badge outline rounded error className="mt-1 mr-1">999</Badge>
        <Badge outline pill info className="mt-1 mr-1">9,999</Badge>
        <Badge outline muted className="mt-1">9M</Badge>
      </div>
      <Table>
        <Thead className="text-left" noWrap stickyTop stickyLeft>Header 1</Thead>
        <Thead className="text-left" noWrap stickyTop>Header 2</Thead>
        <Thead className="text-left" noWrap stickyTop>Header 3</Thead>
        <Thead className="text-left" noWrap stickyTop>Header 4</Thead>
        <Thead className="text-left" noWrap stickyTop>Header 5</Thead>
        <Thead className="text-left" noWrap stickyTop>Header 6</Thead>
        <Thead className="text-left" noWrap stickyTop stickyRight>Header 7</Thead>
        <Trow>
          <Tcol stickyLeft>1</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol wrap3>A column Data</Tcol>
          <Tcol noWrap>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol stickyRight>Edit</Tcol>
        </Trow>
        <Trow>
          <Tcol stickyLeft>2</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol wrap3>A column Data</Tcol>
          <Tcol noWrap>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol stickyRight>Edit</Tcol>
        </Trow>
        <Trow>
          <Tcol stickyLeft>3</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol wrap3>A column Data</Tcol>
          <Tcol noWrap>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol stickyRight>Edit</Tcol>
        </Trow>
        <Tfoot className="text-left" noWrap stickyBottom stickyLeft>Footer 1</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom>Footer 2</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom>Footer 3</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom>Footer 4</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom>Footer 5</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom>Footer 6</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom stickyRight>Footer 7</Tfoot>
      </Table>
    </div>
  );
};

export default Page;
