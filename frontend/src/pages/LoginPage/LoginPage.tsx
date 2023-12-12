import { useState, FormEvent } from "react";
import { Text, TextField, Button, Card } from "../../components/Сomponents";
import { auth } from "../../services/api/api";
import { go } from "../../services/helpers/helpers";
import { setString } from "../../services/multilang/langselector";

type userToken = {
	accessToken: string;
	expiresIn: number;
	refreshToken: string;
};

type userObject = {
	id: string;
	email: string;
	firstName: string;
	lastName?: string;
	lang: string;
	token: userToken;
};

function onLogin({ id, email, firstName, lastName, lang, token }: userObject) {
	localStorage.setItem("userId", id);
	localStorage.setItem("email", email);
	localStorage.setItem("name", firstName + " " + lastName);
	localStorage.setItem("lang", lang);
	localStorage.setItem("accessToken", token.accessToken);
}

function LoginPage({ addInformer }: any) {
	const [isLoading, setLoading] = useState<boolean>(false);

	const params = new URLSearchParams(document.location.search);
	const userLang = params.get("lang");

	const email = localStorage.getItem("email");
	const lang = userLang || localStorage.getItem("lang") || undefined;

	async function getAuth(event: any) {
		event.preventDefault();
		setLoading(true);
		const request = {
			email: event.target[0].value,
			pass: event.target[1].value,
			lang: userLang || undefined,
		};
		const response = await auth(request);
		if (response?.OK) {
			onLogin(response?.data);
		} else {
			addInformer(
				"warning",
				"Возможно, вы ошиблись в почте или пароле. Если нет — напишите нам, мы поможем разобраться"
			);
		}
		setLoading(false);
	}

	if (localStorage.getItem("accessToken")) go("/");

	return (
		<div className="mainContainer">
			<div className="contentContainer">
				<div className="contentBlock">
					<Card className="login">
						<form
							className="loginForm"
							onSubmit={(e: FormEvent<HTMLFormElement>) => getAuth(e)}
						>
							<Text
								view="brand"
								as="h2"
								size="3xl"
								weight="bold"
								className="loginFormHeader"
							>
								{setString(lang, "loginHeader")}
							</Text>
							<div className="inputContainer">
								<TextField
									id={"login_field"}
									type="email"
									width="full"
									placeholder="mail@example.com"
									autoComplete="username"
									initValue={email}
									label={setString(lang, "loginEmailLabel")}
								/>
							</div>
							<div className="inputContainer">
								<TextField
									id={"password_field"}
									type="password"
									width="full"
									placeholder="password"
									autoComplete="current-password"
									label={setString(lang, "loginPasswordLabel")}
								/>
							</div>
							<div className="submitContainer inputContainer">
								<Button
									type="submit"
									label={setString(lang, "loginButton")}
									width="full"
									loading={isLoading}
								/>
							</div>
							<Text as="span" view="secondary">
								{setString(lang, "loginHint1")}
								<Text
									as="a"
									view="link"
									decoration="underline"
									href={`mailto:${process.env.REACT_APP_EMAIL}`}
								>
									{process.env.REACT_APP_EMAIL}
								</Text>
								{setString(lang, "loginHint2")}
								<Text
									as="a"
									view="link"
									decoration="underline"
									href={`https://t.me/${process.env.REACT_APP_BOT}`}
								>
									{setString(lang, "botName")}
								</Text>
							</Text>
						</form>
					</Card>
				</div>
			</div>
		</div>
	);
}

export { LoginPage };
