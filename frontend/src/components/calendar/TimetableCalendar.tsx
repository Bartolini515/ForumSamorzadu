import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";

export default function Calendar() {
	return (
		<>
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={[{ title: "Event #1", start: "2025-01-27" }]}
				views={{
					timeGridSchoolHours: {},
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
