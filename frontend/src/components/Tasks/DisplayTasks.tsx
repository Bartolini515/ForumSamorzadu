import { Box, Chip, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import AxiosInstance from "../AxiosInstance";
import { useAlert } from "../../contexts/AlertContext";
import MyButton from "../forms/MyButton";
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
									// color={task.completion_status ? "success" : "error"}
									color={"primary"}
									onClick={
										user?.id == (task.user_id ? task.user_id : null) || isAdmin
											? () =>
													handleCompletionStatusClick(
														task.id,
														task.completion_status
													)
											: undefined
									}
									sx={{ zIndex: 3 }}
								/>
								<Box
									sx={{
										position: "absolute",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: task.user_id
											? statusMap[
													task.completion_status.toString() as "true" | "false"
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
											color: task.user_id
												? statusMap[
														task.completion_status.toString() as
															| "true"
															| "false"
												  ].color
												: "#e7e7e7",
										}}
									>
										{task.user_id
											? statusMap[
													task.completion_status.toString() as "true" | "false"
											  ].statusText
											: "Nieprzypisane"}
									</Typography>
								</Box>
							</Box>

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
										dni
									</Typography>{" "}
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
