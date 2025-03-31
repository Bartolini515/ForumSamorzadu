import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";
import { useNavigate } from "react-router-dom";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import MyButton from "../forms/MyButton";
import { useRef, useEffect } from "react";
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
	const correctedEvents = props.events.map((event) => ({
		...event,
		end: correctDate(event.end),
		backgroundColor: `#${event.event_color}`,
		borderColor: `#${event.event_color}`,
		textColor: getContrastingColor(`#${event.event_color}`),
	}));

	const navigate = useNavigate();
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const { setCalendarRef } = useCalendarResize();
	const reference = useRef<FullCalendar>(null);

	useEffect(() => {
		setCalendarRef(reference.current);
	}, []);

	return (
		<>
			<Box
				sx={{
					position: "relative",
					display: "flex",
					justifyContent: "space-between",
					marginBottom: "10px",
				}}
			>
				<Typography variant="h5">Najbliższe wydarzenia</Typography>
				<MyButton
					label={"Zobacz wszystkie wydarzenia"}
					type={"button"}
					onClick={() => {
						navigate("/timetable");
					}}
					variant="text"
					style={{ color: "black", textDecoration: "underline" }}
				></MyButton>
			</Box>
			<FullCalendar
				ref={reference}
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView={isSmallScreen ? "customThreeDay" : "customWeek"}
				views={{
					customThreeDay: {
						type: "dayGrid",
						duration: { days: 3 },
						buttonText: "3 dni",
					},
					customWeek: {
						type: "dayGrid",
						duration: { days: 7 },
						buttonText: "Tydzień",
					},
				}}
				events={correctedEvents}
				height={"100%"}
				contentHeight={"auto"}
				headerToolbar={{
					left: "",
					center: "",
					right: "",
				}}
				locale={plLocale}
			/>
		</>
	);
}
