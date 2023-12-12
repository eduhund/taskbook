import { useState } from "react";
import { Checkbox, CheckboxProps } from '@consta/uikit/Checkbox';

type CheckboxPropOnChange = {
  e: React.ChangeEvent<HTMLInputElement>;
  checked: boolean;
}

type EduProps = {
  initChecked: boolean | undefined
}

type Props = Omit<CheckboxProps, "checked"> & EduProps

function EduCheckbox({
  initChecked,
  size,
  view,
  align,
  disabled,
  intermediate,
  label,
  name,
  autoFocus,
  readOnly,
  required,
  step,
  tabIndex,
  inputRef,
  inputId,
  className,
  onChange,
  onFocus,
  onBlur,
  }: Props) {
  const [checked, setChecked] = useState<boolean>(initChecked || false);
  function onChangeAction(e: CheckboxPropOnChange ) {
    if (onChange) {
      setChecked(e.checked)
      onChange(e)
    }
}
  return <Checkbox 
    checked={checked}
    size={size}
    view={view}
    align={align}
    disabled={disabled}
    intermediate={intermediate}
    label={label}
    name={name}
    autoFocus={autoFocus}
    readOnly={readOnly}
    required={required}
    step={step}
    tabIndex={tabIndex}
    inputRef={inputRef}
    inputId={inputId}
    className={className}
    onChange={onChangeAction}
    onFocus={onFocus}
    onBlur={onBlur}
   />
}

export { EduCheckbox as Checkbox }