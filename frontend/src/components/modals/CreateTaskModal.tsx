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
import { useAlert } from "../../contexts/AlertContext";

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
	event_id?: number | null;
}

interface FormData {
	task_name: string;
	description: string;
	event?: number | null;
	due_date?: Date | null;
}

interface Event {
	id: number;
	title: string;
	start: Date;
	end: Date | null;
	description: string | null;
}

export default function CreateEventModal(props: Props) {
	const [options, setOptions] = useState<any>([]);
	const [selectedOption, setSelectedOption] = useState<number | null>(
		props.event_id ? props.event_id : null
	);
	const [events, setEvents] = useState<Event[]>([]);
	const [maxDate, setMaxDate] = useState<Date | null>(null);
	const { handleSubmit, control, setError, clearErrors, resetField } =
		useForm<FormData>({
			defaultValues: {
				task_name: "",
				description: "",
				event: props.event_id ? props.event_id : null,
				due_date: null,
			},
		});

	const [loading, setLoading] = useState(true);

	const { setAlert } = useAlert();

	const submission = (data: FormData) => {
		const payload = {
			task_name: data.task_name,
			description: data.description,
			due_date: data.due_date
				? data.due_date.toISOString().split("T")[0]
				: null,
			event: data.event,
			user_id: null,
		};
		AxiosInstance.post(`tasks/create/`, payload)
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
					setAlert(error.message, "error");
				}
			});
	};

	const getEvents = () => {
		AxiosInstance.get("timetable/")
			.then((response) => {
				setEvents(response.data);
				let tempOptions: { id: number; option: string }[] = [];
				response.data.forEach((element: any) => {
					if (
						(element.end ? element.end : element.start) >=
						new Date().toISOString().split("T")[0]
					) {
						tempOptions.push({ id: element.id, option: element.title });
					}
				});
				setOptions(tempOptions);
				setLoading(false);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	useEffect(() => {
		getEvents();
	}, []);

	useEffect(() => {
		let selectedEvent = events.find(
			(event) => event.id === Number(selectedOption)
		);

		if (selectedEvent) {
			let date = selectedEvent.end
				? new Date(selectedEvent.end)
				: new Date(selectedEvent.start);
			resetField("due_date", { defaultValue: date });
			setMaxDate(date);
		}
	}, [selectedOption, loading]);

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
									Stwórz zadanie
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
										Nazwa zadania:{" "}
									</Box>
									<Box sx={{ marginLeft: "10px" }}>
										<MyTextField
											label="Nazwa zadania"
											name="task_name"
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
										Wydarzenie:{" "}
									</Box>
									<Box sx={{ marginLeft: "10px", width: "60%" }}>
										<MySelect
											label="Wydarzenie"
											name="event"
											options={options}
											control={control}
											selectedOption={selectedOption}
											setSelectedOption={setSelectedOption}
											disabled={props.event_id ? true : false}
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
										Termin:{" "}
									</Box>
									<Box sx={{ marginLeft: "10px" }}>
										<MyDatePicker
											label="Termin"
											name="due_date"
											control={control}
											disablePast={true}
											maxDate={maxDate}
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
					)}
				</Fade>
			</Modal>
		</>
	);
}
