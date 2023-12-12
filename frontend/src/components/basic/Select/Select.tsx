import { useState } from "react";
import { Combobox, ComboboxProps } from '@consta/uikit/Combobox';

type Item = {
  label: string;
  id: number;
};

type EduProps = {
  initValue?: Item | Item[]
}

type Props = Omit<ComboboxProps, "value"> & EduProps

function EduSelect({
  initValue,
  items,
  disabled,
  form,
  dropdownForm,
  size,
  view,
  placeholder,
  ariaLabel,
  isLoading,
  dropdownClassName,
  dropdownRef,
  name,
  inputRef,
  labelForNotFound,
  required,
  labelForCreate,
  labelForEmptyItems,
  multiple,
  groups,
  label,
  caption,
  labelPosition,
  onChange,
  onFocus,
  onBlur,
  onCreate,
  onInputChange,
  getItemLabel,
  getItemKey,
  getItemGroupKey,
  getItemDisabled,
  getGroupLabel,
  getGroupKey,
  renderItem,
  renderValue,
  searchFunction,
  }: Props) {
	const [value, setValue] = useState<any>(initValue)
  function onChangeAction(e: any ) {
    if (onChange) {
      setValue(e.value)
      onChange(e)
    }
  }
  return <Combobox
    items={items}
    value={value}
    disabled={disabled}
    form={form}
    dropdownForm={dropdownForm}
    size={size}
    view={view}
    placeholder={placeholder}
    ariaLabel={ariaLabel}
    isLoading={isLoading}
    dropdownClassName={dropdownClassName}
    dropdownRef={dropdownRef}
    name={name}
    inputRef={inputRef}
    labelForNotFound={labelForNotFound}
    required={required}
    labelForCreate={labelForCreate}
    labelForEmptyItems={labelForEmptyItems}
    multiple={multiple}
    groups={groups}
    label={label}
    caption={caption}
    labelPosition={labelPosition}
    onChange={onChangeAction}
    onFocus={onFocus}
    onBlur={onBlur}
    onCreate={onCreate}
    onInputChange={onInputChange}
    getItemLabel={getItemLabel}
    getItemKey={getItemKey}
    getItemGroupKey={getItemGroupKey}
    getItemDisabled={getItemDisabled}
    getGroupLabel={getGroupLabel}
    getGroupKey={getGroupKey}
    renderItem={renderItem}
    renderValue={renderValue}
    searchFunction={searchFunction}
  />
}

export { EduSelect as Select }