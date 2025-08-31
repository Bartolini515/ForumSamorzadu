import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCustomTheme } from "../../contexts/ThemeContext";

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
	selectedLessonNumber: number;
}

export default function ClassWalkTable(props: Props) {
	const [presentClasses, setPresentClasses] = useState<
		{ room: string; className: string; group?: string }[]
	>([]);
	const [absentClasses, setAbsentClasses] = useState<string[]>([]);

	const dayNames = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

	const { mode } = useCustomTheme();

	useEffect(() => {
		const selectedDayName = dayNames[props.selectedDay];
		const selectedLessonNum = props.selectedLessonNumber + 1;

		const presentClassesData: {
			room: string;
			className: string;
			group?: string;
		}[] = [];
		const absentClassesData: string[] = [];

		Object.entries(props.schedule).forEach(([className, classDays]) => {
			const daySchedule = classDays.find((day) => day.day === selectedDayName);

			if (daySchedule) {
				const lesson = daySchedule.lessons.find(
					(l) => l.lesson_number === selectedLessonNum
				);

				if (lesson && lesson.entries.length > 0) {
					lesson.entries.forEach((entry) => {
						presentClassesData.push({
							room: entry.room,
							className: className,
							group: entry.group,
						});
					});
				} else {
					absentClassesData.push(className);
				}
			} else {
				absentClassesData.push(className);
			}
		});

		setPresentClasses(presentClassesData);
		setAbsentClasses(absentClassesData);
	}, [props.schedule, props.selectedDay, props.selectedLessonNumber]);

	return (
		<>
			{presentClasses.length > 0 && (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Sala</TableCell>
								<TableCell>Klasa</TableCell>
								<TableCell>Grupa</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{presentClasses
								.sort((a, b) =>
									a.room.localeCompare(b.room, undefined, { numeric: true })
								)
								.map((classEntry, index) => (
									<TableRow key={index}>
										<TableCell>{classEntry.room}</TableCell>
										<TableCell>{classEntry.className}</TableCell>
										<TableCell>{classEntry.group || "-"}</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			{absentClasses.length > 0 && (
				<Box
					sx={{
						marginTop: "20px",
						padding: "15px",
						backgroundColor: mode === "light" ? "#f5f5f5" : "#424242",
						borderRadius: "8px",
					}}
				>
					<Typography
						variant="h6"
						sx={{
							margin: "0 0 10px 0",
							color: mode === "light" ? "#666" : "#fff",
						}}
					>
						Klasy nieobecne w tym czasie:
					</Typography>
					<Typography
						variant="body2"
						sx={{ margin: 0, color: mode === "light" ? "#666" : "#fff" }}
					>
						{absentClasses.sort().join(", ")}
					</Typography>
				</Box>
			)}

			{presentClasses.length === 0 && absentClasses.length === 0 && (
				<Typography
					variant="body2"
					sx={{
						textAlign: "center",
						fontWeight: "bold",
						color: mode === "light" ? "#666" : "#fff",
					}}
				>
					Brak danych dla wybranego dnia i lekcji
				</Typography>
			)}
		</>
	);
}
