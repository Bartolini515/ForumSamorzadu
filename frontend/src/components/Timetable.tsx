import { useEffect, useState } from "react";
import TimetableCalendar from "./calendar/TimetableCalendar";
import FAB from "./forms/FAB";
import AxiosInstance from "./AxiosInstance";
import MultipleSelectChip from "./forms/MultiSelectChip";
import { Box } from "@mui/material";
import MultiSelectCheckbox from "./forms/MultiSelectCheckbox";
import EventDetails from "./modals/EventDetailsModal";
import CreateEventModal from "./modals/CreateEventModal";
import { useAlert } from "../contexts/AlertContext";

export default function Timetable() {
	const [events, setEvents] = useState([]);
	const [options, setOptions] = useState<any>([]);
	const [selectedOptions, setSelectedOptions] = useState<any>([]);
	const [clickedEventId, setClickedEventId] = useState<string>("");
	const [createEventModal, setCreateEventModal] = useState<boolean>(false);

	const { setAlert } = useAlert();

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
				console.log(error);
				setAlert(error.message, "error");
			});
	};
	useEffect(() => {
		GetData();
	}, []);

	const handleClickFAB = () => {
		setCreateEventModal(true);
	};

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
								onClose={() => {
									GetData();
								}}
							/>
						)}
						<FAB handleClick={handleClickFAB} />
						{createEventModal && (
							<CreateEventModal
								open={createEventModal}
								onClose={() => {
									setCreateEventModal(false);
									GetData();
								}}
							/>
						)}
					</Box>
				</>
			)}
		</>
	);
}
