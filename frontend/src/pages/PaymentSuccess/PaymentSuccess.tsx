import "./PaymentSuccess.css";
import { useState, useEffect } from "react";
import { checkPayment } from "../../services/api/api";
import { setString } from "../../services/multilang/langselector";
import { IconForward, IconProcessing } from "../../components/Icons";
import { go } from "../../services/helpers/helpers";

const lang = localStorage.getItem("lang") || "en" || undefined;
const params = new URLSearchParams(document.location.search);
const paymentId = params.get("sale_id") || undefined;

function PaymentSuccess({ addInformer }: any) {
	const [loading, setLoading] = useState<boolean>(false);
	const [reminder, setReminder] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);

	if (localStorage.getItem("accessToken")) go("/");

	const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

	function auth(data: any) {
		const { id, email, firstName, lastName, lang, token } = data;
		localStorage.setItem("userId", id);
		localStorage.setItem("email", email);
		localStorage.setItem("name", firstName + " " + lastName);
		localStorage.setItem("lang", lang);
		localStorage.setItem("accessToken", token.accessToken);
	}

	useEffect(() => {
		async function fetchData(ms: number) {
			try {
				await delay(ms);
				const response = await checkPayment({ paymentId });
				if (!response || response?.OK === false) {
					return false;
				} else {
					auth(response?.data);
					setError(false);
					setLoading(false);
					setReminder(false);
					return true;
				}
			} catch {
				return false;
			}
		}
		async function repeater() {
			setLoading(true);
			setError(false);
			let i = 0;
			while (i < 20) {
				if (await fetchData(3000)) {
					return;
				}
				if (i === 3) {
					setReminder(true);
				}
				i++;
			}
			setError(true);
			setLoading(false);
			setReminder(false);
		}
		repeater();
	}, []);

	document.title = `eduHund | ${setString(lang, "welcomePage")}`;

	return (
		<div className="welcomeContainer">
			<div className="welcomeHeader">
				<img src="/img/gumroad_logo.png" alt="Gumroad logo" width="124" />
				<h1 className="welcomeTitle">
					<span>Welcome to</span>
					<br></br>Self-Learning Taskbook<br></br>for Team Leaders and Novice
					Managers
				</h1>
				<p className="welcomeMessage">Glad to see you here 😜</p>
			</div>
			<div className="welcomeContent">
				<ul className="welcomeFeaturesList">
					<li className="welcomeFeaturesItem">
						<img src="/img/feature_1.png" alt="Feature 1" height="112" />
						<div>
							<span className="feature">123</span>
							<p>
								tasks in <br></br>9 lessons
							</p>
						</div>
					</li>
					<li className="welcomeFeaturesItem">
						<img src="/img/feature_2.png" alt="Feature 2" height="112" />
						<div>
							<span className="feature">2</span>
							<p>
								months to solve<br></br>all puzzles
							</p>
						</div>
					</li>
					<li className="welcomeFeaturesItem">
						<img src="/img/feature_3.png" alt="Feature 3" height="112" />
						<div>
							<span className="feature">24x7</span>
							<p>
								support via <br></br>
								<a href="mailto:edu@eduhand.com">edu@eduhund.com</a>
							</p>
						</div>
					</li>
				</ul>
				{error ? (
					<p className="welcomeError">
						Oops.. Something went wrong 😔<br></br>Please, try to refresh this
						page in couple of minutes or use the login link and the password we
						sended to your email.
						<br></br> If nothing helps, contact us at{" "}
						<a href="mailto:edu@eduhand.com">edu@eduhund.com</a> or our{" "}
						<a href="https://t.me/eduhund_bot">Telegram-assistant</a>
					</p>
				) : (
					<>
						<button
							className="mainButton"
							disabled={loading}
							onClick={() => go("/")}
						>
							{loading ? (
								<>
									Checking payment...
									<IconProcessing size="m" />
								</>
							) : (
								<>
									Let the magic begin
									<IconForward size="m" />
								</>
							)}
						</button>
						{reminder && (
							<p className="welcomeReminder">
								It can take some time. Gumroad shares your payment information
								with us.
							</p>
						)}
					</>
				)}
			</div>
			<img
				className="welcomeMascot"
				src="/img/mascot.gif"
				alt="Module mascot"
			/>
		</div>
	);
}

export { PaymentSuccess };
