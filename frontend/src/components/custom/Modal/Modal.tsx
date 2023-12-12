import "./Modal.css";
import { Modal } from "@consta/uikit/Modal";
import { PropsWithHTMLAttributes } from "@consta/uikit/__internal__/src/utils/types/PropsWithHTMLAttributes";

import { Button, Text } from "../../Сomponents";
import { IconClose } from "../../Icons";
import { setString } from "../../../services/multilang/langselector";

type ModalPropWidth = "auto";
type ModalPropPosition = "center" | "top";

type ModalProps = PropsWithHTMLAttributes<
	{
		isOpen?: boolean;
		onClose?: () => void;
		onOpen?: () => void;
		hasOverlay?: boolean;
		onClickOutside?: (event: MouseEvent) => void;
		onEsc?: (event: KeyboardEvent) => void;
		rootClassName?: string;
		width?: ModalPropWidth;
		position?: ModalPropPosition;
		children?: React.ReactNode;
		container?: HTMLDivElement | undefined;
		refsForExcludeClickOutside?: React.RefObject<HTMLElement>[];
		title?: string;
	},
	HTMLDivElement
>;

type EduProps = {
	onCloseButton?:
		| ((event: React.MouseEvent<Element, MouseEvent>) => void)
		| undefined;
};

type Props = ModalProps & EduProps;

function EduModal({
	children,
	isOpen,
	hasOverlay,
	rootClassName,
	width,
	position,
	container,
	refsForExcludeClickOutside,
	title,
	onOpen,
	onClose,
	onClickOutside,
	onEsc,
	onCloseButton,
}: Props) {
	return (
		<Modal
			isOpen={isOpen}
			hasOverlay={hasOverlay}
			rootClassName={rootClassName}
			width={width}
			position={position}
			container={container}
			refsForExcludeClickOutside={refsForExcludeClickOutside}
			onOpen={onOpen}
			onClose={onClose}
			onClickOutside={onClickOutside}
			onEsc={onEsc}
		>
			<div className="modalHeader">
				<Text as="h3" size="m" view="secondary">
					{title}
				</Text>
				<Button
					size="s"
					view="clear"
					iconLeft={IconClose}
					onlyIcon
					label={setString("ru", "popupClose")}
					width="default"
					onClick={onCloseButton}
				/>
			</div>
			{children}
		</Modal>
	);
}

export { EduModal as Modal };
