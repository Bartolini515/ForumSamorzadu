import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useState, useEffect } from "react";
import AxiosInstance from "../AxiosInstance";
import { Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TasksList from "../lists/TasksList";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: { xs: "80%", sm: "600px" },
	bgcolor: "background.paper",
	border: "2px solid #000",
	borderRadius: 4,
	boxShadow: 24,
	p: 4,
};

interface Props {
	id: string;
	setClickedEventId: any;
	setAlertOpen: any;
}

export default function EventDetails(props: Props) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		props.setClickedEventId("");
	};

	const [events, setEvents] = useState<any>([]);

	const GetData = () => {
		AxiosInstance.get(`timetable/${props.id}`)
			.then((response) => {
				setEvents(response.data);
				handleOpen();
			})
			.catch((error: any) => {
				console.log(error);
				props.setAlertOpen(true);
			});
	};

	useEffect(() => {
		GetData();
	}, [props.id]);
	return (
		<div>
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
							<Box sx={{ marginLeft: "10px" }}>{events.title}</Box>
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
							<Box sx={{ marginLeft: "10px" }}>{events.className}</Box>
						</Box>
						{events.end ? (
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
									<Box sx={{ marginLeft: "10px" }}>{events.start}</Box>
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
									<Box sx={{ marginLeft: "10px" }}>{events.end}</Box>
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
								<Box sx={{ marginLeft: "10px" }}>{events.start}</Box>
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
							<Box sx={{ marginLeft: "10px" }}>{events.creator}</Box>
						</Box>
						{events.description ? (
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
									<Box sx={{ marginLeft: "10px" }}>{events.description}</Box>
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
									<TasksList tasks={events.tasks} />
								</Box>
							</Box>
						</Box>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
}
