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
import MySelect from "../../../UI/forms/MySelect";
import { useEffect, useState } from "react";
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

export default function CreateEventModal(props: Props) {
	const [options, setOptions] = useState<any>([]);
	const [selectedOption, setSelectedOption] = useState<any>(null);
	const [optionsColor, setOptionsColor] = useState<any>([]);
	const [selectedOptionColor, setSelectedOptionColor] = useState<any>(null);
	const { handleSubmit, control, setError, clearErrors } = useForm<FormData>({
		defaultValues: {
			event_name: "",
			start_date: new Date(),
			end_date: null,
			description: "",
			event_color: "",
			event_type: "",
		},
	});

	const [loading, setLoading] = useState(true);

	const { setAlert } = useAlert();

	const submission = (data: FormData) => {
		if (data.end_date) {
			const date = new Date(data.end_date);
			date.setDate(date.getDate() + 2);
			data.end_date = new Date(date);
		}

		const payload = {
			event_name: data.event_name,
			start_date: data.start_date.toISOString().split("T")[0],
			end_date: data.end_date
				? data.end_date.toISOString().split("T")[0]
				: null,
			event_type: data.event_type,
			event_color: data.event_color,
			description: data.description,
		};

		AxiosInstance.post(`timetable/create/`, payload)
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

	const getEventTypes = () => {
		AxiosInstance.get("timetable/event_types/")
			.then((response) => {
				let tempOptions: { id: number; option: string }[] = [];
				response.data.forEach((element: any) => {
					tempOptions.push({ id: element.id, option: element.event_type });
				});
				setOptions(tempOptions);
				setLoading(false);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	const getEventColors = () => {
		AxiosInstance.get("timetable/event_colors/")
			.then((response) => {
				let tempOptions: { id: number; option: string; label: JSX.Element }[] =
					[];
				response.data.forEach((element: any) => {
					tempOptions.push({
						id: element.id,
						option: element.event_color,
						label: (
							<div style={{ display: "flex", alignItems: "center" }}>
								<div
									style={{
										width: "20px",
										height: "20px",
										backgroundColor: `#${element.event_color}`,
										borderRadius: "50%",
										marginRight: "10px",
										border: "1px solid #ccc",
									}}
								></div>
								#{element.event_color}
							</div>
						),
					});
				});
				setOptionsColor(tempOptions);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	useEffect(() => {
		getEventTypes();
		getEventColors();
	}, []);

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
									<Box
										sx={{
											fontWeight: "bold",
											alignContent: "center",
										}}
									>
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
										Typ wydarzenia:{" "}
									</Box>
									<Box sx={{ marginLeft: "10px", width: "40%" }}>
										<MySelect
											label="Typ wydarzenia"
											name="event_type"
											options={options}
											control={control}
											selectedOption={selectedOption}
											setSelectedOption={setSelectedOption}
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
										Kolor wydarzenia:{" "}
									</Box>
									<Box sx={{ marginLeft: "10px", width: "40%" }}>
										<MySelect
											label="Kolor wydarzenia"
											name="event_color"
											options={optionsColor}
											control={control}
											selectedOption={selectedOptionColor}
											setSelectedOption={setSelectedOptionColor}
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
