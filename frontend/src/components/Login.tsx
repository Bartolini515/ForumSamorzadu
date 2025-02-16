import "../App.css";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import MyTextField from "./forms/MyTextField";
import MyPassField from "./forms/MyPassField";
import MyButton from "./forms/MyButton";
// import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import AxiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";
// import MyMessage from "./Message";

interface FormData {
	email?: string;
	password?: string;
}

export default function Login() {
	const navigate = useNavigate();
	const { handleSubmit, control, setError } = useForm<FormData>({
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const [showMessage, setShowMessage] = useState(false);

	const submission = (data: FormData) => {
		AxiosInstance.post(`login/`, {
			email: data.email,
			password: data.password,
		})

			.then((response) => {
				localStorage.setItem("Token", response.data.token);
				navigate(`/dashboard`);
			})
			.catch((error: any) => {
				setShowMessage(true);
				if (error.response && error.response.data) {
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
						Logowanie
					</Typography>

					{showMessage && (
						<Typography
							sx={{
								color: "red",
								marginBottom: 2,
								textAlign: "center",
							}}
						>
							Logowanie nie powiodło się, proszę spróbować ponownie.
						</Typography>
					)}

					<Box sx={{ marginBottom: 2 }}>
						<MyTextField label={"Email"} name={"email"} control={control} />
					</Box>

					<Box sx={{ marginBottom: 2 }}>
						<MyPassField label={"Hasło"} name={"password"} control={control} />
					</Box>

					<Box sx={{ marginTop: 2 }}>
						<MyButton label={"Zaloguj"} type={"submit"} />
					</Box>

					{/* <Box sx={{ textAlign: "center", marginTop: 2 }}>
                        <Link href="/request/password_reset" underline="hover">
                            Forgot password?
                        </Link>
                    </Box> */}
				</Box>
			</form>
		</Box>
	);
}
