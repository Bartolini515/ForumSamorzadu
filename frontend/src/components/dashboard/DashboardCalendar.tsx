import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";

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
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<>
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView={isSmallScreen ? "customThreeDay" : "dayGridWeek"}
				views={{
					customThreeDay: {
						type: "dayGrid",
						duration: { days: 3 },
						buttonText: "3 dni",
					},
				}}
				events={correctedEvents}
				customButtons={{
					TimetableButton: {
						text: "Zobacz wszystkie wydarzenia",
						click: () => {
							navigate("/timetable");
						},
					},
				}}
				height={"100%"}
				headerToolbar={{
					left: "",
					center: "",
					right: "TimetableButton",
				}}
				locale={plLocale}
			/>
		</>
	);
}
