import { Button } from "../../../components/Сomponents";
import { BuildText } from "../../../services/textBuilder/textBuilder";
import { TaskTitle } from "../TaskTitle/TaskTitle";
import { IconForward } from "@consta/uikit/IconForward";
import { setString } from "../../../services/multilang/langselector";

function Theory({ data }: any) {
	const title = data.title || data.name;
	const description = data?.description;

	const titleData = {
		title,
		description,
	};

	const genNextTaskButton = (type: string, nextTaskId: string) => {
		switch (type) {
			case "theory":
				return {
					label: setString(data?.lang, "theoryContinue"),
					link: `/${nextTaskId.substring(0, 3)}/${Number(
						nextTaskId.substring(3, 5)
					)}/${Number(nextTaskId.substring(5, 7))}`,
				};
			case "practice":
				return {
					label: setString(data?.lang, "theoryTaskNext"),
					link: `/${nextTaskId.substring(0, 3)}/${Number(
						nextTaskId.substring(3, 5)
					)}/${Number(nextTaskId.substring(5, 7))}`,
				};
			default:
				return {
					label: setString(data?.lang, "taskFinalButton"),
					link: `/${data?.module}/${data?.lesson}/final`,
				};
		}
	};

	const nextTaskButton = genNextTaskButton(
		data?.nextTask?.type,
		data?.nextTask?.id
	);

	return (
		<>
			<TaskTitle data={titleData} />
			{(data.content || []).map((content: any) => BuildText(content.intro))}
			<div className="contentButtons">
				<Button
					iconRight={IconForward}
					label={nextTaskButton.label}
					onClick={() => (document.location.href = nextTaskButton.link)}
				/>
			</div>
		</>
	);
}

export { Theory };
