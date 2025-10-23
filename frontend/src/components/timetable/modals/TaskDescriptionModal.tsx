import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import { Box, Button, Typography, Fade, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState } from "react";
import AlertDialog from "../../../UI/dialogs/AlertDialog";
import AxiosInstance from "../../AxiosInstance";
import { useAlert } from "../../../contexts/AlertContext";
import { useCustomTheme } from "../../../contexts/ThemeContext";

interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
}

interface Props {
	task_id: number | null;
	task_description: string | null;
	task_due_date: string | null;
	task_assigned: User[];
	task_completion_Status: boolean | null;
	is_creator: boolean;
	isAdmin: boolean;
	onClose: () => void;
}

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: { xs: "60%", sm: "400px" },
	height: "90%",
	maxHeight: "max-content",
	overflow: "auto",
	bgcolor: "background.paper",
	border: "2px solid #000",
	borderRadius: 4,
	boxShadow: 24,
	p: 4,
};

export default function TaskDescriptionModal(props: Props) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const { mode } = useCustomTheme();
	const { setAlert } = useAlert();

	const DeleteTask = (id: number) => {
		AxiosInstance.delete(`tasks/${id}/`)
			.then((response) => {
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

	const handleDelete = () => {
		setOpenDialog(true);
	};

	return (
		<div>
			<Modal
				aria-labelledby="TaskDescription-modal-title"
				aria-describedby="TaskDescription-modal-description"
				open={true}
				onClose={props.onClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={true}>
					<Box sx={style}>
						<Button
							sx={{
								position: "absolute",
								right: "2px",
								top: "4px",
								zIndex: 9999,
								padding: "0px",
								minWidth: "0px",
							}}
							onClick={props.onClose}
						>
							<CloseIcon sx={{ color: "red" }} fontSize="medium" />
						</Button>

						{(props.is_creator || props.isAdmin) && (
							<Button
								sx={{
									position: "absolute",
									left: "2px",
									top: "4px",
									zIndex: 9999,
									padding: "0px",
									minWidth: "0px",
								}}
								onClick={() => {
									handleDelete();
								}}
							>
								<DeleteForeverIcon sx={{ color: "red" }} fontSize="medium" />
							</Button>
						)}

						<Typography
							id="TaskDescription-modal-title"
							variant="h6"
							component="h1"
							sx={{
								mb: 0.5,
								fontWeight: "bold",
								color: mode === "light" ? "#2c3e50" : "#ffffff",
							}}
						>
							{props.task_assigned.length > 1
								? "Przypisane osoby"
								: "Przypisana osoba"}
						</Typography>

						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
							{props.task_assigned.length > 0 ? (
								props.task_assigned.map((user) => (
									<Chip
										key={user.id}
										label={`${user.first_name} ${user.last_name}`}
									/>
								))
							) : (
								<Typography
									sx={{ color: mode === "light" ? "#34495e" : "#bdc3c7" }}
								>
									Brak
								</Typography>
							)}
						</Box>

						{/* <Typography
							id="TaskDescription-modal-description"
							component="p"
							sx={{ mb: 3, color: "#34495e", lineHeight: 0.5 }}
						>
							{props.task_assigned ? props.task_assigned : "Brak"}
						</Typography> */}

						{props.task_due_date && (
							<>
								<Typography
									id="TaskDescription-modal-title"
									variant="h6"
									component="h1"
									sx={{
										mb: 1,
										fontWeight: "bold",
										color: mode === "light" ? "#2c3e50" : "#ffffff",
									}}
								>
									Termin ukończenia
								</Typography>
								<Typography
									id="TaskDescription-modal-description"
									component="p"
									sx={{
										mb: 3,
										color: mode === "light" ? "#34495e" : "#bdc3c7",
									}}
								>
									{props.task_due_date ? props.task_due_date : "Brak"}
								</Typography>
							</>
						)}

						<Typography
							id="TaskDescription-modal-title"
							variant="h6"
							component="h1"
							sx={{
								mb: 1,
								fontWeight: "bold",
								color: mode === "light" ? "#2c3e50" : "#ffffff",
							}}
						>
							Status zadania
						</Typography>
						<Typography
							id="TaskDescription-modal-description"
							component="p"
							sx={{
								mb: 3,
								color: mode === "light" ? "#34495e" : "#bdc3c7",
								lineHeight: 0.5,
							}}
						>
							{props.task_completion_Status ? "Ukończone" : "Nieukończone"}
						</Typography>

						<Typography
							id="TaskDescription-modal-title"
							variant="h6"
							component="h1"
							sx={{
								mb: 1,
								fontWeight: "bold",
								color: mode === "light" ? "#2c3e50" : "#ffffff",
							}}
						>
							Opis zadania
						</Typography>
						<Typography
							id="TaskDescription-modal-description"
							component="p"
							sx={{
								mb: 3,
								color: mode === "light" ? "#34495e" : "#bdc3c7",
								lineHeight: 1.6,
								maxHeight: "200px",
								maxWidth: "100%",
								overflowY: "auto",
								overflowWrap: "break-word",
							}}
						>
							{props.task_description ? props.task_description : "Brak"}
						</Typography>

						{openDialog && (
							<AlertDialog
								open={openDialog}
								onClose={() => setOpenDialog(false)}
								label={"Czy na pewno chcesz usunąć zadanie?"}
								content={"Nie będziesz mógł cofnąć tej akcji."}
								onCloseOption2={() => {
									if (props.task_id) {
										DeleteTask(props.task_id);
										props.onClose();
									}
									setOpenDialog(false);
								}}
							/>
						)}
					</Box>
				</Fade>
			</Modal>
		</div>
	);
}
