import "./Task.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Header, SpinLoader } from "../../components/Сomponents";
import { Theory } from "./Theory/Theory";
import { Practice } from "./Practice/Practice";
import { checkTask, getTask, setState } from "../../services/api/api";

function Task() {
	const params = useParams();
	const [taskData, setTaskData] = useState<any>(null);
	const [taskInProcess, setTaskInProcess] = useState<boolean>(false);
	const [taskStatus, setTaskStatus] = useState<boolean>(false);
	const [taskProtest, setTaskProtest] = useState<boolean>(false);
	const [taskScore, setTaskScore] = useState<any>(null);
	const [nearbyTasks, setNearbyTask] = useState<any>({});
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const taskId = `${params.module?.toUpperCase()}${params.lesson
		?.toString()
		.padStart(2, "0")}${params.task?.toString().padStart(2, "0")}`;

	const moduleInfo = {
		label: taskData?.moduleShortName,
		id: params.module?.toUpperCase(),
	};

	const lessonInfo = {
		label: `Урок ${taskData?.lesson}`,
		id: params.lesson?.toString().padStart(2, "0"),
	};

	const taskInfo = {
		label:
			taskData?.type === "practice" ? `Задача ${taskData?.name}` : "Теория",
		id: params.task?.toString().padStart(2, "0"),
	};

	function setTaskState(questionId: string, state: Object) {
		setTaskInProcess(true);
		if (taskStatus) {
			changeTaskStatus("checkTask", taskStatus, taskProtest);
		}
		setState(questionId, state).then((data) => {
			let newData: any = {};
			Object.assign(newData, taskData);
			for (const content of newData?.content || []) {
				for (const question of content.questions || []) {
					const questionId = question.id;
					question.isVisible = data?.data?.[questionId]?.isVisible;
					if (question.type === "text" || question.type === "link") {
						question.answer = data?.data?.[questionId]?.state || "";
					} else {
						for (const variant of question.variants) {
							variant.isSelected =
								(data?.data?.[questionId]?.state || []).find(
									(item: any) => item?.id === variant.id
								)?.isSelected || false;
						}
					}
				}
			}
			setTaskData(newData);
		});
	}

	async function changeTaskStatus(
		type = "checkTask",
		status: boolean,
		protest: boolean = taskProtest
	) {
		let newStatus: boolean;
		if (type === "protest" && protest) {
			newStatus = true;
		} else if (type === "protest" && !protest) {
			newStatus = taskStatus;
		} else {
			newStatus = !taskStatus;
		}
		const response = await checkTask(taskId, newStatus, protest);
		const newScore = response.data?.score;
		setTaskStatus(newStatus);
		setTaskProtest(protest);
		if (newStatus) {
			setTaskScore({ ...taskScore, score: newScore });
		}
		return true;
	}

	useEffect(() => {
		async function fetchData() {
			setIsLoading(true);
			const { OK, data, error } = await getTask(taskId);
			if (OK) {
				setTaskData(data);
				setTaskStatus(data?.isChecked || false);
				setTaskInProcess(data?.inProcess || false);
				setTaskProtest(data?.protest || false);
				setTaskScore({
					score: data?.score ?? null,
					maxScore: data?.maxScore ?? 0,
				});
				setNearbyTask({
					prev: data.prevTask,
					next: data.nextTask,
				});
			}
			setIsLoading(false);
		}
		fetchData();
	}, [taskId]);

	let content;

	if (taskData) {
		if (taskData.type === "theory") {
			content = <Theory data={taskData} params={params} />;
		} else if (taskData.type === "practice") {
			content = (
				<Practice
					taskData={taskData}
					taskScore={taskScore}
					taskStatus={taskStatus}
					protest={taskProtest}
					nearbyTasks={nearbyTasks}
					checkTask={changeTaskStatus}
					onChange={setTaskState}
				/>
			);
		}
	} else {
		content = <SpinLoader />;
	}

	return (
		<>
			<Header
				type={taskData?.type}
				withNav={taskData ? true : false}
				module={moduleInfo}
				lesson={lessonInfo}
				task={taskInfo}
				moduleShortName={taskData?.moduleShortName}
				lessonNumber={taskData?.lesson}
				deadline={taskData?.deadline}
				taskType={taskData?.type}
				taskName={taskData?.name}
				nearbyTasks={nearbyTasks}
				totalTasks={taskData?.totalTasks}
				taskScore={taskScore?.score}
				taskMaxScore={taskData?.maxScore}
				taskStatus={taskStatus}
				inProcess={taskInProcess}
				lang={taskData?.lang}
			/>
			<div className="mainContainer">
			{isLoading ? <SpinLoader /> :
					taskData ? 
				<div className="mainContent">
					<div className="contentBlock">
						<Card
							className={
								taskData?.type === "practice" ? "twoColumns" : "oneColumn"
							}
						>
							{content}
						</Card>
					</div>
				</div> : <></>}
			</div>
		</>
	);
}

export { Task };
