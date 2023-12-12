import { setString } from "../../services/multilang/langselector";

function genNextTaskButton({
	currentType,
	nextType,
	module,
	lesson,
	task,
}: any) {
	switch (currentType + nextType) {
		case "theorytheory":
			return {
				label: setString("ru", "theoryContinue"),
				link: `/${module}/${lesson}/${task}`,
			};
		case "theorypractice":
			return {
				label: setString("ru", "theoryTaskNext"),
				link: `/${module}/${lesson}/${task}`,
			};

		case "precticetheory":
			return {
				label: setString("ru", "taskStart"),
				link: `/${module}/${lesson}/${task}`,
			};
		case "practicepractice":
			return {
				label: setString("ru", "taskNext"),
				link: `/${module}/${lesson}/${task}`,
			};
		default:
			return {
				label: setString("ru", "taskFinalButton"),
				link: `/${module}/${lesson}/final`,
			};
	}
}

export { genNextTaskButton };
