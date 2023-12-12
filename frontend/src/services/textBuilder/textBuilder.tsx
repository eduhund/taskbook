import { Block } from "./Block";

function BuildText(array = []) {
	if (!Array.isArray(array) || array.length === 0) return <></>;

	const text = array.map(({ id, type, value, list, link, url, caption }) => (
		<Block
			id={id}
			key={id}
			type={type}
			value={value}
			list={list}
			link={link}
			url={url}
			caption={caption}
		/>
	));

	return text;
}

export { BuildText };
