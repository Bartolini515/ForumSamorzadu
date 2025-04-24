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
	console.log(props.schedule);

	const selectedClass = props.schedule[props.selectedOption];

	if (!selectedClass) {
		return <div>No schedule available</div>;
	}
	console.log(selectedClass);

	<table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
		<thead>
			<tr>
				<th>Day</th>
				<th>Lesson Number</th>
				<th>Subject</th>
				<th>Teacher</th>
				<th>Room</th>
				<th>Group</th>
			</tr>
		</thead>
		<tbody>
			{selectedClass.map((day: any) => {
				return day.lessons.map((lesson: any) => {
					console.log(lesson); // Generalnie to działa, tylko się nie wyświetla tabelka
					return lesson.entries.map((entry: any) => {
						return (
							<tr key={`${day.day}-${lesson.lesson_number}-${entry.subject}`}>
								<td>{day.day}</td>
								<td>{lesson.lesson_number}</td>
								<td>{entry.subject}</td>
								<td>{entry.teacher}</td>
								<td>{entry.room}</td>
								<td>{entry.group || "N/A"}</td>
							</tr>
						);
					});
				});
			})}
		</tbody>
	</table>;
}
