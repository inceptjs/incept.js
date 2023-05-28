//hooks
import { useContext } from 'react';
//components
import I18nContext from '../context';

export default function useTimezone() {
  const { 
    timezone,
    changeTimezone
  } = useContext(I18nContext);

  const engine = {
    //current timezone
    timezone,
    //change timezone
    change: changeTimezone,
    //converts date to timezone
    date: (date: string|Date) => {
      //make sure we have a date
      const todate = typeof date === 'string' ? new Date(date) : date;
      const locale = todate.toLocaleString('en-US', { timeZone: timezone });
      return new Date(locale);   
    }
  };

  return engine;
};