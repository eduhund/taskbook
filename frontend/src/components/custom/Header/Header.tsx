import "./Header.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Text } from "../../Сomponents";
import { IconCrown, IconSendMessage, IconQuestion } from "../../Icons";
import { HeaderNav } from "../HeaderNav/HeaderNav";
import { MainMenu } from "../MainMenu/MainMenu";
import { setString } from "./../../../services/multilang/langselector";

type headerProps = {
	type: string;
	withNav?: boolean;
	deadline?: any;
	module?: any;
	lesson?: any;
	task?: any;
	lessonNumber?: Number;
	taskType?: any;
	taskName?: any;
	moduleShortName?: string;
	nearbyTasks?: any;
	totalTasks?: Number;
	taskStatus?: boolean;
	taskScore?: Number;
	taskMaxScore?: Number;
	inProcess?: boolean;
	lang?: string;
};

const userLang = localStorage.getItem("lang") || undefined;

function UserHelp({ isOpen, hidePopup }: any) {
	function changeVisible() {
		hidePopup(!isOpen);
	}

	return (
		<div className={isOpen ? "modal" : "modal hidden"}>
			<div className="blocker" onClick={changeVisible}></div>
			<Card type="main" className="userHelp">
				<ul className="helpLinks">
					<li className="helpLinksItem">
						<a href="/counselor">
							<Text className="helpLinksText" as="p" size="m">
								{setString(userLang, "helpButtonInfo")}
							</Text>
							<IconCrown size="s" />
						</a>
					</li>
					<li className="helpLinksItem">
						<a
							href={`https://t.me/${process.env.REACT_APP_BOT}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Text className="helpLinksText" as="p" size="m">
								{setString(userLang, "helpButtonTelegram")}
							</Text>
							<IconSendMessage size="s" />
						</a>
					</li>
				</ul>
			</Card>
		</div>
	);
}

function Header({
	type,
	withNav,
	lessonNumber,
	taskType,
	taskName,
	moduleShortName,
	nearbyTasks,
	totalTasks,
	taskStatus,
	taskScore,
	taskMaxScore,
	inProcess,
	lang,
}: headerProps) {
	const user = localStorage.getItem("name");
	const name = user !== null ? user : undefined;

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isHelpOpen, setIsHelpOpen] = useState(false);

	const navData: any = {
		moduleShortName,
		lessonNumber,
		taskType,
		taskName,
		nearbyTasks,
		totalTasks,
		taskStatus,
		taskScore,
		taskMaxScore,
		inProcess,
		lang,
	};

	return (
		<>
			<header className="eduHeader">
				<div className="headerContainer">
					<Link className="logoContainer" to="/">
						<img
							src="/favicon_small.png"
							width={24}
							height={24}
							alt="eduHund"
						></img>
						<h1 className="headerLogo">{`eduHund${name && " & " + name}`}</h1>
					</Link>
					{withNav && (
						<HeaderNav
							isOpen={isMenuOpen}
							userLang={userLang}
							type={type}
							navData={navData}
							lang={lang}
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						/>
					)}
					<div className="headerHelp">
						<Button
							label={setString(userLang, "helpButton")}
							view={isHelpOpen ? "ghost" : "clear"}
							iconLeft={IconQuestion}
							onlyIcon
							onClick={() => setIsHelpOpen(!isHelpOpen)}
						/>
					</div>
				</div>
			</header>
			{withNav && (
				<MainMenu lang={lang} isOpen={isMenuOpen} hidePopup={setIsMenuOpen} />
			)}
			<UserHelp isOpen={isHelpOpen} hidePopup={setIsHelpOpen} />
		</>
	);
}

export { Header };
