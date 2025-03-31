import { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";
import { useCalendarResize } from "../../contexts/CalendarResizeContext";

interface Props {
	events: {
		id: string;
		title: string;
		start: string;
		end: string;
		description: string;
		event_color: string;
	}[];
	setClickedEventId: any;
}

const correctDate = (endDate: string) => {
	const date = new Date(endDate);
	date.setDate(date.getDate() + 1);
	return date.toISOString().split("T")[0];
};

const getContrastingColor = (hex: string) => {
	// Remove the hash if it exists
	const cleanHex = hex.replace("#", "");

	// Convert hex to RGB
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);

	// Calculate luminance
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	// Return black or white based on luminance
	return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export default function Calendar(props: Props) {
	const { setCalendarRef } = useCalendarResize();
	const reference = useRef<FullCalendar>(null);

	useEffect(() => {
		setCalendarRef(reference.current);
	}, []);

	const correctedEvents = props.events.map((event) => ({
		...event,
		end: correctDate(event.end),
		backgroundColor: `#${event.event_color}`,
		borderColor: `#${event.event_color}`,
		textColor: getContrastingColor(`#${event.event_color}`),
	}));

	return (
		<FullCalendar
			ref={reference}
			plugins={[dayGridPlugin, interactionPlugin]}
			initialView="dayGridMonth"
			events={correctedEvents}
			eventClick={(clicked_event) => {
				props.setClickedEventId(clicked_event.event.id);
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
				right: "prev,next",
			}}
			locale={plLocale}
			contentHeight={800}
		/>
	);
}
