import { useState } from 'react';
import { DateTime } from '@consta/uikit/DateTimeCanary';

function Calendar({initValue, type, locale, currentVisibleDate, minDate, maxDate, onChange}: any) {
  const [value, setValue] = useState<any>(initValue)
  function onChangeAction(e: any) {
    setValue(e.value);
    onChange(e)
  }
  return <DateTime 
    locale={locale} 
    type={type} 
    currentVisibleDate={currentVisibleDate} 
    value={value} 
    minDate={minDate} 
    maxDate={maxDate} 
    onChange={onChangeAction}
  />
}

export { Calendar }