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
import { useAuth } from "../../../contexts/AuthContext";

interface Props {
	note_id: string | null;
	note_title: string | null;
	note_content: string | null;
	note_created_by: string | null;
	note_created_by_id: number | null;
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

export default function NoteDescriptionModal(props: Props) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const { mode } = useCustomTheme();
	const { setAlert } = useAlert();
	const { user } = useAuth();

	const DeleteNote = (id: number) => {
		AxiosInstance.delete(`notes/${id}/`)
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

						{(props.is_creator ||
							props.isAdmin ||
							props.note_created_by_id === user?.id) && (
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
							Twórca notatki
						</Typography>

						<Chip
							sx={{ mb: 3 }}
							label={props.note_created_by ? props.note_created_by : "Brak"}
						/>

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
							Zawartość notatki
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
								whiteSpace: "pre-wrap",
							}}
						>
							{props.note_content ? props.note_content : "Brak"}
						</Typography>

						{openDialog && (
							<AlertDialog
								open={openDialog}
								onClose={() => setOpenDialog(false)}
								label={"Czy na pewno chcesz usunąć notatkę?"}
								content={"Nie będziesz mógł cofnąć tej akcji."}
								onCloseOption2={() => {
									if (props.note_id) {
										DeleteNote(parseInt(props.note_id));
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
