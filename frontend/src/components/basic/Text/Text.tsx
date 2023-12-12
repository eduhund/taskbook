import { Text, TextProps } from "@consta/uikit/Text";

type EduProps = {
	preset?: "t1" | "t2" | "t3" | "t4" | "t5" | "t6" | "t7" | undefined;
	children?: React.ReactNode | string;
	id?: string;
	as?: any;
	href?: string | undefined;
	target?: "_blank";
	rel?: string;
	className?: string | undefined;
	onClick?: React.EventHandler<React.MouseEvent>;
};

type Props = TextProps & EduProps;

function EduText({
	children,
	preset,
	id,
	align,
	cursor,
	decoration,
	display,
	font,
	lineHeight,
	size,
	spacing,
	fontStyle,
	transform,
	type,
	view,
	weight,
	width,
	truncate,
	as,
	className,
	href,
	target,
	rel,
	onClick,
}: Props) {
	let basicStyle = {};
	switch (preset) {
		case "t1":
			basicStyle = {
				size: "4xl",
				lineHeight: "xs",
				weight: "bold",
			};
			break;
		case "t2":
			basicStyle = {
				size: "3xl",
				lineHeight: "xs",
				weight: "semibold",
			};
			break;
		case "t3":
			basicStyle = {
				size: "2xl",
				lineHeight: "xs",
				weight: "semibold",
			};
			break;
		case "t4":
			basicStyle = {
				size: "xl",
				lineHeight: "xs",
				weight: "semibold",
			};
			break;
		case "t5":
			basicStyle = {
				size: "m",
				lineHeight: "m",
				weight: "semibold",
			};
			break;
		case "t6":
			basicStyle = {
				size: "m",
				lineHeight: "m",
			};
			break;
		case "t7":
			basicStyle = {
				size: "s",
				lineHeight: "m",
			};
			break;
		default:
			basicStyle = {
				size,
				lineHeight,
				weight,
			};
	}
	return (
		<Text
			{...basicStyle}
			id={id}
			align={align}
			cursor={cursor}
			decoration={decoration}
			display={display}
			font={font}
			spacing={spacing}
			fontStyle={fontStyle}
			transform={transform}
			type={type}
			view={view}
			width={width}
			truncate={truncate}
			as={as}
			href={href}
			target={target}
			rel={rel}
			className={className}
			onClick={onClick}
		>
			{children}
		</Text>
	);
}

export { EduText as Text };
