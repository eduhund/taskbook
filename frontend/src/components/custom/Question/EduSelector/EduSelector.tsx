import { useState } from "react";
import { Select } from "../../../Сomponents";
import { setString } from "../../../../services/multilang/langselector";

function findSelected(variants: any) {
	return variants.find((variant: any) => variant.isSelected === true);
}

function getOurAnswer(variants: any) {
	const correctAnswersObj = variants.filter(
		(variant: any) => variant.isRight === true
	);
	const correctAnswersStr = correctAnswersObj.map(
		(variant: any) => variant.label
	);
	const ourAnswer = correctAnswersStr.join(", ");

	return ourAnswer;
}

function EduSelector({ question, lang, ourVar, onChange }: any) {
	const questionId = question.id;
	const variants = question.variants;
	const selected = findSelected(variants);
	const [value, setValue] = useState<any>(selected || null);

	function onChangeAction(value: any) {
		variants.forEach((variant: any) => {
			if (variant.id === value.id) {
				variant.isSelected = true;
			} else {
				variant.isSelected = false;
			}
		});
		onChange(questionId, variants);
		setValue(value);
	}

	return (
		<div className="inputContainer">
			<Select
				placeholder={setString(lang, "taskSelectorPlaceholder")}
				initValue={value}
				items={variants}
				onChange={({ value }) => {
					onChangeAction(value);
				}}
			/>
			{ourVar && question.hasRightAnswer !== false && (
				<div className="ourVarContainer">
					<span>{getOurAnswer(variants)}</span>
				</div>
			)}
		</div>
	);
}

export { EduSelector };
