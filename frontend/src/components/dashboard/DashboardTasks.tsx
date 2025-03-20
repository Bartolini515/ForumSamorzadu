import { Box, Chip, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import AxiosInstance from "../AxiosInstance";
import { useAlert } from "../../contexts/AlertContext";
import MyButton from "../forms/MyButton";

interface Task {
	id: number;
	task_name: string;
	description: string | null;
	user: string | null;
	completion_status: boolean;
	due_date: string | null;
	event: string | null;
	user_id: string | null;
}

interface Props {
	tasks: Task[];
}

export default function Schedule(props: Props) {
	return (
		<Box
			sx={{
				boxShadow: 3,
				padding: "20px",
				display: "flex",
				flexDirection: "row",
				flexWrap: "wrap",
				justifyContent: "center",
				gap: "20px",
			}}
		>
			{props.tasks.map((task) => (
				<Box
					key={task.id}
					sx={{
						boxShadow: 3,
						padding: "20px",
						display: "flex",
						flexDirection: "column",
						minHeight: "350px",
						maxHeight: "max-content",
						minWidth: "300px",
						gap: "10px",
					}}
				>
					<Chip
						label={<Typography variant="h6">{task.task_name}</Typography>}
						color={task.completion_status ? "success" : "error"}
					/>

					<Box>
						<Typography
							sx={{ overflow: "auto", maxWidth: "300px", maxHeight: "100px" }}
							component="div"
						>
							{" "}
							<Typography
								sx={{ fontWeight: "bold", padding: "0px", margin: "0px" }}
								component="div"
							>
								Opis:
							</Typography>{" "}
							{task.description ? task.description : "Brak"}
						</Typography>
					</Box>
					<Typography component="div">
						<Typography sx={{ fontWeight: "bold" }} component="span">
							Wydarzenie:
						</Typography>{" "}
						{task.event ? task.event : "Bez wydarzenia"}
					</Typography>
					<Typography component="div">
						<Typography sx={{ fontWeight: "bold" }} component="span">
							Przypisane do:
						</Typography>{" "}
						{task.user ? task.user : "Nieprzypisane"}
					</Typography>

					{task.due_date && (
						<Typography component="div">
							<Typography sx={{ fontWeight: "bold" }} component="span">
								Termin:
							</Typography>{" "}
							{task.due_date}
						</Typography>
					)}
				</Box>
			))}
		</Box>
	);
}
