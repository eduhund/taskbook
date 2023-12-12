import { Button, Props as ButtonProps } from "@consta/uikit/Button";
import { useState } from "react";

type EduProps = {
	type?: any;
	children?: React.ReactNode;
	className?: string;
};

type Props = ButtonProps & EduProps;

function EduButton({
	children,
	className,
	size,
	view,
	width,
	form,
	tabIndex,
	loading,
	disabled,
	onlyIcon,
	iconLeft,
	iconRight,
	iconSize,
	label,
	title,
	onClick,
}: Props) {
	const [isLoading, setLoading] = useState<boolean | undefined>(
		loading === undefined && false
	);
	async function onClickAction(e: React.MouseEvent) {
		if (onClick) {
			setLoading(true);
			await onClick(e);
			setLoading(false);
		}
	}

	return (
		<Button
			className={className}
			size={size}
			view={view}
			width={width}
			form={form}
			tabIndex={tabIndex}
			loading={loading || isLoading}
			disabled={disabled}
			onlyIcon={onlyIcon}
			iconLeft={iconLeft}
			iconRight={iconRight}
			iconSize={iconSize}
			label={label}
			title={title}
			onClick={onClickAction}
		>
			{children}
		</Button>
	);
}

export { EduButton as Button };
