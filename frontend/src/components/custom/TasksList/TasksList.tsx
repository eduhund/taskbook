import "./TasksList.css";
import { useEffect, useState } from "react";
import { Text, SkeletonBrick } from "../../Сomponents";
import { TaskStatus } from "../TaskStatus/TaskStatus";
import { getLessonNav } from "../../../services/api/api";
import { setString } from "../../../services/multilang/langselector";

type TasksListProps = {
	listType: "nav" | "list";
	lessonId: string;
	lang?: string;
};

type TasksListItemProps = {
	id?: string;
	type: string;
	name: string;
	title: string;
	isChecked?: boolean;
	inProcess?: boolean;
	score?: number;
	maxScore?: number;
	active: boolean;
	path: string;
};

function TasksList({ listType, lessonId, lang }: TasksListProps) {
	const path = document.location.pathname.split("/");
	const taskPath = path[3];

	const [tasks, setTasks] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true)
			const {OK, data, error} = await getLessonNav(lessonId);
			if (OK) {
				setTasks(data);
			}
			setIsLoading(false)
		}
		if (!lessonId.endsWith("undefined")) {
			fetchData();
		}
	}, [lessonId]);

	function TasksListItem(
		{
			id,
			type,
			name,
			title,
			isChecked,
			inProcess,
			score,
			maxScore,
			active,
			path,
		}: TasksListItemProps,
		lang?: string
	) {
		return (
			<a
				className={`tasksListItem${active ? " active" : ""}`}
				href={
					path ||
					`/${id?.substring(0, 3)}/${id?.substring(3, 5)}/${
						id?.substring(5, 7) || ""
					}`
				}
			>
				<div className={`listItemLabel ${type}`}>
					<Text preset="t7" className="listItemType" view="secondary">
						{type === "practice"
							? `${setString(lang, "navMenuPractice")} ${name}`
							: setString(lang, "navMenuTheory")}
					</Text>
				</div>
				{type === "practice" && (
					<TaskStatus
						className="badge"
						isChecked={isChecked || false}
						size={"s"}
						lang={lang}
						inProcess={inProcess}
						score={score}
						maxScore={maxScore}
					/>
				)}
				<Text preset="t6" className="listItemTitle">
					{title}
				</Text>
			</a>
		);
	}

	const lessonStartItem = {
		type: "start",
		active: taskPath === undefined,
		path: `/${path[1]}/${lessonId?.substring(3, 5)}`,
		name: setString(lang, "navMenuLessonStart"),
		title: setString(lang, "navMenuLessonStart"),
	};

	const lessonFinalItem = {
		type: "final",
		active: taskPath === "final",
		path: `/${path[1]}/${lessonId?.substring(3, 5)}/final`,
		name: setString(lang, "navMenuLessonFinalTitle"),
		title: setString(lang, "navMenuLessonFinalTitle"),
	};

	return (
		<div className={`tasksListContainer ${listType}`}>
			{isLoading ? <SkeletonBrick width={listType === "list" ? 278 : 450} height={700} /> : 
			tasks ? (
				<>
					{TasksListItem(lessonStartItem, lang)}
					{tasks.map((item: any) => {
						if (
							item.id.substring(5, 7) ===
							(taskPath || "").toString().padStart(2, "0")
						) {
							item.active = true;
						}
						return TasksListItem(item, lang);
					})}
					{TasksListItem(lessonFinalItem, lang)}
				</>
			) : <></>}
		</div>
	);
}

export { TasksList };
