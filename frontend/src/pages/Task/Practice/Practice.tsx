import { useEffect, useState } from "react";
import { Grid, GridItem } from "@consta/uikit/Grid";
import { TaskTitle } from "../TaskTitle/TaskTitle";
import {
	Button,
	Image,
	Question,
	Switch,
	TaskComments,
	Text,
} from "../../../components/Сomponents";
import { Informer } from "@consta/uikit/Informer";
import { IconForward } from "../../../components/Icons";
import { setControls } from "../../../services/api/api";
import { setString } from "../../../services/multilang/langselector";
import { BuildText } from "../../../services/textBuilder/textBuilder";

function Practice(props: any) {
	const [isHint, hintVisible] = useState(
		props?.taskData?.isHintActive || false
	);
	const [isOurVar, ourVarVisible] = useState(
		props?.taskData?.isOurVarActive || false
	);
	const [isAnalys, analysVisible] = useState(
		props?.taskData?.isSolutionActive || false
	);

	function sendControlsState(controlsState: any) {
		const taskId = props?.taskData?.id;
		setControls(taskId, controlsState);
	}

	function hasOurVar() {
		for (const contentItem of props?.taskData?.content || []) {
			for (const question of contentItem?.questions || []) {
				if (question.hasRightAnswer !== false) {
					return true;
				}
			}
		}

		return false;
	}

	function imageContainerWidth(size: string | undefined) {
		switch (size) {
			case "s":
				return "imagesContainerSmall";
			case "m":
				return "imagesContainerMedium";
			default:
				return "imagesContainerLarge";
		}
	}

	const genNextTaskButton = (type: string, nextTaskId: string) => {
		switch (type) {
			case "theory":
				return {
					label: setString(props?.taskData?.lang, "taskStart"),
					link: `/${nextTaskId.substring(0, 3)}/${Number(
						nextTaskId.substring(3, 5)
					)}/${Number(nextTaskId.substring(5, 7))}`,
				};
			case "practice":
				return {
					label: setString(props?.taskData?.lang, "taskNext"),
					link: `/${nextTaskId.substring(0, 3)}/${Number(
						nextTaskId.substring(3, 5)
					)}/${Number(nextTaskId.substring(5, 7))}`,
				};
			default:
				return {
					label: setString(props?.taskData?.lang, "taskFinalButton"),
					link: `/${props?.taskData?.module}/${props?.taskData?.lesson}/final`,
				};
		}
	};

	const nextTaskButton = genNextTaskButton(
		props?.taskData?.nextTask?.type,
		props?.taskData?.nextTask?.id
	);

	const taskImages: any = [];

	const content = props.taskData.content.map((item: any, i: number) => {
		taskImages.push(...(item.img || []));
		const images = taskImages.map((image: any) => (
			<Image
				key={image.id}
				url={image.url}
				caption={image.caption}
				preview={image.clickable === false ? false : true}
			/>
		));
		const Questions = (item.questions || []).map((question: any) =>
			question.isVisible !== false ? (
				<>
					<Question
						key={question?.id}
						lang={props?.taskData?.lang}
						question={question}
						taskStatus={props.taskStatus}
						ourVar={isOurVar}
						updateState={props.onChange}
					/>
				</>
			) : (
				<></>
			)
		);

		return (
			<div className="columnContent">
				{BuildText(item.intro)}
				<div className="taskImages oneCol">{images}</div>
				{Questions}
			</div>
		);
	});

	function nextTask() {
		document.location.href = nextTaskButton.link;
	}

	useEffect(() => {
		var l1 = document.querySelector<HTMLElement>("#taskContent");
		var l2 = document.querySelector<HTMLElement>("#taskImages");
		if (l1 !== null && l2 !== null) {
			l2.style.maxHeight = l1.offsetHeight + "px";
		}
	});

	return (
		<Grid
			className="taskGrid"
			yAlign="top"
			breakpoints={{
				xs: {
					cols: 1,
				},
				l: {
					cols: taskImages.length > 0 ? 2 : 1,
				},
			}}
		>
			{taskImages.length > 0 && (
				<GridItem
					id="taskImages"
					className={`columnContent taskImages twoCol ${imageContainerWidth(
						props?.taskData?.template
					)}`}
				>
					{taskImages.map((image: any) => (
						<Image
							key={image.id}
							url={image.url}
							caption={image.caption}
							preview={image.clickable === false ? false : true}
						/>
					))}
				</GridItem>
			)}
			<GridItem id="taskContent" className="taskContent">
				<div className="columnContent">
					<TaskTitle data={props.taskData} />
				</div>
				{content}
				<div className="columnContent">
					<div className={isHint ? "hint" : "hint hint_disabled"}>
						<Informer
							label={props.taskData.hint}
							view="filled"
							status="success"
							size="s"
						/>
					</div>
					<div className="summaryContainer">
						<div className="helpContainer">
							{props.taskData?.hint?.length > 0 && (
								<div className="hintSwitch">
									<Switch
										label={setString(props?.taskData?.lang, "taskHint")}
										initChecked={isHint}
										onChange={() => {
											sendControlsState({
												isHintActive: !isHint,
												isOurVarActive: isOurVar,
												isSolutionActive: isAnalys,
											});
											hintVisible(!isHint);
										}}
									/>
								</div>
							)}
							{hasOurVar() && (
								<div className="ourVarSwitch">
									<Switch
										label={setString(props?.taskData?.lang, "taskOurVariant")}
										initChecked={isOurVar}
										onChange={() => {
											sendControlsState({
												isHintActive: isHint,
												isOurVarActive: !isOurVar,
												isSolutionActive: isAnalys,
											});
											ourVarVisible(!isOurVar);
										}}
									/>
								</div>
							)}
							{props?.taskData?.solution?.length > 0 && (
								<div
									className={
										props?.taskStatus ? "analysSwitch" : "analysSwitch hidden"
									}
								>
									<Switch
										label={setString(props?.taskData?.lang, "taskAnalys")}
										initChecked={isAnalys}
										onChange={() => {
											sendControlsState({
												isHintActive: isHint,
												isOurVarActive: isOurVar,
												isSolutionActive: !isAnalys,
											});
											analysVisible(!isAnalys);
										}}
									/>
								</div>
							)}
						</div>
						<div className={props.taskStatus ? "result" : "result hidden"}>
							<Text
								as="p"
								align="right"
								weight="bold"
								size="2xl"
								lineHeight="xs"
								view="brand"
							>
								{setString(props?.taskData?.lang, "taskScore", {
									score: props.taskScore.score,
									maxScore: props.taskScore.maxScore,
								})}
							</Text>
						</div>
					</div>
					<div
						className={
							isAnalys && props.taskStatus
								? "analysContainer"
								: "analysContainer hidden"
						}
					>
						<div className="analys">{BuildText(props.taskData?.solution)}</div>
					</div>
					<div className="checkContainer">
						<div className="checkButton">
							<Button
								label={
									props.taskStatus
										? setString(props?.taskData?.lang, "taskOneMoreTime")
										: setString(props?.taskData?.lang, "taskCheck")
								}
								view={props.taskStatus ? "secondary" : "primary"}
								onClick={async () => {
									return await props.checkTask("checkTask", props.taskStatus);
								}}
							/>
							<Text
								preset="t7"
								as="span"
								className={props.taskStatus ? "checkHint hidden" : "checkHint"}
								view="secondary"
							>
								{setString(props?.taskData?.lang, "taskCheckHint")}
							</Text>
						</div>
						<Button
							className={props.taskStatus ? "nextButton" : "nextButton hidden"}
							iconRight={IconForward}
							label={nextTaskButton.label}
							onClick={nextTask}
						/>
					</div>
				</div>
				<TaskComments
					taskId={props.taskData.id}
					taskStatus={props?.taskStatus}
					commentsList={props.taskData.comments}
					protest={props.taskData.protest}
					lang={props?.taskData?.lang}
					onSubmit={props.checkTask}
				/>
			</GridItem>
		</Grid>
	);
}

export { Practice };
