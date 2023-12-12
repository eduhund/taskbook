import "./Question.css";
import { Image, Text } from "../../../components/Сomponents";
import { EduRadio } from "./EduRadio/EduRadio";
import { EduCheckbox } from "./EduCheckbox/EduCheckbox";
import { EduSelector } from "./EduSelector/EduSelector";
import { EduChoice } from "./EduChoice/EduChoice";
import { EduInput } from "./EduInput/EduInput";
import MissContent from "../../../components/MissContent";

function QuestionType(props: any) {
	switch (props.question.type) {
		case "radio":
			return (
				<EduRadio
					question={props.question}
					ourVar={props.ourVar}
					onChange={props.updateState}
				/>
			);
		case "checkbox":
			return (
				<EduCheckbox
					question={props.question}
					ourVar={props.ourVar}
					onChange={props.updateState}
				/>
			);
		case "text":
			return (
				<EduInput
					question={props.question}
					type="text"
					lang={props?.lang}
					ourVar={props.ourVar}
					onChange={props.updateState}
				/>
			);
		case "select":
			return (
				<EduSelector
					question={props.question}
					lang={props?.lang}
					taskStatus={props.taskStatus}
					ourVar={props.ourVar}
					onChange={props.updateState}
				/>
			);
		case "choice":
			return (
				<EduChoice
					question={props.question}
					ourVar={props.ourVar}
					onChange={props.updateState}
				/>
			);
		case "link":
			return (
				<EduInput
					question={props.question}
					type="link"
					ourVar={props.ourVar}
					onChange={props.updateState}
				/>
			);
		case "auto":
			const isMultiply = props.question.multiply || false;
			const type = props.question.type;
			const variantsCounter = (props.question.variants || []).length;

			if (isMultiply) {
				return (
					<EduCheckbox
						question={props.question}
						ourVar={props.ourVar}
						onChange={props.updateState}
					/>
				);
			}

			if (!isMultiply && variantsCounter > 2) {
				return (
					<EduRadio
						question={props.question}
						ourVar={props.ourVar}
						onChange={props.updateState}
					/>
				);
			}

			if (
				!isMultiply &&
				variantsCounter <= 2 &&
				type !== "text" &&
				type !== "link"
			) {
				return (
					<EduChoice
						question={props.question}
						ourVar={props.ourVar}
						onChange={props.updateState}
					/>
				);
			}

			return <MissContent />;
		default:
			return <MissContent />;
	}
}

function Question({ question, lang, ourVar, updateState }: any) {
	return (
		<>
			{question?.topic && (
				<Text preset="t3" as="h3">
					{question?.topic}
				</Text>
			)}
			{question?.subtopic &&
				(typeof question?.subtopic == "string" ? (
					<Text preset="t6" as="p">
						{question?.subtopic}
					</Text>
				) : (
					question?.subtopic.map((item: any) => (
						<Text preset="t6" as="p">
							{item}
						</Text>
					))
				))}
			{question?.img &&
				question?.img.map((img: any) => (
					<Image
						key={img?.url}
						url={img?.url}
						caption={img?.caption}
						preview={false}
						border={false}
					/>
				))}
			<QuestionType
				key={question?.id}
				lang={lang}
				question={question}
				ourVar={ourVar}
				updateState={updateState}
			/>
		</>
	);
}

export { Question };
