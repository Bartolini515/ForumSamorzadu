import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import { Box, Button, Typography, Fade, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
	task_description: string | null;
	task_due_date: string | null;
	task_assigned: string | null;
	task_completion_Status: boolean | null;
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

						<Typography
							id="TaskDescription-modal-title"
							variant="h6"
							component="h1"
							sx={{ mb: 0.5, fontWeight: "bold", color: "#2c3e50" }}
						>
							Przypisana osoba
						</Typography>

						<Chip
							sx={{ mb: 3 }}
							label={props.task_assigned ? props.task_assigned : "Brak"}
						/>

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
									sx={{ mb: 1, fontWeight: "bold", color: "#2c3e50" }}
								>
									Termin ukończenia
								</Typography>
								<Typography
									id="TaskDescription-modal-description"
									component="p"
									sx={{ mb: 3, color: "#34495e" }}
								>
									{props.task_due_date ? props.task_due_date : "Brak"}
								</Typography>
							</>
						)}

						<Typography
							id="TaskDescription-modal-title"
							variant="h6"
							component="h1"
							sx={{ mb: 1, fontWeight: "bold", color: "#2c3e50" }}
						>
							Status zadania
						</Typography>
						<Typography
							id="TaskDescription-modal-description"
							component="p"
							sx={{ mb: 3, color: "#34495e", lineHeight: 0.5 }}
						>
							{props.task_completion_Status ? "Ukończone" : "Nieukończone"}
						</Typography>

						<Typography
							id="TaskDescription-modal-title"
							variant="h6"
							component="h1"
							sx={{ mb: 1, fontWeight: "bold", color: "#2c3e50" }}
						>
							Opis zadania
						</Typography>
						<Typography
							id="TaskDescription-modal-description"
							component="p"
							sx={{
								mb: 3,
								color: "#34495e",
								lineHeight: 1.6,
								maxHeight: "200px",
								maxWidth: "100%",
								overflowY: "auto",
								overflowWrap: "break-word",
							}}
						>
							{props.task_description ? props.task_description : "Brak"}
						</Typography>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
}
