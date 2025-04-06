import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import AxiosInstance from "../AxiosInstance";
import { Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MyTextField from "../forms/MyTextField";
import { useForm } from "react-hook-form";
import MyButton from "../forms/MyButton";
import { useAlert } from "../../contexts/AlertContext";
import MyPassField from "../forms/MyPassField";

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
	option: {
		name: string;
		label: string;
		labelSingle: string;
		headers: string[];
		buttonAdd: string;
		forms: {
			first_field: {
				title: string;
				label: string;
				name: string;
				helperText?: string;
			};
		};
		payload: (data: any) => any;
	};
	open: boolean;
	setOpen: any;
	setRefresh: any;
}

interface FormData {
	email?: string;
	password?: string;
	first_name?: string;
	last_name?: string;
	event_type?: string;
	event_color?: string;
}

export default function CreateUserOrEvent(props: Props) {
	const { handleSubmit, control, setError, clearErrors } = useForm<FormData>({
		defaultValues: {
			email: "",
			password: "",
			first_name: "",
			last_name: "",
			event_type: "",
			event_color: "",
		},
	});

	const handleClose = () => {
		props.setOpen(false);
		props.setRefresh(true);
	};

	const { setAlert } = useAlert();

	const submission = (data: FormData) => {
		AxiosInstance.post(
			`moderator_panel/${props.option.name}/create/`,
			props.option.payload(data)
		)
			.then((response) => {
				handleClose();
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
					setAlert(error.message, "error");
				}
			});
	};

	return (
		<>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={props.open}
				onClose={handleClose}
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
								Stwórz {props.option.labelSingle}
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
								<Box sx={{ fontWeight: "bold", alignContent: "center" }}>
									{props.option.forms.first_field.title}:{" "}
								</Box>
								<Box sx={{ marginLeft: "10px" }}>
									<MyTextField
										label={props.option.forms.first_field.label}
										name={props.option.forms.first_field.name}
										control={control}
										helperText={props.option.forms.first_field.helperText}
									/>
								</Box>
							</Box>

							{props.option.name === "user" && (
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
											Hasło:{" "}
										</Box>
										<Box sx={{ marginLeft: "10px" }}>
											<MyPassField
												label="Hasło"
												name="password"
												control={control}
											/>
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
											Imię:{" "}
										</Box>
										<Box sx={{ marginLeft: "10px" }}>
											<MyTextField
												label="Imię"
												name="first_name"
												control={control}
											/>
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
											Nazwisko:{" "}
										</Box>
										<Box sx={{ marginLeft: "10px" }}>
											<MyTextField
												label="Nazwisko"
												name="last_name"
												control={control}
											/>
										</Box>
									</Box>
								</>
							)}
							<MyButton
								label="Stwórz"
								type="submit"
								onClick={() => clearErrors()}
								style={{ width: "100%" }}
							/>
						</form>
					</Box>
				</Fade>
			</Modal>
		</>
	);
}
