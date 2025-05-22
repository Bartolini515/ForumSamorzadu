import { useEffect, useState } from "react";
import AxiosInstance from "../AxiosInstance";
import { Box, Skeleton } from "@mui/material";
import { useAlert } from "../../contexts/AlertContext";
import ScheduleTable from "./ScheduleTable";
import MyButton from "../forms/MyButton";
import ScheduleModal from "../modalsAndDialogs/ScheduleModal";
// import { useAuth } from "../../contexts/AuthContext";

interface ScheduleData {
	[className: string]: {
		day: "Poniedziałek" | "Wtorek" | "Środa" | "Czwartek" | "Piątek";
		lessons: {
			lesson_number: number;
			entries: [
				{
					subject: string;
					teacher: string;
					room: string;
					group?: string;
				}
			];
		}[];
	}[];
}

export default function Schedule() {
	const [schedule, setSchedule] = useState<ScheduleData>({});
	const [selectedClass, setSelectedClass] = useState<number>(0);
	// const [selectedClass2, setSelectedClass2] = useState<number>(0);
	const [selectedDay, setSelectedDay] = useState<number>(0);
	const [allRooms, setAllRooms] = useState<string[]>(["Brak sal"]);
	const [options, setOptions] = useState<{ id: number; option: string }[]>([
		{ id: 0, option: "Brak opcji" },
	]);
	const [open, setOpen] = useState(false);
	const [selectedType, setSelectedType] =
		useState<keyof typeof typeMap>("show");

	const typeMap = {
		show: {
			name: "show",
			labelModal: "Pokaż plan",
			forms: {
				SingleSelect1: {
					options: options,
					selectedOption: selectedClass,
					setSelectedOption: setSelectedClass,
					label: "Wybierz klasę",
				},
			},
		},
		// compare: {
		// 	name: "compare",
		// 	labelModal: "Porównaj plany",
		// 	forms: {
		// 		SingleSelect1: {
		// 			options: options,
		// 			selectedOption: selectedClass,
		// 			setSelectedOption: setSelectedClass,
		// 			label: "Wybierz klasę do porównania",
		// 		},
		// 		SingleSelect2: {
		// 			options: options,
		// 			selectedOption: selectedClass2,
		// 			setSelectedOption: setSelectedClass2,
		// 			label: "Wybierz klasę do porównania",
		// 		},
		// 	},
		// },
		rooms: {
			name: "rooms",
			labelModal: "Sprawdź wolne sale",
			forms: {
				SingleSelect1: {
					options: [
						{ id: 0, option: "Poniedziałek" },
						{ id: 1, option: "Wtorek" },
						{ id: 2, option: "Środa" },
						{ id: 3, option: "Czwartek" },
						{ id: 4, option: "Piątek" },
					],
					selectedOption: selectedDay,
					setSelectedOption: setSelectedDay,
					label: "Wybierz dzień",
				},
			},
		},
	};

	const { setAlert } = useAlert();
	const [loading, setLoading] = useState(true);
	// const { user } = useAuth();

	const handleClick = (type: keyof typeof typeMap) => {
		setSelectedType(type);
		setOpen(true);
	};

	const GetData = () => {
		AxiosInstance.get("schedule/")
			.then((response) => {
				setSchedule(response.data);
				setLoading(false);

				let tempOptions = [] as { id: number; option: string }[];
				Object.keys(response.data).forEach((key, index) => {
					if (response.data[key].length > 0) {
						tempOptions.push({ id: index, option: key });
					}
				});

				let rooms = [] as string[];
				Object.keys(response.data).forEach((key) => {
					response.data[key].forEach((day: any) => {
						day.lessons.forEach((lesson: any) => {
							lesson.entries.forEach((entry: any) => {
								if (!rooms.includes(entry.room)) {
									rooms.push(entry.room);
								}
							});
						});
					});
				});

				setAllRooms(rooms);
				setOptions(tempOptions);
			})
			.catch((error: any) => {
				if (error.response && error.response.status === 404) {
					setLoading(false);
					setAlert(
						"Brak planu do wyświetlenia. Skontaktuj się z administratorem",
						"error"
					);
				} else {
					console.log(error);
					setAlert(error.message, "error");
				}
			});
	};

	useEffect(() => {
		GetData();
	}, []);

	return (
		<>
			{loading ? (
				<Skeleton variant="rectangular" height={400} />
			) : (
				<>
					<Box
						sx={{
							boxShadow: 3,
							padding: "20px",
							display: "flex",
							justifyContent: "space-evenly",
							marginBottom: "20px",
							flexDirection: { xs: "column", sm: "row" },
							flexWrap: "wrap",
							alignItems: "center",
							gap: "10px",
						}}
					>
						<Box
							sx={{
								width: { xs: "100%", sm: "30%" },
							}}
						>
							<MyButton
								label={"Pokaż plan"}
								type={"button"}
								style={{ width: "100%" }}
								variant={"outlined"}
								onClick={() => handleClick("show")}
							/>
						</Box>
						{/* <Box
							sx={{
								width: { xs: "100%", sm: "30%" },
							}}
						>
							<MyButton
								label={"Porównaj plany"}
								type={"button"}
								style={{ width: "100%" }}
								variant={"outlined"}
								onClick={() => handleClick("compare")}
							/>
						</Box> */}
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}>
							<MyButton
								label={"Sprawdź wolne sale"}
								type={"button"}
								style={{ width: "100%" }}
								variant={"outlined"}
								onClick={() => handleClick("rooms")}
							/>
						</Box>
						{/* <Box sx={{ width: { xs: "100%", sm: "30%" } }}>
							<MyButton
								label={"Ilość klas w danej godzinie"}
								type={"button"}
								style={{ width: "100%" }}
								variant={"outlined"}
							/>
						</Box> */}
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}>
							<MyButton
								label={"Zaplanuj przejście po klasach"}
								type={"button"}
								style={{ width: "100%" }}
								variant={"outlined"}
							/>
						</Box>
					</Box>

					<Box
						sx={{
							boxShadow: 3,
							padding: "20px",
						}}
					>
						{selectedType === "show" &&
							(Object.keys(schedule).length > 0 ? (
								<ScheduleTable
									schedule={schedule}
									selectedOption={options[selectedClass].option}
								/>
							) : (
								<p style={{ textAlign: "center", fontWeight: "bold" }}>
									Brak planu do wyświetlenia
								</p>
							))}
					</Box>
					{open && (
						<ScheduleModal
							option={typeMap[selectedType]}
							open={open}
							setOpen={setOpen}
							onClose={() => {
								setOpen(false);
							}}
						/>
					)}
				</>
			)}
		</>
	);
}
