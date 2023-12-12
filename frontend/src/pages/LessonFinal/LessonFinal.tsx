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
import { getLessonFinal } from "../../services/api/api";
import { setString } from "../../services/multilang/langselector";
import { BuildText } from "../../services/textBuilder/textBuilder";

function LessonFinal() {
	const params = useParams();
	const module = params.module?.toUpperCase();
	const lesson = params.lesson?.toString().padStart(2, "0");
	const lessonId = `${module}${lesson}`;

	const [data, setData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const moduleInfo = {
		label: data?.shortName,
		id: module,
	};

	const lessonInfo = {
		label: data?.lessonName,
		id: lesson,
	};

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const {OK, data, error} = await getLessonFinal(lessonId);
			if (OK) {
				setData(data);
			}
			setIsLoading(false);
		}
		fetchData();
	}, [lessonId]);

	const progress = setString(data?.lang, "lessonFinalProgress", {
		done: data?.doneTasks,
		totalTasks: data?.totalTasks,
		score: data?.score,
		maxScore: data?.maxScore,
	});

	function getSummary() {
		const percents = Math.trunc((data?.score / data?.maxScore) * 100);
		let suff = 3;
		if (percents >= 60) suff++;
		if (percents >= 80) suff++;
		return setString(data?.lang, `lessonFinalSummary${suff}`);
	}

	const nextLesson: any = {
		lesson: data?.nextLesson ? Number(lesson) + 1 : "final",
		label: data?.nextLesson
			? setString(data?.lang, "lessonFinalNext")
			: setString(data?.lang, "lessonFinalDone"),
	};

	return (
		<>
			<Header
				type="lessonFinal"
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
								{setString(data?.lang, "navMenuLesson")} №{data?.lessonNumber}
							</Text>
							<TasksList
								listType="list"
								lessonId={lessonId}
								lang={data?.lang}
							/>
						</div>
						<Card className="oneColumn">
							<Text preset="t1" as="h1" className="pageTitle" view="brand">
								{setString(data?.lang, "lessonFinalTitle")}
							</Text>
							<Text
								preset="t3"
								as="p"
								className="pageSubtitle"
								view="primary"
							>
								{progress}
							</Text>
							<Text
								preset="t6"
								as="p"
								className="pageSubtitle"
								view="primary"
							>
								{getSummary()}
							</Text>
							{BuildText(data?.content)}
							<div className="contentButtons">
								<Button
									label={nextLesson.label}
									iconRight={IconForward}
									onClick={() =>
										(document.location.href = `/${module}/${nextLesson.lesson}`)
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

export { LessonFinal };
