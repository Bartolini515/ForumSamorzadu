import { useEffect, useState } from "react";
import TimetableCalendar from "./calendar/TimetableCalendar";
import FAB from "./Buttons/FAB";
import AxiosInstance from "./AxiosInstance";
import MultipleSelectChip from "./forms/MultiSelectChip";
import { Box } from "@mui/material";
import MultiSelectCheckbox from "./forms/MultiSelectCheckbox";
import EventDetails from "./modals/EventDetailsModal";
import FilledAlerts from "./alerts/FilledAlert";

export default function Timetable() {
	const [events, setEvents] = useState([]);
	const [options, setOptions] = useState<any>([]);
	const [selectedOptions, setSelectedOptions] = useState<any>([]);
	const [clickedEventId, setClickedEventId] = useState<string>("");

	const [alertOpen, setAlertOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertSeverity, setAlertSeverity] = useState<
		"error" | "warning" | "info" | "success"
	>("error");
	const [alertTimeout, setAlertTimeout] = useState<number>(0);

	const handleAlert = (error: any) => {
		console.log(error);
		setAlertOpen(true);
		setAlertMessage("Coś poszło nie tak");
		setAlertSeverity("error");
		setAlertTimeout(8000);
	};

	const filteredEvents: any = events.filter((event: any) =>
		selectedOptions.includes(event.className)
	);

	const [loading, setLoading] = useState(true);

	const GetData = () => {
		AxiosInstance.get("timetable/")
			.then((response) => {
				setEvents(response.data);
				setOptions([
					...new Set(response.data.map((event: any) => event.className)),
				]);
				setSelectedOptions([
					...new Set(response.data.map((event: any) => event.className)),
				]);

				setLoading(false);
			})
			.catch((error: any) => {
				handleAlert(error);
			});
	};
	useEffect(() => {
		GetData();
	}, []);
	return (
		<>
			{loading ? (
				<p>Pobieranie danych</p>
			) : (
				<>
					<Box
						sx={{
							boxShadow: 3,
							padding: "20px",
							display: "flex",
							justifyContent: "space-evenly",
							marginBottom: "20px",
						}}
					>
						<Box sx={{ width: "30%" }}>
							<MultiSelectCheckbox
								label="Typ"
								options={options}
								setSelectedValue={setSelectedOptions}
								selectedValue={selectedOptions}
							/>
						</Box>
						<Box sx={{ width: "30%" }}>
							<MultipleSelectChip
								label="Osoby"
								options={[]}
								setSelectedValue={[]}
								selectedValue={[]}
							/>
						</Box>
						<Box sx={{ width: "30%" }}></Box>
					</Box>
					<Box
						sx={{
							boxShadow: 3,
							padding: "20px",
						}}
					>
						<TimetableCalendar
							events={filteredEvents}
							setClickedEventId={setClickedEventId}
						/>
						{clickedEventId && (
							<EventDetails
								id={clickedEventId}
								setClickedEventId={setClickedEventId}
								setAlertOpen={setAlertOpen}
							/>
						)}
						<FAB />
						{alertOpen && (
							<FilledAlerts
								message={alertMessage}
								severity={alertSeverity}
								timeout={alertTimeout}
								setAlertOpen={setAlertOpen}
							/>
						)}
					</Box>
				</>
			)}
		</>
	);
}
