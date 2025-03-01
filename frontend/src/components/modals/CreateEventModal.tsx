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
import MyDatePicker from "../forms/MyDatePicker";
import MySelect from "../forms/MySelect";
import { useEffect, useState } from "react";

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
	open: boolean;
	onClose: () => void;
}

interface FormData {
	event_name: string;
	start_date: Date;
	end_date?: Date | null;
	description?: string;
	event_type: string;
	created_by: string;
}

export default function CreateUser(props: Props) {
	const [options, setOptions] = useState<any>([]);
	const { handleSubmit, control, setError, clearErrors } = useForm<FormData>({
		defaultValues: {
			event_name: "",
			start_date: new Date(),
			end_date: null,
			description: "",
			event_type: "1",
		},
	});

	const [loading, setLoading] = useState(true);

	const token = localStorage.getItem("Token");

	const submission = (data: FormData) => {
		if (data.end_date) {
			const date = new Date(data.end_date);
			date.setDate(date.getDate() + 2);
			data.end_date = new Date(date.toISOString().split("T")[0]);
		}
		data.start_date = new Date(data.start_date.toISOString().split("T")[0]);

		console.log(data);
		AxiosInstance.post(`timetable/create/${token}/`, {
			event_name: data.event_name,
			start_date: data.start_date,
			end_date: data.end_date,
			event_type: data.event_type,
			description: data.description,
		})
			.then(() => {
				props.onClose();
				console.log("done");
				console.log(props.onClose);
			})
			.catch((error: any) => {
				console.log(error);
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
				}
			});
	};

	const getEventTypes = () => {
		AxiosInstance.get("timetable/event_types/")
			.then((response) => {
				console.log(response.data);
				setOptions(response.data);
				setLoading(false);
			})
			.catch((error: any) => {
				console.log(error);
			});
	};

	useEffect(() => {
		getEventTypes();
	}, []);

	const handleClick = () => {
		clearErrors();
	};

	return (
		<div>
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
						<p>Pobieranie danych</p>
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
									<Box sx={{ fontWeight: "bold" }}>Nazwa wydarzenia</Box>
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
									<Box sx={{ fontWeight: "bold" }}>Data wydarzenia: </Box>
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
									<Box sx={{ fontWeight: "bold" }}>Data zakończenia: </Box>
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
									<Box sx={{ fontWeight: "bold" }}>Opis: </Box>
									<Box sx={{ marginLeft: "10px" }}>
										<MyTextField
											label="Opis"
											name="description"
											control={control}
											multiline={true}
											maxRows={4}
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
									<Box sx={{ fontWeight: "bold" }}>Typ wydarzenia: </Box>
									<Box sx={{ marginLeft: "10px" }}>
										<MySelect
											label="Typ wydarzenia"
											name="event_type"
											options={options}
											control={control}
										/>
									</Box>
								</Box>

								<MyButton label="Stwórz" type="submit" onClick={handleClick} />
							</form>
						</Box>
					)}
				</Fade>
			</Modal>
		</div>
	);
}
