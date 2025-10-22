import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import AxiosInstance from "../../AxiosInstance";
import { Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MyTextField from "../../../UI/forms/MyTextField";
import { useForm } from "react-hook-form";
import MyButton from "../../../UI/forms/MyButton";
import { useAlert } from "../../../contexts/AlertContext";

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
	open: boolean;
	onClose: () => void;
	event_id: number;
}

interface FormData {
	title: string;
	content: string;
}

export default function CreateNoteModal(props: Props) {
	const { handleSubmit, control, setError, clearErrors } = useForm<FormData>({
		defaultValues: {
			title: "",
			content: "",
		},
	});

	const { setAlert } = useAlert();

	const submission = (data: FormData) => {
		const payload = {
			title: data.title,
			content: data.content,
			event: props.event_id,
		};
		AxiosInstance.post(`notes/`, payload)
			.then((response) => {
				props.onClose();
				setAlert(response.data.message, "success");
			})
			.catch((error: any) => {
				if (
					error.response &&
					error.response.data &&
					error.response.status === 400
				) {
					const serverErrors = error.response.data;
					Object.keys(serverErrors).forEach((field) => {
						setError(field as keyof FormData, {
							type: "server",
							message: serverErrors[field][0],
						});
					});
				} else {
					console.log(error);
					setAlert(
						error.response.data.message
							? error.response.data.message
							: error.message,
						"error"
					);
				}
			});
	};

	const handleClick = () => {
		clearErrors();
	};

	return (
		<>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={props.open}
				onClose={props.onClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={props.open}>
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
								Stwórz notatkę
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
							onClick={props.onClose}
						>
							<CloseIcon sx={{ color: "red" }} fontSize="medium" />
						</Button>
						<form onSubmit={handleSubmit(submission)}>
							<Box
								sx={{
									boxShadow: 3,
									padding: "20px",
									display: "flex",
									flexDirection: "row",
									marginBottom: "20px",
								}}
							>
								<Box
									sx={{
										fontWeight: "bold",
										alignContent: "center",
									}}
								>
									Tytuł:{" "}
								</Box>
								<Box sx={{ marginLeft: "10px" }}>
									<MyTextField label="Tytuł" name="title" control={control} />
								</Box>
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
									Zawartość:{" "}
								</Box>
								<Box sx={{ marginLeft: "10px", width: "100%" }}>
									<MyTextField
										label="Zawartość"
										name="content"
										control={control}
										multiline={true}
										maxRows={4}
									/>
								</Box>
							</Box>

							<MyButton
								label="Stwórz"
								type="submit"
								onClick={handleClick}
								style={{ width: "100%" }}
							/>
						</form>
					</Box>
				</Fade>
			</Modal>
		</>
	);
}
