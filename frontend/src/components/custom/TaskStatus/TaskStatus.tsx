import { Theme, presetGpnDefault } from "@consta/uikit/Theme";
import { Badge } from "../../Сomponents";
import { setString } from "../../../services/multilang/langselector";

interface StatusProps {
	className?: string;
	isChecked: boolean;
	size: "m" | "s";
	score?: Number;
	lang?: string;
	maxScore?: Number;
	inProcess?: boolean;
}

function TaskStatus({
	className,
	isChecked,
	size,
	score,
	maxScore,
	lang,
	inProcess = false,
}: StatusProps) {
	function setTaskStatus(isChecked: any, score: any, maxScore: any) {
		if (isChecked) {
			const progress = Math.trunc((score / maxScore) * 100);
			if (progress >= 80) {
				return "system";
			} else if (progress >= 60 && progress < 80) {
				return "warning";
			} else {
				return "error";
			}
		} else if (!isChecked && (score !== null || inProcess)) {
			return "success";
		} else {
			return "system";
		}
	}

	function setTaskLabel(isChecked: any, score: any, maxScore: any) {
		if (isChecked) {
			return `${score} / ${maxScore}`;
		} else if (!isChecked && (score !== null || inProcess)) {
			return setString(lang, "navMenuBadgeInProgress").toUpperCase();
		} else {
			return setString(lang, "navMenuBadgeNew").toUpperCase();
		}
	}

	function setTaskView(isChecked: any, score: any, maxScore: any) {
		const progress = Math.trunc((score / maxScore) * 100);
		if (isChecked && progress >= 80) {
			return "filled";
		} else {
			return "stroked";
		}
	}

	return (
		<Theme preset={presetGpnDefault} className={className || ""}>
			<Badge
				label={setTaskLabel(isChecked, score, maxScore)}
				view={setTaskView(isChecked, score, maxScore)}
				status={setTaskStatus(isChecked, score, maxScore)}
				size={size}
			/>
		</Theme>
	);
}

export { TaskStatus };
