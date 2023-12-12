import { useState } from "react";
import { ChoiceGroup, ChoiceGroupPropOnChange, ChoiceGroupPropGetIcon, ChoiceGroupPropGetLabel, СhoiceGroupPropWidth, ChoiceGroupPropView, ChoiceGroupPropForm, ChoiceGroupPropSize } from '@consta/uikit/ChoiceGroup';
import { IconPropSize } from '@consta/uikit/__internal__/src/icons/Icon/Icon';
import { PropsWithHTMLAttributesAndRef } from '@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes';

type ChoiceProps<ITEM, MULTIPLE extends boolean = false> = PropsWithHTMLAttributesAndRef<{
  size?: ChoiceGroupPropSize;
  form?: ChoiceGroupPropForm;
  view?: ChoiceGroupPropView;
  width?: СhoiceGroupPropWidth;
  onlyIcon?: boolean;
  iconSize?: IconPropSize;
  items: ITEM[];
  getLabel: ChoiceGroupPropGetLabel<ITEM>;
  getIcon?: ChoiceGroupPropGetIcon<ITEM>;
  name: string;
  disabled?: boolean;
  getDisabled?: (item: ITEM) => boolean | undefined;
  onChange?: ChoiceGroupPropOnChange<ITEM, MULTIPLE>;
  multiple?: MULTIPLE;
  truncate?: boolean;
  children?: never;
}, HTMLDivElement>

type Item = {
  label: string;
  id: number;
};

type EduProps = {
  initValue?: Item | Item[]
}

type Props = Omit<ChoiceProps<Item, boolean>, "value"> & EduProps

function EduChoice({
  initValue,
  size,
  form,
  view,
  width,
  onlyIcon,
  iconSize,
  items,
  name,
  disabled,
  multiple,
  truncate,
  onChange,
  getDisabled,
  getLabel,
  getIcon,
}: Props) {
  const [value, setValue] = useState<any>(initValue)
  function onChangeAction(e: any ) {
    if (onChange) {
      setValue(e.value)
      onChange(e)
    }
  }
  return <ChoiceGroup
  value={value}
  size={size}
  form={form}
  view={view}
  width={width}
  onlyIcon={onlyIcon}
  iconSize={iconSize}
  items={items}
  name={name}
  disabled={disabled}
  multiple={multiple}
  truncate={truncate}
  onChange={onChangeAction}
  getDisabled={getDisabled}
  getLabel={getLabel}
  getIcon={getIcon}
  />
}

export { EduChoice as Choice }