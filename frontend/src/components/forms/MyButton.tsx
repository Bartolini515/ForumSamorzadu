import Button from "@mui/material/Button";

interface Props {
	label: string;
	type: "submit" | "button" | "reset";
	color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
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
		>
			{props.label}
		</Button>
	);
}
