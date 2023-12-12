import { useCallback, useEffect, useState } from "react";
import { setString } from "../../services/multilang/langselector";
import { Button, Switch, Text } from "../../components/Сomponents";
import { RadioGroup } from "@consta/uikit/RadioGroup";
import { IconCopy, IconDownload } from "../../components/Icons";
import { generatePDF } from "./PDFGenerator";

function Settings({
	moduleId,
	certId,
	fileId,
	isLoading,
	lang,
	params,
	withSkills,
	onChange,
	onChangeBg,
}: any) {
	type Item = {
		name: string;
		disabled?: boolean;
	};

	const languages = [
		{
			name: setString(lang, "enLang"),
			id: "en",
		},
		{
			name: setString(lang, "ruLang"),
			id: "ru",
		},
	];

	const selLang = languages.find((item) => item.id === (params?.lang || lang));

	const [language, setLanguage] = useState<Item | undefined>(selLang);
	const [isColor, setIsColor] = useState<boolean>(false);
	const [hideMascot, setHideMascot] = useState<boolean>(false);
	const [hideProgress, setHideProgress] = useState<boolean>(false);

	useEffect(() => {
		setLanguage(selLang)
		setIsColor(params?.isColor)
		setHideMascot(params?.isMascot === undefined ? false : !params?.isMascot)
		setHideProgress(params?.isProgress === undefined ? false : !params?.isProgress)
	}, [params.lang, params.isColor, params.isMascot, params.isProgress])

	const securityStates = [
		{
			name: setString(lang, "privateSecurity"),
			id: "false",
		},
		{
			name: setString(lang, "publicSecurity"),
			id: "true",
		},
	];

	const selSecurity = securityStates.find(
		(item) => item.id === (params?.isPublic || false).toString()
	);

	const [securityState, setSecurityState] = useState<Item | undefined>(
		selSecurity
	);

	function changeLanguage({ value }: { value: any }) {
		setLanguage(value);
		onChange({ lang: value.id });
	}

	const changeColor = useCallback(({ checked }: { checked: boolean }) => {
		setIsColor(checked);
		onChange({ isColor: checked });
		
	}, [isColor])

	function changeMascot({ checked }: { checked: boolean }) {
		setHideMascot(checked);
		onChange({ isMascot: !checked });
	}

	function changeProgress({ checked }: { checked: boolean }) {
		setHideProgress(checked);
		onChange({ isProgress: !checked });
	}

	function changeSecurity({ value }: { value: any }) {
		//setSecurityState(value);
		onChangeBg({ isPublic: value.id });
	}

	function DiplomaLang() {
		return (
			<div className="certSettingsItem">
				<Text preset="t4">{setString(lang, "diplomaUIlang")}</Text>
				<RadioGroup
					value={language}
					items={languages}
					disabled={isLoading}
					getLabel={(item) => item.name}
					onChange={changeLanguage}
				/>
			</div>
		);
	}

	function DiplomaStyle() {
		return (
			<div className="certSettingsItem">
				<Text preset="t4">{setString(lang, "diplomaUIstyle")}</Text>
				<Switch
					initChecked={isColor}
					disabled={isLoading}
					label={setString(lang, "isColorControl")}
					onChange={changeColor}
				/>
				<Switch
					initChecked={hideMascot}
					disabled={isLoading || isColor}
					label={setString(lang, "isMascotControl")}
					onChange={changeMascot}
				/>
				<Switch
					initChecked={hideProgress}
					disabled={isLoading}
					label={setString(lang, "isProgressControl")}
					onChange={changeProgress}
				/>
			</div>
		);
	}

	function DiplomaSecurity() {
		return (
			<div className="certSettingsItem">
				<Text preset="t4">{setString(lang, "diplomaUIprivacy")}</Text>
				<RadioGroup
					value={securityState}
					items={securityStates}
					disabled={isLoading}
					getLabel={(item) => item.name}
					onChange={changeSecurity}
				/>
				{securityState?.name === "Доступен по внешней ссылке" && (
					<div className="certLinkArea">
						<Text preset="t7">{"proof.eduhund.com/" + certId}</Text>
						<Button
							size="xs"
							view="ghost"
							iconLeft={IconCopy}
							onlyIcon
							label={setString(lang, "diplomaLinkButton")}
						/>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="certSettings">
			<DiplomaLang />
			<DiplomaStyle />
			<div className="certSettingsItem">
				<Button
					iconLeft={IconDownload}
					label={setString(lang, "diplomaSaveButton") + " PDF"}
					disabled={isLoading}
					onClick={async () =>
						await generatePDF({ moduleId, withSkills, certId, fileId })
					}
				/>
				{withSkills && (
					<Text preset="t7">{setString(lang, "diplomaSaveButtonHint")}</Text>
				)}
			</div>
			{/* DiplomaSecurity */}
		</div>
	);
}

export { Settings };
