import MissContent from "../../components/MissContent";
import { Image, Text } from "../../components/Сomponents";

type RichTextItemProps = {
	type:
		| "text"
		| "bold"
		| "italic"
		| "underline"
		| "strikethrought"
		| "link"
		| "mono"
		| "span";
	value: string;
	link?: string;
};

type ListItemProps = {
	id: string;
	type?: string;
	value: string;
};

type BlockProps = {
	id: string;
	type:
		| "h2"
		| "h3"
		| "h4"
		| "ol"
		| "ul"
		| "p"
		| "span"
		| "richText"
		| "crib"
		| "img"
		| "diploma"
		| "video"
		| "matrixQuestion"
		| "matrixAlt";
	value: any;
	list?: ListItemProps[];
	link?: string;
	url?: string;
	caption?: string;
};

function RichText(items: RichTextItemProps[]) {
	return (
		<p>
			{items.map(({ type, value, link }: RichTextItemProps) => {
				switch (type) {
					case "text":
						return <Text as="span">{value}</Text>;
					case "bold":
						return (
							<Text as="b" weight="bold">
								{value}
							</Text>
						);
					case "italic":
						return <Text as="i">{value}</Text>;
					case "underline":
						return <Text as="u">{value}</Text>;
					case "strikethrought":
						return <Text as="s">{value}</Text>;
					case "link":
						return (
							<Text
								as="a"
								view="link"
								href={link}
								target="_blank"
								rel="noopener noreferrer"
							>
								{value}
							</Text>
						);
					case "mono":
						return (
							<Text as="span" className="mono__text">
								{value}
							</Text>
						);
					case "span":
						return (
							<Text preset="t7" as="span">
								{value}
							</Text>
						);
					default:
						return <></>;
				}
			})}
		</p>
	);
}

function Block({ id, type, value, list, link, url, caption }: BlockProps): any {
	try {
		switch (type) {
			case "h2":
				return (
					<Text key={id} preset="t3" as="h2" id={id}>
						{value}
					</Text>
				);
			case "h3":
				return (
					<Text key={id} preset="t4" as="h3" id={id}>
						{value}
					</Text>
				);
			case "h4":
				return (
					<Text key={id} preset="t5" as="h4" id={id}>
						{value}
					</Text>
				);
			case "ol":
				const ol =
					list &&
					list.map((li: any) => (
						<li key={li.id}>
							{li.type === "richText" ? (
								RichText(li.value || [])
							) : (
								<Text preset="t6" as="p">
									{li.value}
								</Text>
							)}
						</li>
					));
				return <ol key={id}>{ol}</ol>;
			case "ul":
				const ul =
					list &&
					list.map((li: any) => (
						<li key={li.id}>
							{li.type === "richText" ? (
								RichText(li.value || [])
							) : (
								<Text preset="t6" as="p">
									{li.value}
								</Text>
							)}
						</li>
					));
				return <ul key={id}>{ul}</ul>;
			case "p":
				return link ? (
					<Text
						key={id}
						as="a"
						view="link"
						target="_blank"
						rel="noopener noreferrer"
						href={link}
					>
						{value}
					</Text>
				) : (
					<Text key={id} preset="t6" as="p">
						{value}
					</Text>
				);
			case "span":
				return (
					<Text key={id} preset="t7" as="span">
						{value}
					</Text>
				);
			case "richText":
				return RichText(value || []);
			case "crib":
				return <div className="analysContainer">{(value || []).map(({ id, type, value, altText }: any) => (
					<Block
						id={id}
						key={id}
						type={type}
						value={value || altText}
						list={list}
						link={link}
						url={url}
						caption={caption}
					/>))}</div>
			case "img":
				return (
					<Image
						key={id}
						url={url || ""}
						caption={caption}
						preview={false}
						border={false}
						shadow={false}
					/>
				);
			case "diploma":
				return (
					<a href="./diploma">
						<Image
							key={id}
							url={url || ""}
							caption={caption}
							preview={false}
							border={true}
							shadow={true}
						/>
					</a>
				);
			case "video":
				return (
					<div key={id} className="iFrameContainer">
						<img className="ratio" src="http://placehold.it/16x9" alt="ratio" />
						<iframe
							src={link}
							title="YouTube video player"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						></iframe>
					</div>
				);
			case "matrixQuestion":
				return (
					<Text key={id} preset="t4" as="h3">
						{value}
					</Text>
				);
			case "matrixAlt":
				return (
					<Text key={id} preset="t6" as="p">
						{value}
					</Text>
				);
			default:
				console.log("e")
				return <MissContent key={id} />;
		}
	} catch (e) {
		return <MissContent />;
	}
}

export { Block };
