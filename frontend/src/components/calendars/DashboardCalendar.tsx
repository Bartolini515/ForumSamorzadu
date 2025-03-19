import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";
import { useNavigate } from "react-router-dom";

interface Props {
	events: {
		id: string;
		title: string;
		start: string;
		end: string;
		description: string;
		className: string;
	}[];
}

const correctDate = (endDate: string) => {
	const date = new Date(endDate);
	date.setDate(date.getDate() + 1);
	return date.toISOString().split("T")[0];
};

export default function Calendar(props: Props) {
	const correctedEvents = props.events.map((event) => ({
		...event,
		end: correctDate(event.end),
	}));

	const navigate = useNavigate();

	return (
		<>
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridWeek"
				events={correctedEvents}
				customButtons={{
					TimetableButton: {
						text: "Zobacz wszystkie wydarzenia",
						click: () => {
							navigate("/timetable");
						},
					},
                    
				}}
				eventMouseEnter={() => {
					document.body.style.cursor = "pointer";
				}}
				eventMouseLeave={() => {
					document.body.style.cursor = "auto";
				}}
				headerToolbar={{
					left: "dayGridWeek,dayGridMonth",
					center: "title",
					right: "TimetableButton",
				}}
				locale={plLocale}
				contentHeight={800}
			/>
		</>
	);
}
