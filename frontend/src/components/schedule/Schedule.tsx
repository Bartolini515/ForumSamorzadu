import { useEffect, useState } from "react";
import AxiosInstance from "../AxiosInstance";
import { Box, Skeleton } from "@mui/material";
import { useAlert } from "../../contexts/AlertContext";
import ScheduleTable from "./ScheduleTable";
import { useAuth } from "../../contexts/AuthContext";

export default function Schedule() {
	const [schedule, setSchedule] = useState([]);

	const { setAlert } = useAlert();
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();

	const GetData = () => {
		AxiosInstance.get("schedule/")
			.then((response) => {
				setSchedule(response.data);
				setLoading(false);
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
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}></Box>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}></Box>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}></Box>
					</Box>
					<Box
						sx={{
							boxShadow: 3,
							padding: "20px",
						}}
					>
						{schedule.length > 0 ? (
							<ScheduleTable schedule={schedule} />
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
