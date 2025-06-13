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
	allRooms: string[];
	selectedDay: number;
}

export default function RoomTable(props: Props) {
	const [availableRooms, setAvailableRooms] = useState<{
		[lessonNumber: number]: string[];
	}>({});

	useEffect(() => {
		const roomsOccupied: { [lessonNumber: number]: Set<string> } = {};

		Object.values(props.schedule).forEach((classSchedule) => {
			classSchedule.forEach((daySchedule) => {
				if (
					daySchedule.day ===
					["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"][
						props.selectedDay
					]
				) {
					daySchedule.lessons.forEach((lesson) => {
						if (!roomsOccupied[lesson.lesson_number]) {
							roomsOccupied[lesson.lesson_number] = new Set();
						}
						lesson.entries.forEach((entry) => {
							roomsOccupied[lesson.lesson_number].add(entry.room);
						});
					});
				}
			});
		});

		const freeRooms: { [lessonNumber: number]: string[] } = {};
		Object.keys(roomsOccupied).forEach((lessonNumber) => {
			freeRooms[Number(lessonNumber)] = props.allRooms.filter(
				(room) => !roomsOccupied[Number(lessonNumber)].has(room)
			);
		});

		setAvailableRooms(freeRooms);
	}, [props.schedule, props.allRooms, props.selectedDay]);

	return (
		<>
			{Object.keys(availableRooms).length > 0 && (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Numer lekcji</TableCell>
								<TableCell>Wolne pokoje</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Object.entries(availableRooms)
								.sort(([a], [b]) => Number(a) - Number(b)) // Sort by lesson number
								.map(([lessonNumber, rooms]) => (
									<TableRow key={lessonNumber}>
										<TableCell>{lessonNumber}</TableCell>
										<TableCell>
											{rooms.length > 0 ? rooms.join(", ") : "-"}
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	);
}
