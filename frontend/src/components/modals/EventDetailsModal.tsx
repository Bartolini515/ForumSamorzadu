import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useState, useEffect } from "react";
import AxiosInstance from "../AxiosInstance";
import { Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TasksList from "../lists/TasksList";
import MyButton from "../forms/MyButton";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import ModifyEventModal from "./ModifyEventModal";

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
	id: string;
	setClickedEventId: any;
	onClose: () => void;
}

interface EventData {
	id: string;
	title: string;
	start: string;
	end: string | null;
	className: string;
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
	const [open, setOpen] = useState(false);
	const [openModify, setOpenModify] = useState(false);
	const [event, setEvent] = useState<EventData>({
		id: "",
		title: "",
		start: "",
		end: null,
		className: "",
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
		DeleteData();
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
				setAlert(error.message, "error");
			});
	};

	const DeleteData = () => {
		AxiosInstance.delete(`timetable/delete/${props.id}/`)
			.then((response) => {
				handleClose();
				setAlert(response.data.message, "success");
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	useEffect(() => {
		GetData();
	}, [props.id]);
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
							<Box sx={{ fontWeight: "bold" }}>Nazwa: </Box>
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
							<Box sx={{ fontWeight: "bold" }}>Typ: </Box>
							<Box sx={{ marginLeft: "10px" }}>{event.className}</Box>
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
									<Box sx={{ fontWeight: "bold" }}>Data rozpoczęcia: </Box>
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
									<Box sx={{ fontWeight: "bold" }}>Data zakończenia: </Box>
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
								<Box sx={{ fontWeight: "bold" }}>Data: </Box>
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
							<Box sx={{ fontWeight: "bold" }}>Utworzył(a): </Box>
							<Box sx={{ marginLeft: "10px" }}>{event.creator}</Box>
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
									<Box sx={{ fontWeight: "bold" }}>Opis: </Box>
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
							<Box sx={{ fontWeight: "bold" }}>
								Zadania:
								<Box sx={{ marginLeft: "10px", fontWeight: "normal" }}>
									<TasksList tasks={event.tasks} />
								</Box>
							</Box>
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

						{openModify && (
							<ModifyEventModal
								id={props.id}
								event={event}
								open={openModify}
								onClose={() => {
									handleClose();
									setOpenModify(false);
								}}
							/>
						)}
					</Box>
				</Fade>
			</Modal>
		</>
	);
}
