import "../App.css";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import MyPassField from "./forms/MyPassField";
import MyButton from "./forms/MyButton";
import { useForm } from "react-hook-form";
import AxiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";

interface FormData {
	password?: string;
	confirmPassword?: string;
}

export default function ChangePasswordLogin() {
	const navigate = useNavigate();
	const { handleSubmit, control, setError } = useForm<FormData>({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});
	const [showMessage, setShowMessage] = useState(false);
	const { setAlert } = useAlert();

	const submission = (data: FormData) => {
		if (data.password !== data.confirmPassword) {
			setError("confirmPassword", {
				type: "manual",
				message: "Hasła się nie zgadzają",
			});
			return;
		}
		const token = localStorage.getItem("Token");

		AxiosInstance.post(`login/change_password/${token}/`, {
			password: data.password,
		})
			.then((response: any) => {
				navigate(`/dashboard`);
				setAlert(response.data.message, "success");
			})
			.catch((error: any) => {
				setShowMessage(true);
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

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				backgroundColor: "#f5f5f5",
			}}
		>
			<form onSubmit={handleSubmit(submission)}>
				<Box
					sx={{
						width: 300,
						padding: 4,
						backgroundColor: "white",
						borderRadius: 2,
						boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
					}}
				>
					<Typography
						variant="h5"
						sx={{ textAlign: "center", marginBottom: 2, fontWeight: "bold" }}
					>
						Zmień hasło
					</Typography>

					{showMessage && (
						<Typography
							sx={{
								color: "red",
								marginBottom: 2,
								textAlign: "center",
							}}
						>
							Zmiana hasła nie powiodła się, proszę spróbować ponownie.
						</Typography>
					)}

					<Box sx={{ marginBottom: 2 }}>
						<MyPassField
							label={"Nowe hasło"}
							name={"password"}
							control={control}
						/>
					</Box>

					<Box sx={{ marginBottom: 2 }}>
						<MyPassField
							label={"Potwierdź hasło"}
							name={"confirmPassword"}
							control={control}
						/>
					</Box>

					<Box sx={{ marginTop: 2 }}>
						<MyButton label={"Zmień hasło"} type={"submit"} />
					</Box>
				</Box>
			</form>
		</Box>
	);
}
