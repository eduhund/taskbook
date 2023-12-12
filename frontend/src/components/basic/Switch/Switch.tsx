import { useState } from "react";
import { Switch, SwitchProps } from "@consta/uikit/Switch";

type EduProps = {
	initChecked: boolean;
};

type Props = Omit<SwitchProps, "checked"> & EduProps;

function EduSwitch({
	initChecked,
	size,
	view,
	align,
	disabled,
	className,
	label,
	name,
	autoFocus,
	readOnly,
	required,
	step,
	tabIndex,
	inputRef,
	onChange,
	onFocus,
	onBlur,
}: Props) {
	const [checked, setChecked] = useState<boolean>(initChecked);

	function onChangeAction(e: any) {
		setChecked(!checked);
		onChange && onChange(e);
	}
	return (
		<Switch
			checked={checked}
			size={size}
			view={view}
			align={align}
			disabled={disabled}
			className={className}
			label={label}
			name={name}
			autoFocus={autoFocus}
			readOnly={readOnly}
			required={required}
			step={step}
			tabIndex={tabIndex}
			inputRef={inputRef}
			onChange={onChangeAction}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	);
}

export { EduSwitch as Switch };
