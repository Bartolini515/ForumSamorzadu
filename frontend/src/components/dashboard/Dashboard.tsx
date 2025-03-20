import Box from "@mui/material/Box";
import DashboardCalendar from "./DashboardCalendar";
import AxiosInstance from "../AxiosInstance";
import { useEffect, useState } from "react";
import { useAlert } from "../../contexts/AlertContext";
import { useAuth } from "../../contexts/AuthContext";
import DashboardTasks from "./DashboardTasks";

interface Task {
	id: number;
	task_name: string;
	description: string | null;
	user: string | null;
	completion_status: boolean;
	due_date: string | null;
	event: string | null;
	user_id: string | null;
}

export default function Dashboard() {
	const [events, setEvents] = useState([]);
	const [tasks, setTasks] = useState<Task[]>([]);

	const { setAlert } = useAlert();
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);

	const GetData = () => {
		AxiosInstance.get("timetable/")
			.then((response) => {
				setEvents(response.data);
				setLoading(false);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
		AxiosInstance.get("tasks/")
			.then((response) => {
				for (const element of response.data) {
					if (
						(element.due_date >= new Date().toISOString().split("T")[0] ||
							(element.due_date === null &&
								element.completion_status === false)) &&
						element.user_id === user?.id
					) {
						setTasks(element);
						break;
						// TODO aby znajdowało taska który jest najbliżej terminu
					}
				}
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	useEffect(() => {
		GetData();
	}, []);

	return (
		<Box
			sx={{
				flexGrow: { sm: 1, xs: "none" },
				padding: 2,
				alignContent: "center",
			}}
		>
			<Box
				sx={{
					display: "flex",
					gap: 2,
					flexDirection: { sm: "row", xs: "column" },
					marginBottom: 2,
				}}
			>
				<Box
					sx={{
						flex: { sm: 1, xs: "none" },
						height: 200,
						boxShadow: 3,
						padding: "20px",
					}}
				>
					{loading ? (
						<p>Pobieranie danych</p>
					) : (
						<DashboardTasks tasks={tasks}></DashboardTasks>
					)}
				</Box>
				<Box
					sx={{
						flex: { sm: 1, xs: "none" },
						height: 200,
						boxShadow: 3,
						padding: "20px",
					}}
				></Box>
			</Box>
			<Box sx={{ height: { sm: 350, xs: 300 }, boxShadow: 3, padding: "20px" }}>
				{loading ? (
					<p>Pobieranie danych</p>
				) : (
					<DashboardCalendar events={events}></DashboardCalendar>
				)}
			</Box>
		</Box>
	);
}
