import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Text, TextField, Button, Card } from "../../components/Сomponents";
import { createPassword } from "../../services/api/api";
import { setString } from "../../services/multilang/langselector";
import { go } from "../../services/helpers/helpers";

type userToken = {
	accessToken: string;
	expiresIn: number;
	refreshToken: string;
};

type userObject = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	lang: string;
	token: userToken;
};

function CreatePassword({ addInformer }: any) {
	const [isLoading, setLoading] = useState<boolean>(false);

	function useQuery() {
		const { search } = useLocation();
		return useMemo(() => new URLSearchParams(search), [search]);
	}

	const query = useQuery();
	const email = query.get("email");
	const key = query.get("key");

	const lang = query.get("lang") || localStorage.getItem("lang") || undefined;

	function onLogin(data: userObject) {
		localStorage.setItem("userId", data.id);
		localStorage.setItem("email", data.email);
		localStorage.setItem("name", data.firstName + " " + data.lastName);
		localStorage.setItem("lang", data.lang);
		localStorage.setItem("accessToken", data.token.accessToken);
		go("/");
	}

	async function onSubmit(e: any) {
		e.preventDefault();
		const pass: string = e?.target[0]?.value || "";
		if (!pass) {
			addInformer("warning", "Введите пароль, пожалуйста");
		} else {
			setLoading(true);
			const request = {
				email,
				pass,
				key,
				lang: query.get("lang") || undefined,
			};
			const response = await createPassword(request);
			if (!response?.OK) {
				addInformer(
					"warning",
					"Ссылка больше не актуальна. Напишите нам — и мы пришлем новую."
				);
			} else {
				onLogin(response?.data);
			}
		}
		setLoading(false);
	}

	document.title = `eduHund | ${setString(lang, "createPasswordTitle")}`;

	return (
		<div className="mainContainer">
			<div className="contentContainer">
				<div className="contentBlock">
					<Card className="login">
						<form className="loginForm" onSubmit={onSubmit}>
							<Text
								view="brand"
								as="h2"
								size="3xl"
								weight="bold"
								className="loginFormHeader"
							>
								{setString(lang, "createPasswordTitle")}
							</Text>
							<div className="inputContainer">
								<TextField
									id={"password_field"}
									value={null}
									width="full"
									label={setString(lang, "createPasswordLabel")}
									type="password"
									autoComplete="new-password"
									placeholder={setString(lang, "createPasswordPlaceholder")}
								/>
							</div>
							<div className="submitContainer inputContainer">
								<Button
									label={setString(lang, "createPasswordButton")}
									width="full"
									loading={isLoading}
								/>
							</div>
							<a className="loginFormForget" href="/login">
								<Text as="span" view="link" decoration="underline">
									{setString(lang, "createPasswordBack")}
								</Text>
							</a>
						</form>
					</Card>
				</div>
			</div>
		</div>
	);
}

export { CreatePassword };
