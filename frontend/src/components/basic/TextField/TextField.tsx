import { useState } from "react";
import {
	TextField,
	TextFieldProps,
	TextFieldPropValue,
	TextFieldOnChangeArguments,
} from "@consta/uikit/TextField";

type EduProps = {
	initValue?: TextFieldPropValue;
	rows?: any;
	onBlur?: any;
	subtype?: "text" | "link";
};

type TYPE = "number" | "password" | "textarea" | "email";

type Props = Omit<TextFieldProps<TYPE>, "rows" | "onBlur"> & EduProps;

function EduTextField({
	initValue,
	className,
	cols,
	onChange,
	id,
	name,
	type,
	disabled,
	maxLength,
	size,
	view,
	form,
	state,
	status,
	width,
	onFocus,
	onBlur,
	incrementButtons,
	autoFocus,
	placeholder,
	leftSide,
	rightSide,
	withClearButton,
	autoComplete,
	max,
	min,
	readOnly,
	required,
	step,
	tabIndex,
	inputContainerRef,
	inputRef,
	ariaLabel,
	iconSize,
	label,
	caption,
	labelPosition,
	focused,
	rows,
	minRows,
	maxRows,
	onKeyDownCapture,
	onKeyPress,
	onKeyPressCapture,
	onKeyUp,
	onKeyUpCapture,
	onKeyDown,
}: Props) {
	const [currentValue, setCurrentValue] = useState<TextFieldPropValue>(
		initValue || null
	);
	function onChangeAction(e: TextFieldOnChangeArguments) {
		const newValue =
			type === "email" ? e.value?.toLowerCase() || null : e.value || null;
		setCurrentValue(newValue);
		onChange && onChange(e);
	}
	function onBlurAction() {
		onBlur && onBlur(currentValue);
	}
	return (
		<TextField
			value={currentValue}
			className={className}
			cols={cols}
			id={id}
			name={name}
			type={type}
			disabled={disabled}
			maxLength={maxLength}
			size={size}
			view={view}
			form={form}
			state={state}
			status={status}
			width={width}
			incrementButtons={incrementButtons}
			autoFocus={autoFocus}
			placeholder={placeholder}
			leftSide={leftSide}
			rightSide={rightSide}
			withClearButton={withClearButton}
			autoComplete={autoComplete}
			max={max}
			min={min}
			readOnly={readOnly}
			required={required}
			step={step}
			tabIndex={tabIndex}
			inputContainerRef={inputContainerRef}
			inputRef={inputRef}
			ariaLabel={ariaLabel}
			iconSize={iconSize}
			label={label}
			caption={caption}
			labelPosition={labelPosition}
			focused={focused}
			rows={rows}
			minRows={minRows}
			maxRows={maxRows}
			onChange={onChangeAction}
			onFocus={onFocus}
			onBlur={onBlurAction}
			onKeyDownCapture={onKeyDownCapture}
			onKeyPress={onKeyPress}
			onKeyPressCapture={onKeyPressCapture}
			onKeyUp={onKeyUp}
			onKeyUpCapture={onKeyUpCapture}
			onKeyDown={onKeyDown}
		/>
	);
}

export { EduTextField as TextField };
