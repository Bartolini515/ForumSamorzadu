import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

export default function FAB() {
	const style = {
		margin: 0,
		top: "auto",
		right: 20,
		bottom: 20,
		left: "auto",
		position: "fixed",
	};
	return (
		<Box sx={{ "& > :not(style)": { m: 1 } }}>
			<Fab size="medium" color="secondary" aria-label="add" sx={style}>
				<AddIcon />
			</Fab>
		</Box>
	);
}
