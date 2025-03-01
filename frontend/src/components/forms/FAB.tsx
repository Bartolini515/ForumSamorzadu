import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

interface Props {
	handleClick: () => void;
}

export default function FAB(props: Props) {
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
			<Fab
				size="medium"
				color="secondary"
				aria-label="add"
				sx={style}
				onClick={props.handleClick}
			>
				<AddIcon />
			</Fab>
		</Box>
	);
}
