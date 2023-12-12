import { useState } from "react";
import { Checkbox } from "../../../Сomponents";
import { getOurVarCN } from "../../../../services/utils/getOurVarCN";

type EduCheckboxProps = {
	question: any;
	ourVar: boolean;
	onChange: any;
};

function filterSelected(variants: any) {
	return variants.filter((variant: any) => variant.isSelected === true);
}

function EduCheckbox({ question, ourVar, onChange }: EduCheckboxProps) {
	const questionId = question.id;
	const variants = question.variants;
	const selected = filterSelected(variants);
	const [, setValue] = useState<any>(selected || []);

	function onChangeAction({ variant, checked }: any) {
		variant.isSelected = checked;
		onChange(questionId, variants);
		setValue(filterSelected(variants));
	}

	return (
		<div className="variantsContainer">
			{variants.map((variant: any) => {
				return (
					<Checkbox
						key={variant.id}
						align="top"
						className={getOurVarCN(ourVar, variant.isRight)}
						label={variant.label}
						initChecked={variant.isSelected}
						onChange={({ checked }) => onChangeAction({ variant, checked })}
					/>
				);
			})}
		</div>
	);
}

export { EduCheckbox };
