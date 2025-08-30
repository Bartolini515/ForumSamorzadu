import { Box, Divider, Button } from "@mui/material";
import ModeratorPanelDataManagementTable from "./ModeratorPanelDataManagementTable";
import SingleSelectAutoWidth from "../../../UI/forms/SingleSelectAutoWidth";
import { useState } from "react";
import CreateForPanelDataModal from "../modals/CreateForPanelDataModal";

export default function ModeratorPanelDataManagement() {
	const [selectedOption, setSelectedOption] =
		useState<keyof typeof optionsMap>("user");
	const [open, setOpen] = useState(false);
	const [refresh, setRefresh] = useState(false);

	const optionsMap = {
		user: {
			name: "user",
			label: "Użytkownicy",
			labelSingle: "Użytkownika",
			headers: [
				"ID",
				"Imię",
				"Nazwisko",
				"Email",
				"Ostatnie logowanie",
				"Aktywny",
			],
			buttonAdd: "Dodaj użytkownika",
			forms: {
				first_field: {
					title: "Email",
					label: "Email",
					name: "email",
				},
			},
			payload: (data: any) => ({
				email: data.email,
				password: data.password,
				first_name: data.first_name,
				last_name: data.last_name,
			}),
		},
		event_types: {
			name: "event_types",
			label: "Typy wydarzeń",
			labelSingle: "Typ wydarzenia",
			headers: ["ID", "Nazwa"],
			buttonAdd: "Dodaj typ wydarzenia",
			forms: {
				first_field: {
					title: "Typ wydarzenia",
					label: "Nazwa",
					name: "event_type",
				},
			},
			payload: (data: any) => ({
				event_type: data.event_type,
			}),
		},
		event_colors: {
			name: "event_colors",
			label: "Kolory wydarzeń",
			labelSingle: "Kolor wydarzenia",
			headers: ["ID", "Hex koloru"],
			buttonAdd: "Dodaj kolor wydarzenia",
			forms: {
				first_field: {
					title: "Kolor",
					label: "Hex koloru",
					name: "event_color",
					helperText: "Podaj hex koloru bez #, np. 00FF00",
				},
			},
			payload: (data: any) => ({
				event_color: data.event_color,
			}),
		},
	};

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
					options={Object.keys(optionsMap).map((key, index) => ({
						id: index,
						option: key,
						label: optionsMap[key as keyof typeof optionsMap].label,
					}))}
					setSelectedOption={setSelectedOption}
					selectedOption={selectedOption}
				/>
			</Box>

			<ModeratorPanelDataManagementTable
				option={optionsMap[selectedOption]}
				refresh={refresh}
				setRefresh={setRefresh}
			/>
			<Divider sx={{ marginBottom: "20px" }} />
			<Button variant="contained" color="primary" onClick={handleClick}>
				{optionsMap[selectedOption].buttonAdd}
			</Button>
			{open && (
				<CreateForPanelDataModal
					option={optionsMap[selectedOption]}
					open={open}
					setOpen={setOpen}
					setRefresh={setRefresh}
				/>
			)}
		</Box>
	);
}
