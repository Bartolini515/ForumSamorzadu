import { Box, Divider, Button } from "@mui/material";
import ModeratorPanelTable from "./Tables/ModeratorPanelTable";
import SingleSelectAutoWidth from "./forms/SingleSelectAutoWidth";
import { useState, useMemo } from "react";
import CreateUserModal from "./modals/CreateUserOrEventModal";

export default function ModeratorPanel() {
	const [selectedOption, setSelectedOption] = useState<any>("Użytkownicy");
	const [open, setOpen] = useState(false);
	const [refresh, setRefresh] = useState(false);

	const option = useMemo(() => {
		switch (selectedOption) {
			case "Użytkownicy":
				return "user";
			case "Typy wydarzeń":
				return "event_types";
			default:
				return "";
		}
	}, [selectedOption]);

	const headers = useMemo(() => {
		switch (option) {
			case "user":
				return ["ID", "Imię", "Nazwisko", "Email", "Ostatnie logowanie"];
			case "event_types":
				return ["ID", "Nazwa"];
			default:
				return [];
		}
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
				<CreateUserModal
					option={option}
					open={open}
					setOpen={setOpen}
					setRefresh={setRefresh}
				/>
			)}
		</Box>
	);
}
