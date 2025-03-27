import { Box, Chip, Typography } from "@mui/material";
import MyButton from "../forms/MyButton";
import { useNavigate } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";

interface Task {
	id: number;
	task_name: string;
	description: string | null;
	user: string | null;
	completion_status: boolean;
	due_date: string | null;
	event: string | null;
	user_id: number | null;
}

interface Props {
	tasks: Task[];
}

export default function DashboardTasks(props: Props) {
	const navigate = useNavigate();

	return (
		<>
			<Box
				sx={{
					position: "relative",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Typography variant="h5">Twoje najbliższe zadania</Typography>
				<MyButton
					label={"Zobacz wszystkie zadania"}
					type={"button"}
					variant="text"
					onClick={() => {
						navigate("/tasks");
					}}
					style={{ color: "black", textDecoration: "underline" }}
				></MyButton>
			</Box>
			<Box
				sx={{
					boxShadow: 0,
					padding: "20px",
					paddingTop: "5px",
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
							padding: "5px",
							display: "flex",
							flexDirection: "column",
							maxHeight: "max-content",
							minWidth: "max-content",
							gap: "5px",
						}}
					>
						<Chip
							label={<Typography>{task.task_name}</Typography>}
							// color={task.completion_status ? "success" : "error"}
							color="primary"
						/>
						{task.due_date && (
							<Typography
								sx={{
									fontStyle: "italic",
									fontSize: "0.8rem",
								}}
								component="div"
							>
								{" "}
								Termin za{" "}
								{differenceInCalendarDays(
									new Date(task.due_date),
									new Date()
								)}{" "}
								dni
							</Typography>
						)}

						{/* <Box>
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
						)} */}
					</Box>
				))}
			</Box>
		</>
	);
}
