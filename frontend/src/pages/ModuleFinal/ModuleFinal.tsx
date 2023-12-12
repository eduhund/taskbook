import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Card,
	Header,
	ModuleCard,
	SpinLoader,
	Text,
} from "../../components/Сomponents";
import { getModuleFinal, getDashboard } from "../../services/api/api";
import { setString } from "../../services/multilang/langselector";
import { BuildText } from "../../services/textBuilder/textBuilder";

const localeString: any = {
	ru: "ru-RU",
	en: "en-US",
};

function ModuleFinal() {
	const params = useParams();
	const module = params.module?.toUpperCase();

	const [data, setData] = useState<any>(null);
	const [modules, setModules] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const moduleInfo = {
		label: data?.moduleShortName,
		id: module,
	};

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const {OK, data, error} = await getModuleFinal(module || "");
			const modulesData = await getDashboard();

			if (OK) {
				setData(data);
			}

			if (modulesData?.OK) {
				const availableMpdules = (modulesData?.data?.modules || []).filter(
					(userModule: any) =>
						userModule.status === "available" && userModule.active
				);

				setModules(availableMpdules);
			}

			setIsLoading(false);
		}
		fetchData();
	}, [module]);

	const progress = setString(data?.lang, "lessonFinalProgress", {
		done: data?.doneTasks,
		totalTasks: data?.totalTasks,
		score: data?.score,
		maxScore: data?.maxScore,
	});

	const OtherModules = (modules || []).map((module: any) => (
		<ModuleCard type="medium" status={module?.status} data={module} />
	));

	return (
		<>
			<Header
				withNav={data ? true : false}
				type="moduleFinal"
				module={moduleInfo}
				moduleShortName={data?.shortName}
				deadline={data?.deadline}
				lang={data?.lang}
			/>
			<div className="mainContainer">
			{isLoading ? <SpinLoader /> :
					data ? 
				<div className="mainContent">
					<div className="contentBlock">
						{data?.final?.things && (
							<div className="moduleSidebar">
								<div className="sidebarMascot">
									<img
										src={
											data?.mascot?.small ||
											"https://files.pavlova.cc/eduhund/mascots/txt-1.png"
										}
										alt="Маскот"
										width="100"
									></img>
								</div>
								<Text preset="t2" className="sidebarHeader">
									{data?.moduleName}
								</Text>
								<Text
									preset="t6"
									as="span"
									className="lessons__header__deadline"
								>
									{setString(data?.lang, "moduleCardDeadline", {
										deadline: new Date(data?.deadline).toLocaleDateString(
											localeString[data?.lang || "ru"],
											{ day: "numeric", month: "long" }
										),
									})}
								</Text>
								<div className="sidebarList">
									{BuildText(data?.final?.things)}
								</div>
							</div>
						)}
						<Card className="oneColumn">
							<Text preset="t1" as="h2" className="pageTitle" view="brand">
								{setString(data?.lang, "moduleFinalHeader")}
							</Text>
							<Text
								preset="t3"
								as="p"
								className="pageSubtitle"
								view="primary"
							>
								{progress}
							</Text>
							{BuildText(data?.final?.content)}
						</Card>
					</div>
					{modules && (
						<div className="contentBlock">
							<Text preset="t1" as="h2" className="modulesBlockHeader">
								{setString(data?.lang, "moduleFinalHext")}
							</Text>
							<div className="dashboardMainInfo">{modules && OtherModules}</div>
						</div>
					)}
				</div> : <></>}
			</div>
		</>
	);
}

export { ModuleFinal };
