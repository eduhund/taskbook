import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Button,
	Card,
	Header,
	SpinLoader,
	TasksList,
	Text,
} from "../../components/Сomponents";
import { IconForward } from "../../components/Icons";
import { getLessonStart } from "../../services/api/api";
import { setString } from "../../services/multilang/langselector";
import { BuildText } from "../../services/textBuilder/textBuilder";

function LessonStart() {
	const params = useParams();
	const module = params.module?.toUpperCase();
	const lesson = params.lesson?.toString().padStart(2, "0");
	const lessonId = `${module}${lesson}`;

	const [data, setData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const moduleInfo = {
		label: data?.moduleShortName,
		id: module,
	};

	const lessonInfo = {
		label: data?.lessonName,
		id: lesson,
	};

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const {OK, data, error} = await getLessonStart(lessonId);
			if (OK) {
				setData(data);
			}
			setIsLoading(false);
		}
		fetchData();
	}, [lessonId]);

	return (
		<>
			<Header
				type="lessonStart"
				withNav={data ? true : false}
				module={moduleInfo}
				lesson={lessonInfo}
				lessonNumber={Number(lesson)}
				moduleShortName={data?.shortName}
				deadline={data?.deadline}
				lang={data?.lang}
			/>
			<div className="mainContainer">
			{isLoading ? <SpinLoader /> :
					data ? 
				<div className="mainContent">
					<div className="contentBlock">
						<div className="moduleSidebar">
							<Text preset="t3" as="h2" className="sidebarHeader">
								{setString(data?.lang, "lessonNavHeader")}
							</Text>
							<TasksList
								listType="list"
								lessonId={lessonId}
								lang={data?.lang}
							/>
						</div>
						<Card className="oneColumn">
							<Text preset="t1" as="h1" className="pageTitle" view="brand">
								{data?.lessonName}
							</Text>
							<Text
								preset="t2"
								as="p"
								className="pageSubtitle"
								view="primary"
							>
								{data?.description}
							</Text>
							{BuildText(data?.intro)}
							<div className="contentButtons">
								<Button
									label={setString(data?.lang, "taskStart")}
									iconRight={IconForward}
									onClick={() =>
										(document.location.href = `/${module}/${lesson}/01`)
									}
								/>
							</div>
						</Card>
					</div>
				</div> : <></>}
			</div>
		</>
	);
}

export { LessonStart };
