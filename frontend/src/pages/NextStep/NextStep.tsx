import "./NextStep.css";
import { setString } from "../../services/multilang/langselector";
import { go } from "../../services/helpers/helpers";

const lang = localStorage.getItem("lang") || "ru" || undefined;

function NextStep() {
	document.title = `eduHund | ${setString(lang, "welcomePage")}`;

	if (localStorage.getItem("accessToken")) go("/");

	return (
		<div className="welcomeContainer">
			<div className="welcomeHeader">
				<h1 className="welcomeTitle">
					<span>Добро пожаловать</span>
					<br></br>в дизайн-задачник
				</h1>
			</div>
			<div className="welcomeContent">
				<p className="welcomeDescription">
					{
						"Оплата прошла успешно! Мы выслали на вашу почту (теперь это ваш логин в задачнике) шпаргалку, временный пароль и все нужные ссылки."
					}
				</p>
				<p className="welcomeDescription">
					{
						"Если у вас возникнут любые вопросы, или задачник будет странно себя вести (он может) — пишите нам на почту "
					}
					<a href="mailto:edu@eduhand.com">edu@eduhund.com</a>
					{" или в "}
					<a href="https://t.me/eduhund_bot">Телеграм-бота</a>
				</p>
				<button className="mainButton" onClick={() => go("/login?lang=ru")}>
					<>Войти и решать</>
				</button>
			</div>
			<img
				className="welcomeMascot"
				src="/img/mascot.gif"
				alt="Module mascot"
			/>
		</div>
	);
}

export { NextStep };
