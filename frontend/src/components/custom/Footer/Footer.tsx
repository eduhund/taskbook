import "./Footer.css";
import { Text } from "../../Сomponents";
import { setString } from "../../../services/multilang/langselector";

const params = new URLSearchParams(document.location.search);
const userLang = params.get("lang");

const lang =
	userLang ||
	localStorage.getItem("lang") ||
	process.env.REACT_APP_DEFAULT_LANG;
const link = process.env.REACT_APP_LINK;

function Footer() {
	return (
		<footer className="eduFooter">
			<div className="footerContainer">
				<Text as="span">
					{setString(lang, "footerCopyright")}{" "}
					<Text as="a" href={link}>
						eduHund
					</Text>
					{lang === "ru" && (
						<>
							{" "}
							& «
							<Text as="a" href="https://sobakapav.ru">
								{setString(lang, "sobakaName")}
							</Text>
							»
						</>
					)}
				</Text>
				<Text as="span">
					{lang === "ru" ? (
						<Text as="a" href="https://www.eduhund.ru/license">
							{setString(lang, "footerCredentials")}
						</Text>
					) : (
						<Text as="a" href={"mailto:" + process.env.REACT_APP_EMAIL}>
							{process.env.REACT_APP_EMAIL}
						</Text>
					)}
				</Text>
			</div>
		</footer>
	);
}

export { Footer };
