//vendor imports
import React from 'react'
//local imports
import IconSearch from '../../../components/Icon/regular/Search'
import IconFilter from '../../../components/Icon/regular/Filter'
import Button from '../../../components/Button'
import Input from '../../../components/Form/Input'
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
      <Input 
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