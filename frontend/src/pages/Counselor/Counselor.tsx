import "./Counselor.css";
import { useEffect, useState } from "react";
import {
	Button,
	Card,
	Header,
	SpinLoader,
	Text,
} from "../../components/Сomponents";
import { IconBackward } from "../../components/Icons";
import { getCounselor } from "../../services/api/api";
import { setString } from "../../services/multilang/langselector";
import { BuildText } from "../../services/textBuilder/textBuilder";

const lang = localStorage.getItem("lang") || undefined;

function Anchors({ content }: any) {
	const filteredContent = (content || []).filter(
		(item: any) => item.type === "h2"
	);
	return filteredContent.map((item: any) => (
		<Text
			preset="t6"
			as="a"
			className="content__subtitle"
			href={`#${item?.id}`}
			view="primary"
		>
			{item.value}
		</Text>
	));
}

function Counselor() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [info, setInfo] = useState<any>(null);
	const [page, setPage] = useState<any>(0);

	useEffect(() => {
		setIsLoading(true)
		getCounselor(lang)
		.then((response: any) => {
			const { OK, data, error} = response
			if (OK) {
				setInfo(data);
			}
			setIsLoading(false)
		});
	}, []);

	document.title = `eduHund | ${setString(lang, "counselorHeader")}`;

	const ModuleStartContent = 
		<>
			<Header type="dashboard" />
			<div className="mainContainer">
				{isLoading ? <SpinLoader /> :
					info ? 
					<div className="mainContent">
					<div className="contentBlock">
						<div className="moduleSidebar">
							<Button
								view="clear"
								iconLeft={IconBackward}
								label={setString(lang, "counselorBack")}
								onClick={() => (document.location.href = "/")}
							/>
							<Text preset="t1" className="sidebarHeader">
								{setString(lang, "counselorHeader")}
							</Text>
							<ul className="counselorList">
								{(info || []).map((item: any, index: any) => (
									<li
										className={
											index === page
												? "counselorListItem active"
												: "counselorListItem"
										}
										onClick={() => setPage(index)}
									>
										<Text preset="t6" as="p">
											{item.title}
										</Text>
									</li>
								))}
							</ul>
							<img
								src="https://files.eduhund.com/img/corner.png"
								alt="corner"
								width="270"
							></img>
						</div>
						<Card className="oneColumn">
							<Text
								preset="t2"
								as="h2"
								className="contentSubtitle"
								view="primary"
							>
								{info[page]?.title}
							</Text>
							<div className="conselorAnchors">
								<Anchors content={info[page]?.content} />
							</div>
							{BuildText(info[page]?.content)}
						</Card>
					</div>
				</div>
				: <></>}
			</div>
		</>

	return ModuleStartContent;
}

export { Counselor };
