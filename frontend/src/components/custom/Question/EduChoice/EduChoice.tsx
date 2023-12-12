import { useState } from "react";
import { Choice } from "../../../Сomponents";

function findSelected(variants: any) {
	return variants.find((variant: any) => variant.isSelected === true);
}

function filterSelected(variants: any) {
	return variants.filter((variant: any) => variant.isSelected === true);
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
function EduChoice({ question, ourVar, onChange }: any) {
	const questionId = question.id;
	const variants = question.variants || [];
	const selected = question?.multiply
		? filterSelected(variants)
		: findSelected(variants);
	const [value, setValue] = useState<any>(selected || null);

	function onChangeAction(value: any) {
		if (question?.multiply) {
			const newVariants: any = [];
			for (const variant of variants) {
				const variantId = variant?.id;
				const target = !Array.isArray(value)
					? variantId === value?.id
					: (value || []).find((item: any) => variantId === item?.id);
				if (target) {
					variant.isSelected = true;
				} else {
					variant.isSelected = false;
				}
				newVariants.push(JSON.parse(JSON.stringify(variant)));
			}
			onChange(questionId, newVariants);
		} else {
			const variantId = !Array.isArray(value) ? value?.id : undefined;
			variants.forEach((variant: any) => {
				if (variant.id === variantId) {
					variant.isSelected = true;
				} else {
					variant.isSelected = false;
				}
			});
			onChange(questionId, variants);
		}
		setValue(value);
	}

	return (
		<div className="choiceContainer">
			<Choice
				name={"choice"}
				view={"primary"}
				multiple={question?.multiply || false}
				size={"s"}
				initValue={value}
				items={variants}
				getLabel={(item: any) => item?.value || item?.label}
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

export { EduChoice };
