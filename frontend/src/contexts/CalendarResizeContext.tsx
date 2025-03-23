import { createContext, useState, useContext, ReactNode } from "react";
import FullCalendar from "@fullcalendar/react";

interface CalendarResizeContextType {
	setCalendarRef: (calendarRef: FullCalendar | null) => void;
	resizeCalendar: () => void;
}

const CalendarResizeContext = createContext<
	CalendarResizeContextType | undefined
>(undefined);

export const CalendarResizeProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [calendarRef, setCalendarRef] = useState<FullCalendar | null>(null);

	const resizeCalendar = () => {
		if (calendarRef) {
			calendarRef.getApi().updateSize();
		} else {
			console.warn("Calendar reference is not set.");
		}
	};

	return (
		<CalendarResizeContext.Provider value={{ setCalendarRef, resizeCalendar }}>
			{children}
		</CalendarResizeContext.Provider>
	);
};

export const useCalendarResize = () => {
	const context = useContext(CalendarResizeContext);
	if (!context) {
		throw new Error(
			"useCalendarResize must be used within a CalendarResizeProvider"
		);
	}
	return context;
};
