import "./LessonsList.css";
import { useParams } from "react-router-dom";
import { Text, SkeletonBrick } from "../../Сomponents";

type LessonsListProps = {
	type: "list" | "nav";
	lessons: any;
	activeLesson?: any;
	setActiveLesson?: any;
};

function LessonsList({
	type,
	lessons,
	activeLesson,
	setActiveLesson,
}: LessonsListProps) {
	const params = useParams();
	const module = params.module?.toUpperCase();
	return (
		<ul className="lessonsList">
			{lessons ? lessons.map((lesson: any) =>
				type === "list" ? (
					<li
						className={
							activeLesson?.id === lesson?.id
								? "lessonsListItem active"
								: "lessonsListItem"
						}
					>
						<a href={`/${module}/${lesson.id}`}>
							<Text preset="t7" as="span" view="secondary">
								{lesson?.title}
							</Text>
							<Text preset="t6" as="p">
								{lesson?.description}
							</Text>
						</a>
					</li>
				) : (
					<li
						className={
							activeLesson?.id === lesson?.id
								? "lessonsListItem active"
								: "lessonsListItem"
						}
						onClick={() => setActiveLesson(lesson)}
					>
						<Text preset="t7" as="span" view="secondary">
							{lesson?.title}
						</Text>
						<Text preset="t6" as="p">
							{lesson?.description}
						</Text>
					</li>
				)
			) : <SkeletonBrick />}
		</ul>
	);
}

export { LessonsList };
