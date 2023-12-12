import "./Diploma.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setString } from "../../services/multilang/langselector";
import {
	Card,
	Header,
	SkeletonBrick,
	SpinLoader,
	Switch,
} from "../../components/Сomponents";
import { getDiploma } from "../../services/api/api";
import { Skills } from "./Skills";
import { Settings } from "./Settings";
import initialState from "../../store/initialState";

const lang = localStorage.getItem("lang") || undefined;

function Diploma() {
	const URL = process.env.REACT_APP_LINK;
	const params = useParams();
	const moduleId = params.module?.toUpperCase() || "";

	const [data, setData] = useState<any>(null);
	const [withSkills, setwithSkills] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);

	const certId = data?.certId;

	const moduleInfo = {
		label: data?.shortName,
		id: moduleId,
	};

	async function fetchData(params: any) {
		setLoading(true);
		const response = await getDiploma(moduleId, params);
		setData(response.data);
		setLoading(false);
	}

	async function fetchDataBg(params: any) {
		getDiploma(moduleId, params);
	}

	useEffect(() => {
		async function initFetch() {
			const response = await getDiploma(moduleId, {});
			setData(response.data);
			setLoading(false);
		}
		initFetch();
	}, [moduleId]);

	return (
		<>
			<Header
				withNav={data ? true : false}
				type="cert"
				module={moduleInfo}
				moduleShortName={data?.shortName}
				deadline={data?.deadline}
			/>
			<div className="mainContainer">
				<div className="mainContent">
					<div className="contentBlock">
						<Card className="certContainer">
							{data && !loading ? (
								<>
									<img
										id="cert"
										className="cert"
										alt="diploma"
										src={`${URL}/diplomas/${
											data?.fileId
										}/medium.png?${Date.now()}`}
									/>
									{moduleId === "MIO" && (
										<Switch
											label={setString(lang, "diplomaDetail")}
											initChecked={withSkills}
											onChange={({ checked }) => setwithSkills(checked)}
										/>
									)}
									{withSkills && <Skills skillsList={data?.skills} />}
								</>
							) : (
								<SkeletonBrick width={595} height={810} />
							)}
						</Card>

						<Settings
							moduleId={moduleId}
							certId={certId}
							fileId={data?.fileId}
							lang={lang}
							params={{
								lang: data?.lang,
								isColor: data?.isColor,
								isMascot: data?.isMascot,
								isProgress: data?.isProgress,
								isPublic: data?.isPublic,
							}}
							withSkills={withSkills}
							isLoading={loading}
							onChange={fetchData}
							onChangeBg={fetchDataBg}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export { Diploma };
