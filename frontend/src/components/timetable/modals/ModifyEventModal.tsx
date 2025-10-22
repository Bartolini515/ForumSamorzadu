import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import AxiosInstance from "../../AxiosInstance";
import { Button, Typography, Skeleton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MyTextField from "../../../UI/forms/MyTextField";
import { useForm } from "react-hook-form";
import MyButton from "../../../UI/forms/MyButton";
import MyDatePicker from "../../../UI/forms/MyDatePicker";
import { useEffect, useState } from "react";
import { formatDate } from "../../../util/formatDate";
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
	id: number;
	event: {
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
	};
	open: boolean;
	onClose: () => void;
}

interface FormData {
	event_name: string;
	start_date: Date;
	end_date?: Date | null;
	description?: string;
	event_color: string;
	event_type: string;
	created_by: string;
}

export default function ModifyEventModal(props: Props) {
	const { handleSubmit, control, setError, clearErrors, reset } =
		useForm<FormData>({
			defaultValues: {
				event_name: "",
				start_date: new Date(),
				end_date: null,
				description: "",
				event_type: "1",
			},
		});

	const [loading, setLoading] = useState(true);

	const { setAlert } = useAlert();

	const submission = (data: FormData) => {
		const payload = {
			event_name: data.event_name,
			start_date: formatDate(data.start_date),
			end_date: formatDate(data.end_date),
			description: data.description,
		};

		AxiosInstance.put(`timetable/${props.id}/`, payload)
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
					setAlert(
						error.response.data.message
							? error.response.data.message
							: error.message,
						"error"
					);
				}
			});
	};

	const getEventDetails = () => {
		AxiosInstance.get(`timetable/${props.id}`)
			.then((response) => {
				const event = response.data;
				reset({
					event_name: event.title,
					start_date: new Date(event.start),
					end_date: event.end ? new Date(event.end) : null,
					description: event.description,
					event_type: event.event_type,
				});
				setLoading(false);
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
		getEventDetails();
	}, [props.id]);

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
					{loading ? (
						<Skeleton variant="rectangular" height={400} />
					) : (
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
									Stwórz wydarzenie
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
									<Box sx={{ fontWeight: "bold", alignContent: "center" }}>
										Nazwa wydarzenia
									</Box>
									<Box sx={{ marginLeft: "10px" }}>
										<MyTextField
											label="Nazwa wydarzenia"
											name="event_name"
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
										Data wydarzenia:{" "}
									</Box>
									<Box sx={{ marginLeft: "10px" }}>
										<MyDatePicker
											label="Data wydarzenia"
											name="start_date"
											control={control}
											disablePast={true}
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
										Data zakończenia:{" "}
									</Box>
									<Box sx={{ marginLeft: "10px" }}>
										<MyDatePicker
											label="Data zakończenia"
											name="end_date"
											control={control}
											helperText="W przypadku gdy trwa kilka dni"
											disablePast={true}
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
										Opis:{" "}
									</Box>
									<Box sx={{ marginLeft: "10px", width: "100%" }}>
										<MyTextField
											label="Opis"
											name="description"
											style={{ width: "100%" }}
											control={control}
											multiline={true}
											maxRows={4}
										/>
									</Box>
								</Box>

								<MyButton
									label="Zatwierdź"
									type="submit"
									onClick={handleClick}
									style={{ width: "100%" }}
								/>
							</form>
						</Box>
					)}
				</Fade>
			</Modal>
		</>
	);
}
