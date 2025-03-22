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
	user_id: number | null;
}

interface Props {
	tasks: Task[];
	refresh: boolean;
	setRefresh: any;
}

export default function DisplayTasks(props: Props) {
	const { user, isAdmin } = useAuth();
	const { setAlert } = useAlert();

	const ChangeStatus = (id: number, completion_status: boolean) => {
		AxiosInstance.put(`tasks/${id}/update_status/`, {
			completion_status: completion_status ? false : true,
		})
			.then((response) => {
				setAlert(response.data.message, "success");
				props.setRefresh(true);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	const ChangeAssigned = (id: number, user_id: number | null) => {
		const payload = user_id ? { user_id: null } : { user_id: user?.id };
		AxiosInstance.put(`tasks/${id}/update_assigned/`, payload)
			.then((response) => {
				setAlert(response.data.message, "success");
				props.setRefresh(true);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	const handleCompletionStatusClick = (
		id: number,
		completion_status: boolean
	) => {
		ChangeStatus(id, completion_status);
	};
	const handleTakeTask = (id: number, user_id: number | null) => {
		ChangeAssigned(id, user_id ? user_id : null);
	};

	return (
		<>
			{props.tasks.length > 0 && (
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
								onClick={
									user?.id == (task.user_id ? task.user_id : null) || isAdmin
										? () =>
												handleCompletionStatusClick(
													task.id,
													task.completion_status
												)
										: undefined
								}
							/>

							<Box>
								<Typography
									sx={{
										overflow: "auto",
										maxWidth: "300px",
										maxHeight: "100px",
									}}
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

							{(task.user === null ||
								(task.user_id && task.user_id === user?.id)) && (
								<MyButton
									label={task.user ? "Oddaj zadanie" : "Przypisz do siebie"}
									color="primary"
									type={"button"}
									style={{ marginTop: "auto" }}
									onClick={() => {
										handleTakeTask(task.id, task.user_id);
									}}
								/>
							)}
						</Box>
					))}
				</Box>
			)}
		</>
	);
}
