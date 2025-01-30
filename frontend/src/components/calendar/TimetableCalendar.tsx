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

export default function Calendar(props: Props) {
	return (
		<>
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={props.events}
				eventClick={(clicked_event) => {
					props.setClickedEventId(clicked_event.event.id);
				}}
				// views={{
				// 	timeGridSchoolHours: {},
				// }}
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
