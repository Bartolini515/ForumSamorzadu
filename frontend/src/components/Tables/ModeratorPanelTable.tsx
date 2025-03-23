import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
} from "@mui/material";
import AxiosInstance from "../AxiosInstance";
import { useEffect, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { blue, red } from "@mui/material/colors";
import { useAlert } from "../../contexts/AlertContext";
import ModifyUserOrEvent from "../modals/ModifyUserOrEventModal";
import { toDate } from "date-fns";

interface Props {
	headers: string[];
	option: any;
	refresh: boolean;
	setRefresh: any;
}

export default function ModeratorPanelTable(props: Props) {
	const [data, setData] = useState<{ id: number; [key: string]: any }[]>([]);
	const [clickedId, setClickedId] = useState<string>("");
	const [open, setOpen] = useState<boolean>(false);

	const [loading, setLoading] = useState(true);
	const { setAlert } = useAlert();

	const GetData = () => {
		AxiosInstance.get(`moderator_panel/${props.option}/`)
			.then((response) => {
				const sortedData = response.data.sort((a: any, b: any) => a.id - b.id);
				if (props.option === "user") {
					sortedData.forEach((element: any) => {
						element["last_login"]
							? (element["last_login"] = toDate(
									new Date(element["last_login"])
							  ).toLocaleString())
							: (element["last_login"] = "Brak logowania");
					});
				}
				setData(sortedData);

				props.setRefresh(false);
				setLoading(false);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	useEffect(() => {
		GetData();
	}, [props.option, props.refresh]);

	const DeleteData = (id: number) => {
		AxiosInstance.delete(`moderator_panel/${props.option}/delete/${id}/`)
			.then((response) => {
				props.setRefresh(true);
				setAlert(response.data.message, "success");
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	const handleClickDelete = (id: number) => {
		DeleteData(id);
	};

	const handleClickModify = (id: any) => {
		setClickedId(id);
		setOpen(true);
	};

	return (
		<>
			{loading ? (
				<p>Pobieranie danych</p>
			) : (
				<TableContainer
					component={Paper}
					sx={{
						display: "grid",
						width: "100%",
						overflow: "auto",
						"& .MuiTableCell-root": {
							textAlign: "center",
						},
					}}
				>
					<Table>
						<TableHead>
							<TableRow>
								{props.headers.map((header, index) => (
									<TableCell key={index}>{header}</TableCell>
								))}
								<TableCell>Zmodyfikuj</TableCell>
								<TableCell>Usuń</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row, index) => (
								<TableRow key={index}>
									{Object.keys(row).map((key, cellIndex) => (
										<TableCell key={cellIndex}>{row[key]}</TableCell>
									))}
									<TableCell>
										<IconButton onClick={() => handleClickModify(row.id)}>
											<EditIcon sx={{ color: blue["600"] }}></EditIcon>
										</IconButton>
									</TableCell>
									<TableCell>
										<IconButton onClick={() => handleClickDelete(row.id)}>
											<DeleteForeverIcon sx={{ color: red["600"] }} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			{open && (
				<ModifyUserOrEvent
					option={props.option}
					open={open}
					setOpen={setOpen}
					setRefresh={props.setRefresh}
					id={clickedId}
					setClickedId={setClickedId}
				/>
			)}
		</>
	);
}
