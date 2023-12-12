import "./HeaderNav.css";
import { Theme, presetGpnDefault, presetGpnDark } from "@consta/uikit/Theme";
import { useParams } from "react-router-dom";
import { Button } from "../../Сomponents";
import {
	IconArrowLeft,
	IconArrowRight,
	IconClose,
	IconHamburger,
} from "../../Icons";
import { TaskStatus } from "../TaskStatus/TaskStatus";
import { setString } from "../../../services/multilang/langselector";

type HeaderNavProps = {
	isOpen: boolean;
	type: string;
	lang?: string;
	userLang?: string;
	navData?: {
		moduleShortName: string;
		lessonNumber: number;
		taskType: string;
		taskName: string;
		nearbyTasks: any;
		totalTasks: number;
		taskStatus: boolean;
		taskScore: number;
		taskMaxScore: number;
		inProcess: boolean;
	};
	onClick: any;
};

function HeaderNav({
	type,
	navData,
	lang,
	userLang,
	isOpen,
	onClick,
}: HeaderNavProps) {
	const params = useParams();

	const moduleName = navData?.moduleShortName;
	const lessonName = navData?.lessonNumber;
	const taskName = navData?.taskName;
	const totalTasks = navData?.totalTasks;

	const prevTaskId = navData?.nearbyTasks?.prev?.id;
	const nextTaskId = navData?.nearbyTasks?.next?.id;

	const currentTaskLabel: any = {
		theory: `${moduleName} • ${setString(
			lang,
			"navMenuLesson"
		)} ${lessonName} • ${setString(lang, "navMenuTheory")}`,
		practice: `${moduleName} • ${setString(
			lang,
			"navMenuLesson"
		)} ${lessonName} • ${setString(lang, "navMenuCounter", {
			current: taskName,
			total: totalTasks,
		})}`,
		lessonStart: `${moduleName} • ${setString(
			lang,
			"navMenuLesson"
		)} ${lessonName} • ${setString(lang, "navMenuLessonStart")}`,
		lessonFinal: `${moduleName} • ${setString(
			lang,
			"navMenuLesson"
		)} ${lessonName} • ${setString(lang, "navMenuLessonFinal")}`,
		moduleStart: `${moduleName} • ${setString(lang, "navMenuIntro")}`,
		moduleFinal: `${moduleName} • ${setString(lang, "navMenuFinal")}`,
		cert: `${moduleName} • ${setString(userLang, "moduleCardDiploma")}`,
	};

	document.title = `eduHund | ${
		moduleName ? currentTaskLabel[type] : setString(lang, "titleLoading")
	}`;

	function prevTask() {
		if (prevTaskId) {
			document.location.href = `/${prevTaskId.substring(0, 3)}/${Number(
				prevTaskId.substring(3, 5)
			)}/${Number(prevTaskId.substring(5, 7))}`;
		} else {
			document.location.href = `/${params?.module}/${params?.lesson}/`;
		}
	}

	function nextTask() {
		if (nextTaskId) {
			document.location.href = `/${nextTaskId.substring(0, 3)}/${Number(
				nextTaskId.substring(3, 5)
			)}/${Number(nextTaskId.substring(5, 7))}`;
		} else {
			document.location.href = `/${params?.module}/${params?.lesson}/final`;
		}
	}

	return (
		<Theme preset={isOpen ? presetGpnDefault : presetGpnDark}>
			<div className={isOpen ? "headerNavButton active" : "headerNavButton"}>
				{navData?.nearbyTasks && (
					<Button
						label={setString(lang, "taskPrev")}
						view="clear"
						iconLeft={IconArrowLeft}
						onlyIcon
						onClick={prevTask}
					/>
				)}
				<button
					className="Button Button_size_m Button_view_clear Button_width_default Button_form_default MixFocus navButton"
					onClick={onClick}
				>
					{isOpen ? (
						<IconClose className="icon" />
					) : (
						<IconHamburger className="icon" />
					)}
					<div className="navButtonTitle">{currentTaskLabel[type]}</div>
					{type === "practice" && (
						<TaskStatus
							className="badge"
							isChecked={navData?.taskStatus || false}
							size={"m"}
							lang={lang}
							score={navData?.taskScore}
							inProcess={navData?.inProcess}
							maxScore={navData?.taskMaxScore}
						/>
					)}
				</button>
				{navData?.nearbyTasks && (
					<Button
						label={setString(lang, "taskNext")}
						view="clear"
						iconLeft={IconArrowRight}
						onlyIcon
						onClick={nextTask}
					/>
				)}
			</div>
		</Theme>
	);
}

export { HeaderNav };
