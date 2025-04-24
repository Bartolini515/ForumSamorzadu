import { useEffect, useState } from "react";
import AxiosInstance from "../AxiosInstance";
import { Box, Skeleton } from "@mui/material";
import { useAlert } from "../../contexts/AlertContext";
import ScheduleTable from "./ScheduleTable";
import SingleSelect from "../forms/SingleSelect";
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
	const [selectedClass, setSelectedClass] = useState<string>("");
	const [options, setOptions] = useState<{ id: number; option: string }[]>([
		{ id: 0, option: "Brak opcji" },
	]);

	const { setAlert } = useAlert();
	const [loading, setLoading] = useState(true);
	// const { user } = useAuth();

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
				setOptions(tempOptions);
				setSelectedClass(tempOptions[0].option);
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
						}}
					>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}>
							<SingleSelect
								options={options}
								selectedOption={selectedClass}
								setSelectedOption={setSelectedClass}
								label={"Klasa"}
							/>
						</Box>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}></Box>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}></Box>
					</Box>
					<Box
						sx={{
							boxShadow: 3,
							padding: "20px",
						}}
					>
						{Object.keys(schedule).length > 0 ? (
							<ScheduleTable
								schedule={schedule}
								selectedOption={selectedClass}
							/>
						) : (
							<p style={{ textAlign: "center", fontWeight: "bold" }}>
								Brak planu do wyświetlenia
							</p>
						)}
					</Box>
				</>
			)}
		</>
	);
}
