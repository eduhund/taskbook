import { TextField } from "../../../Сomponents";
import { setString } from "../../../../services/multilang/langselector";

export function EduInput({ question, lang, ourVar, onChange, type }: any) {
	const questionId = question.id;
	const minLength = question?.minLength;
	const price = question?.price;
	const source = question?.source;

	const cachedValue = localStorage.getItem(questionId);

	cachedValue && onBlurAction(cachedValue);

	function onChangeAction({ value }: any) {
		if (value) {
			localStorage.setItem(questionId, value);
		} else {
			localStorage.removeItem(questionId);
			onChange(questionId, {
				value,
				price,
				source,
				minLength,
			});
		}
	}

	function onBlurAction(value: any) {
		localStorage.removeItem(questionId);
		onChange(questionId, {
			value,
			price,
			source,
			minLength,
		});
	}

	return (
		<div className="inputContainer">
			<TextField
				placeholder={
					question?.placeholder || type === "text"
						? setString(lang, "taskInputPlaceholder")
						: setString(lang, "taskLinkPlaceholder")
				}
				initValue={cachedValue || question?.answer?.value || null}
				width="full"
				type="textarea"
				minRows={question?.largeAnswer ? 3 : 1}
				maxRows={10}
				onChange={onChangeAction}
				onBlur={onBlurAction}
			/>
			{ourVar && question.hasRightAnswer !== false && question.rightAnswer && (
				<div className="ourVarContainer">
					<span>{setString(lang, "taskDefaultOurVar")}</span>
				</div>
			)}
		</div>
	);
}
