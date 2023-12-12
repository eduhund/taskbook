import { useState } from "react";
import { Radio } from "../../../Сomponents";
import { getOurVarCN } from "../../../../services/utils/getOurVarCN";

type EduRadioProps = {
	question: any;
	ourVar: boolean;
	onChange: any;
};

function findSelected(variants: any) {
	return variants.find((variant: any) => variant.isSelected === true);
}

function EduRadio({ question, ourVar, onChange }: EduRadioProps) {
	const questionId = question.id;
	const variants = question.variants;
	const selected = findSelected(variants);
	const [, setValue] = useState<any>(selected || null);

	function onChangeAction(variantId: string) {
		variants.forEach((variant: any) => {
			if (variant.id === variantId) {
				variant.isSelected = true;
			} else {
				variant.isSelected = false;
			}
		});
		onChange(questionId, variants);
		setValue(findSelected(variants));
	}

	return (
		<div className="variantsContainer">
			{variants.map((variant: any) => {
				const variantId = variant.id;
				return (
					<Radio
						key={variantId}
						align="top"
						className={getOurVarCN(ourVar, variant.isRight)}
						label={variant.label}
						initChecked={variant.isSelected}
						onChange={() => {
							onChangeAction(variantId);
						}}
					/>
				);
			})}
		</div>
	);
}

export { EduRadio };
