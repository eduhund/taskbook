import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, SpinLoader, Text } from "../../components/Сomponents";
import { IconForward } from "../../components/Icons";
import { BuildText } from "../../services/textBuilder/textBuilder";
import { Header, LessonsList } from "../../components/Сomponents";
import { getModuleStart } from "../../services/api/api";
import { setString } from "../../services/multilang/langselector";
import { go } from "../../services/helpers/helpers";

function ModuleStart() {
	const params = useParams();
	const module = params.module?.toUpperCase();

	const [data, setData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const moduleInfo = {
		label: data?.moduleShortName,
		id: module,
	};

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const {OK, data, error} = await getModuleStart(module);
			if (OK) {
				setData(data);
			}
			setIsLoading(false);
		}
		fetchData();
	}, [module]);

	return (
		<>
			<Header
				withNav={data ? true : false}
				type="moduleStart"
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
						{data?.lessons && (
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
								<Text preset="t3" className="sidebarHeader">
									{setString(data?.lang, "moduleStartNavHeader")}
								</Text>
								<LessonsList type="list" lessons={data?.lessons} />
							</div>
						)}
						<Card className="oneColumn">
							<Text
								preset="t2"
								as="h1"
								className="pageTitle"
								view="primary"
							>
								{data?.name}
							</Text>
							<Text
								preset="t1"
								as="h2"
								className="pageSubtitle"
								view="brand"
							>
								{setString(data?.lang, "moduleStartHeader")}
							</Text>
							{BuildText(data?.intro)}
							<div className="contentButtons">
								<Button
									label={setString(data?.lang, "moduleStartGo")}
									iconRight={IconForward}
									onClick={() => go(`/${module}/01`)}
								/>
							</div>
						</Card>
					</div>
				</div> : <></>}
			</div>
		</>
	);
}

export { ModuleStart };
