import { Avatar, Typography, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import MyButton from "./forms/MyButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChangeAvatarModal from "./modals/ChangeAvatarModal";

export default function Account() {
	const [openChangeAvatarModal, setOpenChangeAvatarModal] = useState(false);

	const navigate = useNavigate();
	const { user } = useAuth();

	const handleClickAvatar = () => {
		setOpenChangeAvatarModal(true);
	};

	return (
		<Box
			sx={{
				boxShadow: 24,
				minWidth: "max-content",
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
				<Avatar
					sx={{
						width: 100,
						height: 100,
						"&:hover": {
							filter: "brightness(0.8)",
							cursor: "pointer",
							transition: "0.5s",
						},
					}}
					alt="Profile picture"
					src={
						typeof user?.profile_picture === "string"
							? user.profile_picture
							: undefined
					}
					onClick={() => {
						handleClickAvatar();
					}}
				/>
			</Box>
			<Box display="flex" alignItems="center" mb={1}>
				<Typography variant="h6">
					{user?.first_name} {user?.last_name}
				</Typography>
			</Box>
			<Box display="flex" alignItems="center" mb={1}>
				<Typography variant="h6">{user?.email}</Typography>
			</Box>
			{/* <Box display="flex" alignItems="center">
				<Typography variant="h6">Role</Typography>
			</Box> */}

			<MyButton
				label="Zmień hasło"
				type="button"
				color="primary"
				onClick={() => {
					navigate("/change_password");
				}}
				style={{ marginTop: "10px" }}
			/>

			{openChangeAvatarModal && (
				<ChangeAvatarModal
					open={openChangeAvatarModal}
					onClose={() => setOpenChangeAvatarModal(false)}
				/>
			)}
		</Box>
	);
}
