import { Text } from "@consta/uikit/Text";
import { TEXT_2, TEXT_6 } from "../../../components/basic/Text/textVars";

interface TaskHeaderProps {
	data: any;
}

function TaskTitle(props: TaskHeaderProps) {
	const title = props.data.title;
	const description = props.data.description;

	return (
		<>
			<Text {...TEXT_2} className="task__title">
				{title}
			</Text>
			<Text {...TEXT_6} className="task__description">
				{description}
			</Text>
		</>
	);
}

export { TaskTitle };
