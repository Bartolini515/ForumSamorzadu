import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";

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
	selectedOption: string;
}

export default function ScheduleTable(props: Props) {
	const selectedClass = props.schedule[props.selectedOption];

	// TODO: Stylizacja
	return (
		<>
			{selectedClass && (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Numer lekcji</TableCell>
								<TableCell>Poniedziałek</TableCell>
								<TableCell>Wtorek</TableCell>
								<TableCell>Środa</TableCell>
								<TableCell>Czwartek</TableCell>
								<TableCell>Piątek</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Array.from(
								{
									length: Math.max(
										...selectedClass.flatMap((d) =>
											d.lessons.map((lesson) => lesson.lesson_number)
										)
									),
								},
								(_, lessonIndex) => (
									<TableRow key={lessonIndex}>
										<TableCell>{lessonIndex + 1}</TableCell>
										{[
											"Poniedziałek",
											"Wtorek",
											"Środa",
											"Czwartek",
											"Piątek",
										].map((day) => {
											const dayLessons = selectedClass
												.find((d) => d.day === day)
												?.lessons.find(
													(lesson) => lesson.lesson_number === lessonIndex + 1
												);

											return (
												<TableCell key={day}>
													{dayLessons?.entries.map((entry, index) => (
														<div key={index}>
															<strong>{entry.subject}</strong> <br />
															Nauczyciel {entry.teacher} <br />
															Sala: {entry.room} <br />
															{entry.group && `Grupa: ${entry.group}`}
														</div>
													)) || <div>-</div>}
												</TableCell>
											);
										})}
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
