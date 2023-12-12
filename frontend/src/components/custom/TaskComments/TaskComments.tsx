import "./TaskComments.css";

import { useState, FormEvent } from "react";
import { Text, TextField, Button, Checkbox } from "../../Сomponents";
import { addComment } from "../../../services/api/api";
import { setString } from "../../../services/multilang/langselector";

type CommentsList = {
	message: string;
};

type TaskCommentsProps = {
	taskId: string;
	commentsList?: CommentsList[];
	protest?: boolean;
	taskStatus?: boolean;
	lang?: string;
	onSubmit: Function;
};

function TaskComments({
	taskId,
	commentsList = [],
	protest = false,
	taskStatus,
	lang,
	onSubmit,
}: TaskCommentsProps) {
	const [text, setText] = useState<string>(commentsList[0]?.message);
	const [activeInput, setInputState] = useState<boolean>(false);
	const [checked, setChecked] = useState<boolean>(protest);
	const [isLoading, setLoading] = useState<boolean>(false);

	function TextFieldOnChange({ value }: any) {
		setInputState(true);
		setText(value);
		if (!value) {
			setChecked(false);
		}
	}

	function protestOnChange({ checked }: any) {
		setChecked(checked);
		setInputState(true);
	}

	async function handleSubmit(event: any) {
		event.preventDefault();
		const comment = event.target[0].value || "";
		if (activeInput) {
			setLoading(true);
			await addComment(taskId, comment, checked);
			await onSubmit("protest", taskStatus, checked);
			setLoading(false);
		}
		setInputState(!activeInput);
	}

	return (
		<div className="commentsContainer">
			<form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}>
				<Text className="commentsHeader" preset="t3" as="h3" align="left">
					{setString(lang, "commentsHeader")}
				</Text>
				<Text
					className="commentsSubheader"
					preset="t6"
					as="p"
					align="left"
					view="secondary"
				>
					{setString(lang, "commentsDescription")}
				</Text>
				<div className="comment">
					{activeInput || !text ? (
						<TextField
							type="textarea"
							focused={activeInput}
							minRows={3}
							maxRows={10}
							width={"full"}
							placeholder={""}
							initValue={text}
							onChange={TextFieldOnChange}
						/>
					) : (
						<p>{text}</p>
					)}
				</div>
				<div className="commentSubmit">
					<Checkbox
						label={setString(lang, "commentsProtest")}
						size="m"
						view="ghost"
						initChecked={text ? checked : false}
						disabled={!text || !activeInput}
						onChange={protestOnChange}
					/>
					{(text || activeInput) && (
						<Button
							type="submit"
							label={
								activeInput
									? setString(lang, "saveButton")
									: setString(lang, "editButton")
							}
							view="secondary"
							size="s"
							loading={isLoading}
						/>
					)}
				</div>
				{checked && !activeInput && (
					<div className="protestHint">
						<Text as="span" size="s" view="secondary">
							{setString(lang, "commentProtestCheck")}
						</Text>
					</div>
				)}
			</form>
		</div>
	);
}

export { TaskComments };
