//vendor imports
import React from 'react'
import IconSearch from '@inceptjs/icons/regular/Search'
import IconFilter from '@inceptjs/icons/regular/Filter'
//local imports
import { InputField } from '../../../components/Form'
import Button from '../../../components/Button'
import classes from '../Template.module.css'

//main component
export default function SearchForm() {
  return (
    <form className={classes['search-form']}>
      <Button 
        outline 
        secondary 
        type="button" 
        className={classes['search-form-button']}
      >
        <IconFilter size={16} />
      </Button>
      <InputField 
        className={classes['search-form-control']} 
        placeholder="Enter Keyword" 
      />
      <Button 
        outline 
        secondary 
        className={classes['search-form-button']}
      >
        <IconSearch size={16} />
      </Button>
    </form>
  );
}