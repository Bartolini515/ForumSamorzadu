import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MyButton from "../forms/MyButton";
import SingleSelect from "../forms/SingleSelect";

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
	option: {
		name: string;
		labelModal: string;
		forms: {
			SingleSelect1?: {
				options: { id: number; option: string }[];
				selectedOption: any;
				setSelectedOption: (value: any) => void;
				label: string;
			};
		};
		payload?: (data: any) => any;
	};
	open: boolean;
	setOpen: any;
	onClose: () => void;
}

export default function ScheduleModal(props: Props) {
	const handleClose = () => {
		props.setOpen(false);
	};

	return (
		<>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={props.open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={props.open}>
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
								{props.option.labelModal}
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
							onClick={handleClose}
						>
							<CloseIcon sx={{ color: "red" }} fontSize="medium" />
						</Button>

						<Box
							sx={{
								boxShadow: 3,
								padding: "20px",
								display: "flex",
								flexDirection: "row",
								marginBottom: "20px",
							}}
						>
							{props.option.forms.SingleSelect1 ? (
								<SingleSelect
									options={props.option.forms.SingleSelect1.options}
									selectedOption={
										props.option.forms.SingleSelect1.selectedOption
									}
									setSelectedOption={
										props.option.forms.SingleSelect1.setSelectedOption
									}
									label={props.option.forms.SingleSelect1.label}
								></SingleSelect>
							) : null}
						</Box>
						<MyButton
							label="Potwierdź"
							type="submit"
							onClick={() => props.onClose()}
							style={{ width: "100%" }}
						/>
					</Box>
				</Fade>
			</Modal>
		</>
	);
}
