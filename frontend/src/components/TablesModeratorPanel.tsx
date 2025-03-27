import { Box, Divider, Button } from "@mui/material";
import ModeratorPanelTable from "./Tables/ModeratorPanelTable";
import SingleSelectAutoWidth from "./forms/SingleSelectAutoWidth";
import { useState, useMemo } from "react";
import CreateUserOrEvent from "./modals/CreateUserOrEventModal";

export default function ModeratorPanel() {
	const [selectedOption, setSelectedOption] = useState<any>("Użytkownicy");
	const [open, setOpen] = useState(false);
	const [refresh, setRefresh] = useState(false);

	const option = useMemo(() => {
		const optionsMap: Record<string, string> = {
			Użytkownicy: "user",
			"Typy wydarzeń": "event_types",
		};
		return optionsMap[selectedOption] || "";
	}, [selectedOption]);

	const headers = useMemo(() => {
		const headersMap: Record<string, string[]> = {
			user: ["ID", "Imię", "Nazwisko", "Email", "Ostatnie logowanie"],
			event_types: ["ID", "Nazwa"],
		};
		return headersMap[option] || [];
	}, [option]);

	const handleClick = () => {
		setOpen(true);
	};

	return (
		<Box
			sx={{
				boxShadow: 3,
				padding: "20px",
			}}
		>
			<Box sx={{ width: "30%" }}>
				<SingleSelectAutoWidth
					label="Tabela"
					options={["Użytkownicy", "Typy wydarzeń"]}
					setSelectedValue={setSelectedOption}
					selectedValue={selectedOption}
				/>
			</Box>

			<ModeratorPanelTable
				headers={headers}
				option={option}
				refresh={refresh}
				setRefresh={setRefresh}
			/>
			<Divider sx={{ marginBottom: "20px" }} />
			<Button variant="contained" color="primary" onClick={handleClick}>
				{option === "user" ? "Dodaj użytkownika" : "Dodaj typ wydarzenia"}
			</Button>
			{open && (
				<CreateUserOrEvent
					option={option}
					open={open}
					setOpen={setOpen}
					setRefresh={setRefresh}
				/>
			)}
		</Box>
	);
}
