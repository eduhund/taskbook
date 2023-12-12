import { Button, Calendar, Card, Text } from "../../Сomponents";
import {
	IconBook,
	IconCrown,
	IconDinosaur,
	IconForward,
	IconFlagFilled,
	IconLightningBolt,
	IconPlay,
	IconRestart,
	IconWatch,
} from "../../Icons";
import { setString } from "../../../services/multilang/langselector";
import en from "date-fns/locale/en-US";
import ru from "date-fns/locale/ru";

type localeType = {
	[key: string]: Locale;
};

type iconsType = "speed" | "dinosaur" | "book" | "watch" | "restart";

type featuresType = {
	icon: iconsType;
	label: string;
};

type IconGeneratorProps = {
	icon: iconsType;
};

type FeatureGeneratorProps = {
	features: featuresType[];
};

type viewsType = {
	[key: string]: "ghost" | "primary" | "secondary" | "clear" | undefined;
};

type lessonType = {
	id: string;
	name: string;
	status: string;
};

type LessonListProps = {
	moduleId: string;
	lessons: lessonType[];
};

const locale: localeType = {
	ru,
	en,
};

const localeString: any = {
	ru: "ru-RU",
	en: "en-US",
};

const buyLink = "https://pay.eduhund.com/new";
const prolongationLink = "https://pay.eduhund.com/renewal";

const lang = localStorage.getItem("lang") || undefined;
const email = localStorage.getItem("email");

function IconGenerator({ icon }: IconGeneratorProps) {
	switch (icon) {
		case "speed":
			return <IconLightningBolt size="s" />;
		case "dinosaur":
			return <IconDinosaur size="s" />;
		case "book":
			return <IconBook size="s" />;
		case "watch":
			return <IconWatch size="s" />;
		case "restart":
			return <IconRestart size="s" />;
		default:
			return <></>;
	}
}

function FeaturesGenerator({ features }: FeatureGeneratorProps) {
	const FeatureList = features.map(
		({ icon, label }: featuresType, i: number) => {
			return (
				<li key={`feature${i}`} className="featuresItem">
					<IconGenerator icon={icon} />
					<Text preset="t6">{label}</Text>
				</li>
			);
		}
	);
	return <ul className="cardFeautires">{FeatureList}</ul>;
}

function LessonsList({ moduleId, lessons }: LessonListProps) {
	const VIEWS: viewsType = {
		past: "ghost",
		current: "primary",
		future: "clear",
	};

	const buttons = (lessons || []).map(
		({ id, name, status }: lessonType, i: number) => {
			return (
				<Button
					label={i + 1}
					form="brick"
					size="s"
					view={VIEWS[status]}
					onClick={() => (document.location.href = `/${moduleId}/${id}`)}
				/>
			);
		}
	);
	return <div className="infoLessonsButtons">{buttons}</div>;
}

function OtherModuleCard({ type, status, data }: any) {
	function CardBadge() {
		switch (status) {
			case "active":
				return setString(lang, "moduleCardStatusActive");
			case "deadline":
				return setString(lang, "moduleCardStatusDeadline");
			case "past":
				return setString(lang, "moduleCardStatusPast", {
					deadline: data.deadline,
				});
			default:
				return <></>;
		}
	}

	function CardState() {
		const deadline = new Date(data?.deadline || "2023-12-31");
		switch (status) {
			case "active":
				return (
					<div className="cardState cardStateActive">
						<span className="cardStatePercent">{`${
							Math.round((data?.doneTasks / data?.totalTasks) * 100) || 0
						}%`}</span>
						<Text preset="t3" as="span" view="ghost">
							{setString(lang, "moduleCardProgressActive")}
						</Text>
					</div>
				);

			case "deadline":
				return (
					<div className="cardState">
						<Text preset="t3" as="span" view="secondary">
							{setString(lang, "moduleCardProgressDeadline1")}
						</Text>
						<Text preset="t2" as="span" view="success" lineHeight="l">
							{setString(lang, "moduleCardProgressDeadline2", {
								days: (
									(Number(deadline) - Number(Date.now())) /
									(1000 * 3600 * 24)
								).toFixed(),
							})}
						</Text>
					</div>
				);
			case "past":
				return (
					<div>
						<Text preset="t4" as="h3">
							{setString(lang, "moduleCardPastProgress", {
								progress:
									Math.round((data?.doneTasks / data?.totalTasks) * 100) || 0,
							})}
						</Text>
						<div className="cardState cardStatePast">
							<Text
								preset="t6"
								as="a"
								view="link"
								weight="bold"
								href={`/${data?.code}/diploma`}
							>
								<IconCrown size="s" />
								{setString(lang, "moduleCardDiploma")}
							</Text>
							<Text
								preset="t6"
								as="a"
								view="link"
								weight="bold"
								href={`/${data?.code}/final`}
							>
								<IconFlagFilled size="s" />
								{setString(lang, "moduleCardFinal")}
							</Text>
						</div>
					</div>
				);

			default:
				return <></>;
		}
	}

	function CardActions() {
		switch (status) {
			case "available":
				return (
					<div className="infoBuy">
						<div className={`infoBuyButtons ${type}`}>
							<Text preset="t7" as="span" view="secondary">
								{setString(lang, "moduleCardBuy")}
							</Text>
							<Text
								preset="t2"
								as="h3"
								view="brand"
							>{`${data?.price?.value} ₽`}</Text>
							<Button
								view="primary"
								label={setString(lang, "moduleCardBuyButton")}
								onClick={() =>
									window.open(buyLink + "?module=" + data?.code.toLowerCase())
								}
							/>
						</div>
					</div>
				);
			case "active":
				return (
					<div className="infoBuy">
						<Text preset="t6" as="span">
							{setString(lang, "moduleCardGift")}
						</Text>
						<div className={`infoBuyButtons ${type}`}>
							<Text
								preset="t2"
								as="span"
								view="brand"
							>{`${data?.price?.value} ₽`}</Text>
							<Button
								view="secondary"
								label={setString(lang, "moduleCardBuyGiftButton")}
								onClick={() =>
									window.open(buyLink + "?module=" + data?.code.toLowerCase())
								}
							/>
						</div>
					</div>
				);
			case "deadline":
				return (
					<div className="infoBuy">
						<Text preset="t6" as="span">
							{setString(lang, "moduleCardDeadlineHint")}
						</Text>
						<div className="infoBuyButtons">
							<Text
								preset="t2"
								as="h3"
								view="brand"
							>{`${data?.prolongation?.value} ₽`}</Text>
							<Button
								view="secondary"
								label={setString(lang, "moduleCardProlongationButton")}
								onClick={() =>
									window.open(
										prolongationLink +
											"?module=" +
											data?.code.toLowerCase() +
											"&email=" +
											email
									)
								}
							/>
						</div>
					</div>
				);
			case "past":
				return (
					<div className="infoBuy">
						<div className={`infoBuyButtons ${type}`}>
							<Text
								preset="t2"
								as="span"
								view="brand"
							>{`${data?.prolongation?.value} ₽`}</Text>
							<Button
								view="secondary"
								label={setString(lang, "moduleCardPastBuyButton")}
								onClick={() =>
									window.open(
										prolongationLink +
											"?module=" +
											data?.code.toLowerCase() +
											"&email=" +
											email
									)
								}
							/>
							<Button
								view="secondary"
								label={setString(lang, "moduleCardPastGiftButton")}
								onClick={() =>
									window.open(buyLink + "?module=" + data?.code.toLowerCase())
								}
							/>
						</div>
					</div>
				);
			default:
				return <></>;
		}
	}

	return (
		<Card
			className={`moduleCard ${type}`}
			style={{ backgroundImage: `url(${data?.mascot?.medium})` }}
		>
			<div className="cardMainInfo">
				{status !== "available" && <Text>{CardBadge()}</Text>}
				<Text preset="t2" as="h2" className="cardTitle">
					{data?.name}
				</Text>
				{status === "available" && (
					<FeaturesGenerator features={data?.features} />
				)}
				{status === "available" && (
					<Text preset="t6" as="p" className="moduleDescription">
						{data?.description}
					</Text>
				)}
				<Text
					preset="t7"
					as="a"
					view="link"
					href={`${data?.moduleLink}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{setString(lang, "moduleCardProgram")}
				</Text>
				{status === "paid" && (
					<Text preset="t6" as="p" view="secondary">
						{setString(lang, "moduleCardPaidDescription")}{" "}
						<Text
							as="a"
							view="secondary"
							href="https://t.me/eduhund_bot"
							target="_blank"
							rel="noopener noreferrer"
						>
							{setString(lang, "botName")}
						</Text>{" "}
						{setString(lang, "dashboardHint2")}{" "}
						<Text
							as="a"
							view="secondary"
							href="mailto:edu@eduhund.ru"
							target="_blank"
							rel="noopener noreferrer"
						>
							edu@eduhund.ru
						</Text>
						.
					</Text>
				)}
				<CardState />
			</div>
			<CardActions />
		</Card>
	);
}

function ActiveModuleCard({
	status,
	data: {
		nextTask,
		moduleId,
		startDate,
		deadline,
		doneTasks,
		totalTasks,
		mascot,
		prolongation,
		name,
		code,
		lessons,
	},
}: any) {
	const nextTaskId = nextTask ? nextTask.id : moduleId;
	const nextTaskHref =
		nextTaskId?.length > 3
			? `/${nextTaskId.substring(0, 3)}/${Number(
					nextTaskId.substring(3, 5)
			  )}/${Number(nextTaskId.substring(5, 7))}`
			: `${moduleId}`;
	const nextTaskName = nextTask
		? `${setString(lang, "navMenuLesson")} ${nextTask?.lesson} • ${
				nextTask?.type === "theory"
					? setString(lang, "navMenuTheory")
					: setString(lang, "navMenuPractice") + " " + nextTask?.name
		  }`
		: setString(lang, "moduleCardGoButton");

	const start = new Date(startDate);
	const deadlineDate = new Date(deadline);

	const UIdeadline = deadlineDate.toLocaleDateString(
		localeString[lang || "ru"],
		{
			day: "numeric",
			month: "long",
		}
	);
	const UIcountdown = (
		(Number(deadlineDate) - Number(Date.now())) /
		(1000 * 3600 * 24)
	).toFixed();

	const progress = setString(lang, "moduleCardDoneTasks", {
		doneTasks,
		total: totalTasks,
	});

	return (
		<Card
			className={`moduleCard large`}
			style={{ backgroundImage: `url(${mascot?.medium})` }}
		>
			{status === "deadline" && (
				<div className="deadlineInformer">
					<span>
						{setString(lang, "moduleCardDeadlineInformer", {
							deadline: UIdeadline,
						})}
					</span>
					<span>
						{setString(lang, "moduleCardDeadlinePrice", {
							price: prolongation?.value || 0,
						})}
					</span>
					<Button
						size="s"
						label="Продлить"
						onClick={() =>
							window.open(
								prolongationLink +
									"?module=" +
									code.toLowerCase() +
									"&email=" +
									email
							)
						}
						view="primary"
					/>
				</div>
			)}
			<div className="moduleCardInfo">
				<div className="cardInfoCalendar">
					<Calendar
						locale={locale[lang || "ru"]}
						type="date"
						currentVisibleDate={new Date(Date.now())}
						initValue={[start, deadlineDate]}
						minDate={start}
						maxDate={deadlineDate}
					/>
				</div>
				<div className="cardMainInfo">
					<div className="infoBlock">
						<div className="activeCardHeading">
							<div className="cardHeadingLine">
								<Text preset="t2" as="h2" className="cardTitle">
									{name}
								</Text>
							</div>
							<div className="cardHeadingLine">
								<Text preset="t7" as="span" view="secondary">
									{setString(lang, "moduleCardDeadline", {
										deadline: UIdeadline,
									}) + ". "}
								</Text>
								<Text preset="t7" as="span" view="secondary">
									{setString(lang, "moduleCardCountdown", {
										days: UIcountdown,
									})}
								</Text>
							</div>
						</div>
						<div className="MainInfoLinks">
							<Text
								preset="t6"
								as="a"
								view="link"
								weight="bold"
								href={`/${code}`}
							>
								<IconPlay size="s" />
								{setString(lang, "moduleCardIntro")}
							</Text>
							<Text
								preset="t6"
								as="a"
								view="link"
								weight="bold"
								href={`/${code}/diploma`}
							>
								<IconCrown size="s" />
								{setString(lang, "moduleCardDiploma")}
							</Text>
							<Text
								preset="t6"
								as="a"
								view="link"
								weight="bold"
								href={`/${code}/final`}
							>
								<IconFlagFilled size="s" />
								{setString(lang, "moduleCardFinal")}
							</Text>
						</div>
					</div>
					<div className="infoBlock">
						<div className="MainInfoLessons">
							<div className="infoLessonsTitle">
								<Text preset="t4" as="h3" view="secondary">
									{setString(lang, "moduleCardLessons")}
								</Text>
							</div>
							<LessonsList lessons={lessons} moduleId={moduleId} />
						</div>
						<div className="MainInfoButton">
							<Button
								size="s"
								label={nextTaskName}
								iconRight={IconForward}
								onClick={() => (document.location.href = nextTaskHref)}
								view="primary"
							/>
							<Text preset="t7" as="span" view="secondary">
								{progress}
							</Text>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}

function ModuleCard({ type, status, data }: any) {
	if (type === "main") {
		return <ActiveModuleCard status={status} data={data} />;
	} else {
		return <OtherModuleCard type={type} status={status} data={data} />;
	}
}

export { ModuleCard };
