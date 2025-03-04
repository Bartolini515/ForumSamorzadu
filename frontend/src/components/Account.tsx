import { Avatar, IconButton, Typography, Box } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import { useAlert } from "../contexts/AlertContext";
// import { useEffect, useState } from "react";
// import AxiosInstance from "./AxiosInstance";
import { useAuth } from "../contexts/AuthContext";

export default function Account() {
	const { user } = useAuth();
	// const { setAlert } = useAlert();
	// const [loading, setLoading] = useState(true);

	// const GetData = () => {
	// 	AxiosInstance.get("")
	// 		.then(() => {
	// 			setLoading(false);
	// 		})
	// 		.catch((error: any) => {
	// 			console.log(error);
	// 			setAlert(error.message, "error");
	// 		});
	// };
	// useEffect(() => {
	// 	GetData();
	// }, []);

	return (
		// <>
		// 	{loading ? (
		// 		<p>Pobieranie danych</p>
		// 	) : (
		<Box
			sx={{
				boxShadow: 24,
				minWidth: "260px",
				width: "20%",
				p: 2,
				alignItems: "center",
				flexDirection: "column",
				display: "flex",
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
			}}
		>
			<Box position="relative" mb={2}>
				<Avatar sx={{ width: 100, height: 100, "&:hover": { opacity: 0.7 } }} />
				<IconButton
					sx={{
						position: "absolute",
						bottom: 0,
						right: 0,
						backgroundColor: "white",
						"&:hover": { backgroundColor: "lightgray" },
					}}
				>
					<CameraAltIcon />
				</IconButton>
			</Box>
			<Box display="flex" alignItems="center" mb={1}>
				<Typography variant="h6">
					{user?.first_name} {user?.last_name}
				</Typography>
			</Box>
			<Box display="flex" alignItems="center" mb={1}>
				<Typography variant="h6">{user?.email}</Typography>
			</Box>
			<Box display="flex" alignItems="center">
				<Typography variant="h6">Role</Typography>
			</Box>
		</Box>
		// 	)}
		// </>
	);
}
