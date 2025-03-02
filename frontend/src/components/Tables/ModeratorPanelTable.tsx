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
import { red } from "@mui/material/colors";
import { useAlert } from "../../contexts/AlertContext";

interface Props {
	headers: string[];
	option: any;
	refresh: boolean;
	setRefresh: any;
}

export default function ModeratorPanelTable(props: Props) {
	const [data, setData] = useState<{ id: number; [key: string]: any }[]>([]);
	const [loading, setLoading] = useState(true);
	const { setAlert } = useAlert();

	const GetData = () => {
		AxiosInstance.get(`moderator_panel/${props.option}/`)
			.then((response) => {
				const sortedData = response.data.sort((a: any, b: any) => a.id - b.id);
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

	const handleClick = (id: any) => {
		DeleteData(id);
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
										<IconButton onClick={() => handleClick(row.id)}>
											<DeleteForeverIcon sx={{ color: red["600"] }} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	);
}
