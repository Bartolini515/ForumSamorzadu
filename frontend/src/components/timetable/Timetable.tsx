import { useEffect, useState } from "react";
import TimetableCalendar from "./TimetableCalendar";
import FAB from "../forms/FAB";
import AxiosInstance from "../AxiosInstance";
// import MultipleSelectChip from "./forms/MultiSelectChip";
import { Box, Skeleton } from "@mui/material";
import MultiSelectCheckbox from "../forms/MultiSelectCheckbox";
import EventDetails from "../modalsAndDialogs/EventDetailsModal";
import CreateEventModal from "../modalsAndDialogs/CreateEventModal";
import { useAlert } from "../../contexts/AlertContext";

export default function Timetable() {
	const [events, setEvents] = useState([]);
	const [options, setOptions] = useState<any>([]);
	const [selectedOptions, setSelectedOptions] = useState<any>([]);
	const [clickedEventId, setClickedEventId] = useState<number>(0);
	const [createEventModal, setCreateEventModal] = useState<boolean>(false);

	const { setAlert } = useAlert();
	const [loading, setLoading] = useState(true);

	// Filtracja wyświetlanych wydarzeń na bazie wybranych opcji
	const filteredEvents: any = events.filter((event: any) =>
		selectedOptions.includes(event.event_type)
	);

	const GetData = () => {
		AxiosInstance.get("timetable/")
			.then((response) => {
				setEvents(response.data);
				// Stworzenie listy dostępnych typów wydarzeń
				setOptions([
					...new Set(response.data.map((event: any) => event.event_type)),
				]);
				// Ustawienie domyślnych typów wydarzeń (wszystkich)
				setSelectedOptions([
					...new Set(response.data.map((event: any) => event.event_type)),
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
				<Skeleton variant="rectangular" height={400} />
			) : (
				<>
					<Box
						sx={{
							boxShadow: 3,
							padding: "20px",
							display: "flex",
							justifyContent: "space-evenly",
							marginBottom: "20px",
							flexDirection: { xs: "column", sm: "row" },
						}}
					>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}>
							<MultiSelectCheckbox
								label="Typ"
								options={options}
								setSelectedValue={setSelectedOptions}
								selectedValue={selectedOptions}
							/>
						</Box>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}>
							{/* <MultipleSelectChip
								label="Osoby"
								options={[]}
								setSelectedValue={[]}
								selectedValue={[]}
							/> */}
						</Box>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}></Box>
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
						<FAB handleClick={handleClickFAB} color="secondary" />
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
