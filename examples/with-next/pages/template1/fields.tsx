import Control from '@inceptjs/react/dist/Control';

import Input from '@inceptjs/react/dist/FieldInput';
import FieldNumber from '@inceptjs/react/dist/FieldNumber';
import Password from '@inceptjs/react/dist/FieldPassword';
import InputMask from '@inceptjs/react/dist/FieldMask';

import Textarea from '@inceptjs/react/dist/FieldTextarea';
import Markdown from '@inceptjs/react/src/FieldMarkdown';

import Checkbox from '@inceptjs/react/dist/FieldCheckbox';
import Radio from '@inceptjs/react/dist/FieldRadio';
import Switch from '@inceptjs/react/dist/FieldSwitch';

import Select from '@inceptjs/react/dist/FieldSelect';
import SelectCountry from '@inceptjs/react/dist/FieldCountry';
import SelectCurrency from '@inceptjs/react/dist/FieldCurrency';

import Autocomplete from '@inceptjs/react/dist/FieldAutocomplete';

import FieldDate from '@inceptjs/react/dist/FieldDate';
import FieldTime from '@inceptjs/react/dist/FieldTime';
import FieldDatetime from '@inceptjs/react/dist/FieldDatetime';

import Taglist from '@inceptjs/react/src/FieldTaglist';
import Textlist from '@inceptjs/react/dist/FieldTextlist';
import Metadata from '@inceptjs/react/dist/FieldMetadata';

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
      <Control label="Markdown" className="text-xs my-4">
        <Markdown defaultValue="A paragraph with *emphasis* and **strong importance**" onUpdate={console.log} />
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
      <Control label="Taglist 1" className="my-2">
        <Taglist placeholder="Yo...." value={['boo', 'far']} onUpdate={console.log} />
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
    </div>
  );
};

export default Page;
