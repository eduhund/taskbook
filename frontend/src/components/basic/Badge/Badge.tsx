import {
	Badge,
	BadgePropForm,
	BadgePropSize,
	BadgePropStatus,
	BadgePropView,
} from "@consta/uikit/Badge";
import { IconComponent } from "@consta/uikit/__internal__/src/icons/Icon/Icon";

type BadgeProps = {
	size?: BadgePropSize;
	view?: BadgePropView;
	status?: BadgePropStatus;
	form?: BadgePropForm;
	minified?: boolean;
	icon?: IconComponent;
	label?: string;
	children?: never;
};

type EduProps = {
	className?: string;
	style?: any;
};

type Props = BadgeProps & EduProps;

function EduBadge({
	size,
	view,
	status,
	form,
	minified,
	icon,
	label,
	className,
	style,
}: Props) {
	return (
		<Badge
			size={size}
			view={view}
			status={status}
			form={form}
			minified={minified}
			icon={icon}
			label={label}
			className={className}
			style={style}
		/>
	);
}

export { EduBadge as Badge };
