import { Box, Chip, Typography } from "@mui/material";
import MyButton from "../../UI/forms/MyButton";
import { useNavigate } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";

interface Task {
	id: number;
	task_name: string;
	description: string | null;
	users: number[] | null;
	completion_status: boolean;
	due_date: string | null;
	event: string | null;
	event_id: number | null;
	user_id: number | null;
	color: string;
}

interface Props {
	tasks: Task[];
}

const getContrastingColor = (hex: string) => {
	// Remove the hash if it exists
	const cleanHex = hex.replace("#", "");

	// Convert hex to RGB
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);

	// Calculate luminance
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	// Return black or white based on luminance
	return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

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
					style={{ color: "inherit", textDecoration: "underline" }}
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
							sx={{
								backgroundColor: `#${task.color || "1976d2"}`,
								color: getContrastingColor(task.color || "1976d2"),
							}}
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
								{differenceInCalendarDays(
									new Date(task.due_date),
									new Date()
								) === 1
									? "dzień"
									: "dni"}
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
