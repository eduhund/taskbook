import "./ModuleInfo.css";
import { useState, useEffect } from "react";
import { Calendar, Text, SkeletonBrick } from "../../Сomponents";
import { getModuleInfo } from "../../../services/api/api";
import { setString } from "../../../services/multilang/langselector";
import en from "date-fns/locale/en-US";
import ru from "date-fns/locale/ru";

type localeType = {
	[key: string]: Locale;
};

const locale: localeType = {
	ru,
	en,
};

const localeString: any = {
	ru: "ru-RU",
	en: "en-US",
};

function ModuleInfo({ moduleId }: any) {
	const [moduleInfo, setModuleInfo] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true)
			const {OK, data, error} = await getModuleInfo(moduleId || "");
			if (OK) {
				setModuleInfo(data);
			}
			setIsLoading(false)
		}
		fetchData();
	}, [moduleId]);

	const startDate = new Date(moduleInfo?.startDate || "2022-09-01");
	const deadline = new Date(moduleInfo?.deadline || "2022-12-31");

	const UIdeadline = deadline.toLocaleDateString(
		localeString[moduleInfo?.lang || "ru"],
		{
			day: "numeric",
			month: "long",
		}
	);
	const UIcountdown = (
		(Number(deadline) - Number(Date.now())) /
		(1000 * 3600 * 24)
	).toFixed();
	return (
		<>
		{isLoading ? <SkeletonBrick width={350} height={500} /> :
		moduleInfo ?
		<>
			<div className="moduleInfo">
				<Text preset="t4" as="span" view="brand">
					{setString(moduleInfo?.lang, "moduleCardDoneTasks", {
						doneTasks: moduleInfo?.doneTasks,
						total: moduleInfo?.totalTasks,
					})}
				</Text>
				<Text preset="t2" as="h2" view="secondary">
					{moduleInfo?.name}
				</Text>
				<div className="moduleInfoLinks">
					<Text preset="t6" as="a" view="link" href={`/${moduleId}`}>
						{setString(moduleInfo?.lang, "navMenuIntro")}
					</Text>
					<Text
						preset="t6"
						as="a"
						view="link"
						href={`${moduleInfo?.moduleLink}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{setString(moduleInfo?.lang, "navMenuInfo")}
					</Text>
				</div>
				<Calendar
					locale={locale[moduleInfo?.lang || "ru"]}
					type="date"
					currentVisibleDate={new Date(Date.now())}
					value={[startDate, deadline]}
					minDate={startDate}
					maxDate={deadline}
				/>
				<div className="moduleCalendarEvents">
					<Text preset="t7" as="span" view="secondary">
						{setString(moduleInfo?.lang, "moduleCardDeadline", {
							deadline: UIdeadline,
						})}
					</Text>
					<Text preset="t7" as="span" view="secondary">
						{setString(moduleInfo?.lang, "moduleCardCountdown", {
							days: UIcountdown,
						})}
					</Text>
				</div>
			</div>
		</> : <></>}
	</>
	);
}

export { ModuleInfo };
