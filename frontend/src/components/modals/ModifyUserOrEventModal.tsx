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
import { useEffect, useState } from "react";
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
	option: string;
	open: boolean;
	setOpen: any;
	setRefresh: any;
	id: string;
	setClickedId: any;
}

interface ResponseData {
	id: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	last_login?: string;
	event_type?: string;
}

interface FormData {
	email?: string;
	password?: string;
	first_name?: string;
	last_name?: string;
	event_type?: string;
}

export default function ModifyUserOrEvent(props: Props) {
	const [responseData, setResponseData] = useState<ResponseData>({
		id: "",
		first_name: "",
		last_name: "",
		email: "",
		last_login: "",
		event_type: "",
	});
	const handleClose = () => {
		props.setOpen(false);
		props.setRefresh(true);
	};

	const { setAlert } = useAlert();
	const [loading, setLoading] = useState(true);

	const GetData = () => {
		if (props.option === "user") {
			AxiosInstance.get(`moderator_panel/user/${props.id}/`)
				.then((response) => {
					setResponseData(response.data);
					setLoading(false);
				})
				.catch((error: any) => {
					console.log(error);
					setAlert(error.message, "error");
				});
		} else if (props.option === "event_types") {
			AxiosInstance.get(`moderator_panel/event_types/${props.id}/`)
				.then((response) => {
					setResponseData(response.data);
					setLoading(false);
				})
				.catch((error: any) => {
					console.log(error);
					setAlert(error.message, "error");
				});
		}
	};
	useEffect(() => {
		GetData();
	}, []);

	const { handleSubmit, control, setError, clearErrors, reset } =
		useForm<FormData>({
			defaultValues: {
				email: responseData.email,
				password: "",
				first_name: responseData.first_name,
				last_name: responseData.last_name,
				event_type: responseData.event_type,
			},
		});

	useEffect(() => {
		reset({
			email: responseData.email,
			password: "",
			first_name: responseData.first_name,
			last_name: responseData.last_name,
			event_type: responseData.event_type,
		});
	}, [responseData, reset]);

	const submission = (data: FormData) => {
		const payload: any = {
			email: data.email,
			first_name: data.first_name,
			last_name: data.last_name,
		};

		if (data.password) {
			payload.password = data.password;
		}

		if (props.option === "user") {
			AxiosInstance.put(`moderator_panel/user/${props.id}/update/`, payload)
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
						console.log(error);
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
		} else if (props.option === "event_types") {
			AxiosInstance.put(`moderator_panel/event_types/${props.id}/update/`, {
				event_type: data.event_type,
			})
				.then((response) => {
					handleClose();
					setAlert(response.data.message, "success");
				})
				.catch((error: any) => {
					if (error.response && error.response.data) {
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
		}
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
						{loading ? (
							<p>Pobieranie danych</p>
						) : (
							<>
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
										{props.option === "user"
											? "Modyfikuj użytkownika"
											: "Modyfikuj typ wydarzenia"}
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
											{props.option === "user"
												? "Email"
												: "Nazwa typu wydarzeń:"}
										</Box>
										<Box sx={{ marginLeft: "10px" }}>
											<MyTextField
												label={
													props.option === "user" ? "Email" : "Typ wydarzeń"
												}
												name={props.option === "user" ? "email" : "event_type"}
												control={control}
											/>
										</Box>
									</Box>

									{props.option === "user" && (
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
												<Box
													sx={{ fontWeight: "bold", alignContent: "center" }}
												>
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
												<Box
													sx={{ fontWeight: "bold", alignContent: "center" }}
												>
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
												<Box
													sx={{ fontWeight: "bold", alignContent: "center" }}
												>
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
										label="Zatwierdź"
										type="submit"
										onClick={clearErrors}
										style={{ width: "100%" }}
									/>
								</form>
							</>
						)}
					</Box>
				</Fade>
			</Modal>
		</>
	);
}
