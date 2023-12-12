import "./Image.css";
import { useState } from "react";
import { Modal, Text } from "../../Сomponents";

type SingleImageProps = {
	url: string;
	caption?: string;
	border?: boolean;
	shadow?: boolean;
	preview?: boolean;
	onClick?: React.EventHandler<React.MouseEvent>;
};

function EduImage({
	url,
	caption,
	border = true,
	shadow = true,
	preview = true,
	onClick,
}: SingleImageProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	function onClickAction(e: any) {
		setIsModalOpen(true);
		if (onClick) {
			onClick(e);
		}
	}

	return (
		<div className="imageContainer">
			<img
				className={`${preview ? "imageScalable" : ""} ${
					border ? "imageBorder" : ""
				} ${shadow ? "imageShadow" : ""}`}
				src={url}
				alt={caption}
				onClick={onClickAction}
			/>
			{caption && (
				<Text as="span" size="m" view="secondary">
					{caption}
				</Text>
			)}
			{preview && (
				<Modal
					isOpen={isModalOpen}
					title={caption}
					hasOverlay
					onClickOutside={() => setIsModalOpen(false)}
					onEsc={() => setIsModalOpen(false)}
					onCloseButton={() => setIsModalOpen(false)}
				>
					<div className="modalImageContainer">
						<img src={url} alt={caption} />
					</div>
				</Modal>
			)}
		</div>
	);
}

export { EduImage as Image };
