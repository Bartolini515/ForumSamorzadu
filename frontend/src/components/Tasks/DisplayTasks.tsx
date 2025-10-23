import { Box, Chip, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import AxiosInstance from "../AxiosInstance";
import { useAlert } from "../../contexts/AlertContext";
import MyButton from "../../UI/forms/MyButton";
import { differenceInCalendarDays } from "date-fns";
import AlertDialog from "../../UI/dialogs/AlertDialog";
import { useState } from "react";

interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
}

interface Event {
	id: number;
	event_name: string;
	event_color: string;
}

interface Task {
	id: number;
	task_name: string;
	description: string | null;
	users: User[];
	completion_status: boolean;
	due_date: string;
	event: Event;
	max_users: number;
}

interface Props {
	tasks: Task[];
	refresh: boolean;
	setRefresh: any;
}

const statusMap = {
	true: {
		backgroundColor: "#44FF44",
		color: "#464646",
		statusText: "Ukończone",
	},
	false: {
		backgroundColor: "#FF4444",
		color: "#242424",
		statusText: "Nieukończone",
	},
};

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

export default function DisplayTasks(props: Props) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [changeStatusId, setChangeStatusId] = useState<number>(0);
	const [changeStatusCompletionStatus, setChangeStatusCompletionStatus] =
		useState<boolean>(false);
	const [deleteTaskId, setDeleteTaskId] = useState<number>(0);

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
				setAlert(
					error.response.data.message
						? error.response.data.message
						: error.message,
					"error"
				);
			});
	};

	const ChangeAssigned = (id: number, users: number[]) => {
		if (users.includes(user!.id)) {
			users = users.filter((userId) => userId !== user!.id);
		} else {
			users.push(user!.id);
		}
		const payload = { users: users };
		AxiosInstance.put(`tasks/${id}/update_assigned/`, payload)
			.then((response) => {
				setAlert(response.data.message, "success");
				props.setRefresh(true);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(
					error.response.data.message
						? error.response.data.message
						: error.message,
					"error"
				);
			});
	};

	const DeleteTask = (id: number) => {
		AxiosInstance.delete(`tasks/${id}/`)
			.then((response) => {
				setAlert(response.data.message, "success");
				props.setRefresh(true);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(
					error.response.data.message
						? error.response.data.message
						: error.message,
					"error"
				);
			});
	};

	const handleCompletionStatus = (id: number, completion_status: boolean) => {
		setChangeStatusId(id);
		setChangeStatusCompletionStatus(completion_status);
		setOpenDialog(true);
	};

	const handleTakeTask = (id: number, users: User[]) => {
		ChangeAssigned(
			id,
			users.map((user) => user.id)
		);
	};

	const handleDeleteTask = (id: number) => {
		setDeleteTaskId(id);
		setOpenDialog(true);
	};

	return (
		<>
			{props.tasks.length > 0 && (
				<Box
					sx={{
						boxShadow: 0,
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
								maxWidth: "450px",
								gap: "10px",
							}}
						>
							<Box
								sx={{
									display: "flex",
									position: "relative",
									flexDirection: "column",
									marginBottom: "10px",
								}}
							>
								<Chip
									label={<Typography variant="h6">{task.task_name}</Typography>}
									sx={{
										zIndex: 3,
										backgroundColor: `#${task.event.event_color || "1976d2"}`,
										color: getContrastingColor(
											task.event.event_color || "1976d2"
										),
									}}
								/>
								<Box
									sx={{
										position: "absolute",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor:
											task.users.length > 0
												? statusMap[
														task.completion_status.toString() as
															| "true"
															| "false"
												  ].backgroundColor
												: "#686868",
										marginTop: 0,
										top: "17px",
										width: "90%",
										left: "5%",
										textAlign: "center",
										borderRadius: "0 0 100% 100%",
										zIndex: 2,
										paddingTop: "11px",
										display: "flex",
									}}
								>
									<Typography
										sx={{
											fontSize: "0.8rem",
											marginTop: "2px",
											textAlign: "center",
											fontWeight: "600",
											color:
												task.users.length > 0
													? statusMap[
															task.completion_status.toString() as
																| "true"
																| "false"
													  ].color
													: "#e7e7e7",
										}}
									>
										{task.users.length > 0
											? statusMap[
													task.completion_status.toString() as "true" | "false"
											  ].statusText
											: "Nieprzypisane"}
									</Typography>
								</Box>
							</Box>

							<Box>
								<Typography
									sx={{ fontWeight: "bold", padding: "0px", margin: "0px" }}
									component="div"
								>
									Opis:
								</Typography>{" "}
								<Typography
									sx={{
										overflow: "auto",
										maxWidth: "300px",
										maxHeight: "100px",
										overflowY: "auto",
										overflowWrap: "break-word",
									}}
									component="div"
								>
									{task.description ? task.description : "Brak"}
								</Typography>
							</Box>
							<Typography component="div">
								<Typography sx={{ fontWeight: "bold" }} component="span">
									Wydarzenie:
								</Typography>{" "}
								{task.event.event_name}
							</Typography>
							<Typography component="div">
								<Typography sx={{ fontWeight: "bold" }} component="span">
									Przypisane do:
								</Typography>{" "}
								{task.users.length > 0
									? task.users
											.map((user) => user.first_name + " " + user.last_name)
											.join(", ")
									: "Nieprzypisane"}
							</Typography>
							<Typography component="div">
								<Typography sx={{ fontWeight: "bold" }} component="span">
									Liczba przypisanych osób:
								</Typography>{" "}
								{task.users.length} / {task.max_users}
							</Typography>

							{task.due_date && (
								<Typography component="div">
									<Typography sx={{ fontWeight: "bold" }} component="span">
										Termin:
									</Typography>{" "}
									{task.due_date}
									<Typography
										sx={{
											fontStyle: "italic",
											fontSize: "0.8rem",
											marginLeft: "5px",
										}}
										component="span"
									>
										za{" "}
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
									</Typography>{" "}
								</Typography>
							)}

							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									marginTop: "auto",
								}}
							>
								{((task.completion_status === false &&
									task.users.length > 0 &&
									task.users.some((user_e) => user_e.id === user?.id)) ||
									(task.users.length > 0 && isAdmin)) && (
									<MyButton
										label={
											task.completion_status
												? "Oznacz jako nieukończone"
												: "Oznacz jako ukończone"
										}
										color={task.completion_status ? "error" : "success"}
										type={"button"}
										style={{ marginBottom: "10px", marginTop: "0px" }}
										onClick={() => {
											handleCompletionStatus(task.id, task.completion_status);
										}}
									/>
								)}
								{(task.users.length < task.max_users ||
									(task.users.length > 0 &&
										task.users.some((user_e) => user_e.id === user?.id) &&
										task.completion_status === false)) && (
									<MyButton
										label={
											task.users.some((user_e) => user_e.id === user?.id)
												? "Zrezygnuj z zadania"
												: "Przypisz do siebie"
										}
										color="secondary"
										type={"button"}
										style={{ marginBottom: "10px", marginTop: "0px" }}
										onClick={() => {
											handleTakeTask(task.id, task.users);
										}}
									/>
								)}
								{(isAdmin ||
									user?.created_events.find(
										(event_id) => event_id === task.event.id
									)) && (
									<MyButton
										label={"Usuń zadanie"}
										color="error"
										type={"button"}
										style={{ marginBottom: "10px", marginTop: "0px" }}
										onClick={() => {
											handleDeleteTask(task.id);
										}}
									/>
								)}
							</Box>
						</Box>
					))}
				</Box>
			)}
			{openDialog && (
				<AlertDialog
					open={openDialog}
					onClose={() => {
						setOpenDialog(false);
						setDeleteTaskId(0);
						setChangeStatusId(0);
						setChangeStatusCompletionStatus(false);
					}}
					label={
						deleteTaskId
							? "Czy na pewno chcesz usunąć zadanie?"
							: changeStatusCompletionStatus
							? "Czy na pewno chcesz oznaczyć zadanie jako nieukończone?"
							: "Czy na pewno chcesz ukończyć zadanie?"
					}
					content={
						deleteTaskId
							? "Usunięcie zadania jest permanentne i nie można go cofnąć."
							: changeStatusCompletionStatus
							? " "
							: "Nie będziesz mógł cofnąć tej akcji, bez skontaktowania się z przewodniczącym."
					}
					onCloseOption2={() => {
						if (deleteTaskId) {
							DeleteTask(deleteTaskId);
							setOpenDialog(false);
							setDeleteTaskId(0);
						} else {
							ChangeStatus(changeStatusId, changeStatusCompletionStatus);
						}
						setOpenDialog(false);
					}}
				/>
			)}
		</>
	);
}
