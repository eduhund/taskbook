import { Radio, Props as RadioProps } from "@consta/uikit/Radio";

type EduProps = {
	initChecked: boolean | undefined;
};

type Props = Omit<RadioProps, "checked"> & EduProps;

function EduRadio({
	initChecked,
	size,
	view,
	align,
	disabled,
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
	return (
		<Radio
			checked={initChecked}
			size={size}
			view={view}
			align={align}
			disabled={disabled}
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
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	);
}

export { EduRadio as Radio };
