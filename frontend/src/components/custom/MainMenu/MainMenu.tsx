import "./MainMenu.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Text } from "../../Сomponents";
import { getModuleNav } from "../../../services/api/api";
import { TasksList } from "../TasksList/TasksList";
import { LessonsList } from "../LessonsList/LessonsList";
import { ModuleInfo } from "../ModuleInfo/ModuleInfo";

type Item = {
	id: string;
	title: string;
	description: string;
	currentLesson?: boolean;
	progress: number | null;
};

type MainMenuProps = {
	lang?: string;
	isOpen: boolean;
	hidePopup: (isOpen: boolean) => void;
};

function MainMenu({ lang, isOpen, hidePopup }: MainMenuProps) {
	const params = useParams();
	const [lessonList, setLessonList] = useState<any>();
	const [selectedLesson, setActiveLesson] = useState<Item | null>();

	function changeVisible() {
		hidePopup(!isOpen);
	}

	useEffect(() => {
		async function fetchData() {
			const response = await getModuleNav(params.module || "");
			if (response.OK) {
				const list = response?.data;
				setLessonList(list);
				if (params.lesson) {
					setActiveLesson(list[Number(params.lesson) - 1]);
				} else {
					for (let lesson of list) {
						if (lesson.currentLesson) {
							setActiveLesson(lesson);
						}
					}
				}
			}
		}
		fetchData();
	}, [params]);

	return (
		<div className={isOpen ? "modal" : "modal hidden"}>
			<div className="blocker" onClick={changeVisible}></div>
			<Card className="mainNavigation">
				<div className="mainNavigationContainer">
					<div className="mainNavigationLessons">
						<LessonsList
							type="nav"
							lessons={lessonList}
							activeLesson={selectedLesson}
							setActiveLesson={setActiveLesson}
						/>
					</div>
					<div className="mainNavigationTasks">
						<Text preset="t2" as="h2" view="brand">
							{selectedLesson?.title}
						</Text>
						<Text preset="t4" as="p">
							{selectedLesson?.description}
						</Text>
						<TasksList
							listType="nav"
							lang={lang}
							lessonId={`${params.module}${selectedLesson?.id}`}
						/>
					</div>
					<ModuleInfo moduleId={params.module} />
				</div>
			</Card>
		</div>
	);
}

export { MainMenu };
