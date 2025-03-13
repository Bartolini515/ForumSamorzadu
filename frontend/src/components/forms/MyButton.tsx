import Button from "@mui/material/Button";

interface Props {
	label: string;
	type: "submit" | "button" | "reset";
	color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
	style?: import("@mui/system").SxProps<import("@mui/material").Theme>;
	onClick?: () => void;
}

export default function MyButton(props: Props) {
	return (
		<Button
			type={props.type}
			variant="contained"
			color={props.color}
			className={"myButton"}
			onClick={props.onClick}
			sx={props.style}
		>
			{props.label}
		</Button>
	);
}
