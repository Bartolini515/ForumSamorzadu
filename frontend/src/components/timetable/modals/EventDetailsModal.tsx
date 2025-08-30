import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useState, useEffect } from "react";
import AxiosInstance from "../../AxiosInstance";
import { Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TasksList from "../../../UI/lists/TasksList";
import MyButton from "../../../UI/forms/MyButton";
import { useAuth } from "../../../contexts/AuthContext";
import { useAlert } from "../../../contexts/AlertContext";
import ModifyEventModal from "./ModifyEventModal";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CreateTaskModal from "../../Tasks/CreateTaskModal";
import AlertDialog from "../../../UI/dialogs/AlertDialog";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: { xs: "80%", sm: "600px" },
	height: "90%",
	maxHeight: "max-content",
	overflow: "auto",
	bgcolor: "background.paper",
	border: "2px solid #000",
	borderRadius: 4,
	boxShadow: 24,
	p: 4,
};

interface Props {
	id: number;
	setClickedEventId: any;
	onClose: () => void;
}

interface EventData {
	id: number;
	title: string;
	start: string;
	end: string | null;
	event_type: string;
	event_color: string;
	description: string;
	creator: string;
	creator_id: string;
	tasks: {
		id: string;
		task_name: string;
		task_description: string;
		assigned: string;
		completion_status: boolean;
		due_date: string;
	}[];
	is_creator: boolean;
}

export default function EventDetails(props: Props) {
	const [open, setOpen] = useState<boolean>(false);
	const [openModify, setOpenModify] = useState<boolean>(false);
	const [openCreateTask, setOpenCreateTask] = useState<boolean>(false);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [refresh, setRefresh] = useState<boolean>(false);
	const [event, setEvent] = useState<EventData>({
		id: 0,
		title: "",
		start: "",
		end: null,
		event_type: "",
		event_color: "",
		description: "",
		creator: "",
		creator_id: "",
		tasks: [],
		is_creator: false,
	});

	const { isAdmin } = useAuth();
	const { setAlert } = useAlert();

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		props.setClickedEventId("");
		props.onClose();
	};
	const handleDeleteClick = () => {
		setOpenDialog(true);
	};
	const handleModifyClick = () => {
		setOpenModify(true);
	};

	const GetData = () => {
		AxiosInstance.get(`timetable/${props.id}`)
			.then((response) => {
				setEvent(response.data);
				handleOpen();
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

	const DeleteData = () => {
		AxiosInstance.delete(`timetable/${props.id}/`)
			.then((response) => {
				handleClose();
				setAlert(response.data.message, "success");
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

	useEffect(() => {
		GetData();
	}, [props.id, refresh]);
	function handleAddTaskClick() {
		setOpenCreateTask(true);
	}

	return (
		<>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={open}>
					<Box sx={style}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginBottom: 2,
							}}
						>
							<Typography
								id="transition-modal-title"
								variant="h5"
								component="h2"
							>
								Szczegóły
							</Typography>
						</Box>
						<Button
							sx={{
								position: "absolute",
								right: "2px",
								top: "4px",
								zIndex: 2,
								padding: "0px",
								minWidth: "0px",
							}}
							onClick={handleClose}
						>
							<CloseIcon sx={{ color: "red" }} fontSize="medium" />
						</Button>
						<Box
							sx={{
								boxShadow: 3,
								padding: "20px",
								display: "flex",
								flexDirection: "row",
								marginBottom: "20px",
							}}
						>
							<Box sx={{ fontWeight: "bold", alignContent: "center" }}>
								Nazwa:{" "}
							</Box>
							<Box sx={{ marginLeft: "10px" }}>{event.title}</Box>
						</Box>

						<Box
							sx={{
								boxShadow: 3,
								padding: "20px",
								display: "flex",
								flexDirection: "row",
								marginBottom: "20px",
							}}
						>
							<Box sx={{ fontWeight: "bold", alignContent: "center" }}>
								Typ:{" "}
							</Box>
							<Box sx={{ marginLeft: "10px" }}>{event.event_type}</Box>
						</Box>
						{event.end ? (
							<>
								<Box
									sx={{
										boxShadow: 3,
										padding: "20px",
										display: "flex",
										flexDirection: "row",
										marginBottom: "20px",
									}}
								>
									<Box sx={{ fontWeight: "bold", alignContent: "center" }}>
										Data rozpoczęcia:{" "}
									</Box>
									<Box sx={{ marginLeft: "10px" }}>{event.start}</Box>
								</Box>

								<Box
									sx={{
										boxShadow: 3,
										padding: "20px",
										display: "flex",
										flexDirection: "row",
										marginBottom: "20px",
									}}
								>
									<Box sx={{ fontWeight: "bold", alignContent: "center" }}>
										Data zakończenia:{" "}
									</Box>
									<Box sx={{ marginLeft: "10px" }}>{event.end}</Box>
								</Box>
							</>
						) : (
							<Box
								sx={{
									boxShadow: 3,
									padding: "20px",
									display: "flex",
									flexDirection: "row",
									marginBottom: "20px",
								}}
							>
								<Box sx={{ fontWeight: "bold", alignContent: "center" }}>
									Data:{" "}
								</Box>
								<Box sx={{ marginLeft: "10px" }}>{event.start}</Box>
							</Box>
						)}
						<Box
							sx={{
								boxShadow: 3,
								padding: "20px",
								display: "flex",
								flexDirection: "row",
								marginBottom: "20px",
							}}
						>
							<Box sx={{ fontWeight: "bold", alignContent: "center" }}>
								Utworzył(a):{" "}
							</Box>
							<Box sx={{ marginLeft: "10px", fontStyle: "italic" }}>
								{event.creator ? event.creator : "Usunięty użytkownik"}
							</Box>
						</Box>
						{event.description ? (
							<>
								<Box
									sx={{
										boxShadow: 3,
										padding: "20px",
										display: "flex",
										flexDirection: "row",
										marginBottom: "20px",
									}}
								>
									<Box sx={{ fontWeight: "bold", alignContent: "center" }}>
										Opis:{" "}
									</Box>
									<Box
										sx={{
											marginLeft: "10px",
											maxHeight: "200px",
											maxWidth: "100%",
											overflowY: "auto",
											overflowWrap: "break-word",
										}}
									>
										{event.description}
									</Box>
								</Box>
							</>
						) : (
							<></>
						)}

						<Box
							sx={{
								boxShadow: 3,
								padding: "20px",
								display: "flex",
								flexDirection: "row",
								marginBottom: "20px",
							}}
						>
							<Box sx={{ fontWeight: "bold", alignContent: "center" }}>
								Zadania:
							</Box>
							<Box
								sx={{
									marginLeft: "10px",
									fontWeight: "normal",
									marginTop: "6px",
								}}
							>
								{event.tasks && event.tasks.length > 0 ? (
									<TasksList
										tasks={event.tasks}
										is_creator={event.is_creator}
										isAdmin={isAdmin}
										onClose={() => {
											setRefresh(!refresh);
										}}
									/>
								) : (
									"Brak zadań"
								)}
							</Box>
							{(event.end ? event.end : event.start) >=
								new Date().toISOString().split("T")[0] && (
								<IconButton onClick={handleAddTaskClick}>
									<AddCircleOutlineOutlinedIcon fontSize="small" />
								</IconButton>
							)}
						</Box>

						{(event.is_creator || isAdmin) && (
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<MyButton
									label="Usuń"
									type="button"
									color="error"
									onClick={handleDeleteClick}
								/>
								<MyButton
									label="Modyfikuj"
									type="button"
									color="primary"
									onClick={handleModifyClick}
								/>
							</Box>
						)}
						{openDialog && (
							<AlertDialog
								open={openDialog}
								onClose={() => setOpenDialog(false)}
								label="Czy na pewno chcesz usunąć wydarzenie?"
								content="Nie będziesz mógł odwrócić tej akcji."
								onCloseOption2={() => {
									DeleteData();
									setOpenDialog(false);
								}}
							/>
						)}

						{openModify && (
							<ModifyEventModal
								id={props.id}
								event={event}
								open={openModify}
								onClose={() => {
									setRefresh(!refresh);
									setOpenModify(false);
								}}
							/>
						)}

						{openCreateTask && (
							<CreateTaskModal
								open={openCreateTask}
								onClose={() => {
									setRefresh(!refresh);
									setOpenCreateTask(false);
								}}
								event_id={props.id}
							/>
						)}
					</Box>
				</Fade>
			</Modal>
		</>
	);
}
