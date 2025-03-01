import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";

interface Props {
	events: {
		id: string;
		title: string;
		start: string;
		end: string;
		description: string;
		className: string;
	}[];
	setClickedEventId: any;
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
	return (
		<>
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={correctedEvents}
				// events={props.events}
				eventClick={(clicked_event) => {
					props.setClickedEventId(clicked_event.event.id);
				}}
				headerToolbar={{
					left: "dayGridWeek,dayGridMonth",
					center: "title",
					right: "prev,next",
				}}
				locale={plLocale}
				contentHeight={800}
			/>
		</>
	);
}
