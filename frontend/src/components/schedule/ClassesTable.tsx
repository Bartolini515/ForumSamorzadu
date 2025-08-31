import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
	schedule: {
		[className: string]: {
			day: "Poniedziałek" | "Wtorek" | "Środa" | "Czwartek" | "Piątek";
			lessons: {
				lesson_number: number;
				entries: {
					subject: string;
					teacher: string;
					room: string;
					group?: string;
				}[];
			}[];
		}[];
	};
	selectedDay: number;
}

export default function ClassesTable(props: Props) {
	const [lessonActivityDetails, setLessonActivityDetails] = useState<{
		[lessonNumber: number]: {
			presentClassCount: number;
			absentClassNames: string[];
			presentClassNames: string[];
		};
	}>({});

	useEffect(() => {
		const dayNames = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
		const currentDayName = dayNames[props.selectedDay];
		const allClassNamesInSchedule = Object.keys(props.schedule);

		if (allClassNamesInSchedule.length === 0) {
			setLessonActivityDetails({});
			return;
		}

		let maxLessonNumberToConsider = 0;
		Object.values(props.schedule).forEach((classDays) => {
			classDays.forEach((daySchedule) => {
				daySchedule.lessons.forEach((lesson) => {
					if (lesson.lesson_number > maxLessonNumberToConsider) {
						maxLessonNumberToConsider = lesson.lesson_number;
					}
				});
			});
		});

		if (maxLessonNumberToConsider === 0) {
			setLessonActivityDetails({});
			return;
		}

		const activityData: {
			[lessonNumber: number]: {
				presentClassCount: number;
				absentClassNames: string[];
				presentClassNames: string[];
			};
		} = {};

		for (
			let lessonNum = 1;
			lessonNum <= maxLessonNumberToConsider;
			lessonNum++
		) {
			const classesPresentThisLesson: string[] = [];
			allClassNamesInSchedule.forEach((className) => {
				const classScheduleForDay = props.schedule[className].find(
					(d) => d.day === currentDayName
				);

				if (classScheduleForDay) {
					const isClassPresent = classScheduleForDay.lessons.some(
						(l) => l.lesson_number === lessonNum
					);
					if (isClassPresent) {
						classesPresentThisLesson.push(className);
					}
				}
			});

			const absentClassNamesThisLesson = allClassNamesInSchedule.filter(
				(cn) => !classesPresentThisLesson.includes(cn)
			);

			activityData[lessonNum] = {
				presentClassCount: classesPresentThisLesson.length,
				absentClassNames: absentClassNamesThisLesson,
				presentClassNames: classesPresentThisLesson,
			};
		}

		setLessonActivityDetails(activityData);
	}, [props.schedule, props.selectedDay]);

	return (
		<>
			{Object.keys(lessonActivityDetails).length > 0 && (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Numer lekcji</TableCell>
								<TableCell>Ilość klas obecnych</TableCell>
								<TableCell>Obecne klasy</TableCell>
								<TableCell>Nieobecne klasy</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Object.entries(lessonActivityDetails)
								.sort(([a], [b]) => Number(a) - Number(b))
								.map(
									([
										lessonNumber,
										{ presentClassCount, presentClassNames, absentClassNames },
									]) => (
										<TableRow key={lessonNumber}>
											<TableCell>{lessonNumber}</TableCell>
											<TableCell>{presentClassCount}</TableCell>
											<TableCell>
												{presentClassNames.length > 0
													? presentClassNames.join(", ")
													: "-"}
											</TableCell>
											<TableCell>
												{absentClassNames.length > 0
													? absentClassNames.join(", ")
													: "-"}
											</TableCell>
										</TableRow>
									)
								)}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	);
}
